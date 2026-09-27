data "aws_iam_policy_document" "ecs_tasks_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_ecs_cluster" "main" {
  name = "univmar-production"
}

resource "aws_cloudwatch_log_group" "service" {
  for_each = toset([
    "api",
    "erp-web",
    "landing",
  ])

  name              = "/ecs/univmar-production-${each.value}"
  retention_in_days = 14
}

# Pulls private ECR images, writes container logs, and injects the RDS password.
resource "aws_iam_role" "ecs_task_execution" {
  name               = "univmar-production-ecs-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_database_secret" {
  name = "read-database-secret"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = aws_db_instance.main.master_user_secret[0].secret_arn
      }
    ]
  })
}

# Used only by the Spring Boot API at runtime.
resource "aws_iam_role" "api_task" {
  name               = "univmar-production-api-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

resource "aws_iam_role_policy" "api_task_assets" {
  name = "manage-private-assets"
  role = aws_iam_role.api_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = aws_s3_bucket.assets.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
        ]
        Resource = "${aws_s3_bucket.assets.arn}/*"
      }
    ]
  })
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_task_execution_role_arn" {
  value = aws_iam_role.ecs_task_execution.arn
}

output "api_task_role_arn" {
  value = aws_iam_role.api_task.arn
}
