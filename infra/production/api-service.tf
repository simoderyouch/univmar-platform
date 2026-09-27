data "aws_secretsmanager_secret" "runtime_jwt" {
  name = "univmar/production/jwt"
}

data "aws_secretsmanager_secret" "bootstrap_admin" {
  name = "univmar/production/bootstrap-admin"
}

data "aws_secretsmanager_secret" "smtp" {
  name = "univmar/production/smtp"
}

resource "aws_ecs_task_definition" "api" {
  family                   = "univmar-production-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024

  execution_role_arn = aws_iam_role.ecs_task_execution.arn
  task_role_arn      = aws_iam_role.api_task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = "${aws_ecr_repository.app["univmar-production-api"].repository_url}:${var.api_image_tag}"
      essential = true

      portMappings = [
        {
          containerPort = 8080
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      environment = [
        { name = "JAVA_TOOL_OPTIONS", value = "-XX:MaxRAMPercentage=70.0" },
        { name = "SPRING_DATASOURCE_URL", value = "jdbc:postgresql://${aws_db_instance.main.address}:5432/univmar?sslmode=require" },
        { name = "SPRING_DATASOURCE_USERNAME", value = "univmar_admin" },
        { name = "UNIVMAR_INITIAL_ADMIN_EMAIL", value = "mohamededderyouch5@gmail.com" },
        { name = "UNIVMAR_CORS_ALLOWED_ORIGINS", value = "https://universmarbre.com,https://www.universmarbre.com,https://landing.universmarbre.com,https://erp.universmarbre.com" },
        { name = "UNIVMAR_PUBLIC_API_URL", value = "https://api.universmarbre.com/api/v1" },
        { name = "UNIVMAR_STORAGE_PROVIDER", value = "s3" },
        { name = "UNIVMAR_STORAGE_S3_ENDPOINT", value = "" },
        { name = "UNIVMAR_STORAGE_S3_REGION", value = "eu-west-3" },
        { name = "UNIVMAR_STORAGE_S3_BUCKET", value = aws_s3_bucket.assets.bucket },

        { name = "UNIVMAR_WEBSITE_EMAIL_ENABLED", value = "true" },
        { name = "UNIVMAR_WEBSITE_EMAIL_TO", value = "sales@universmarbre.com" },
        { name = "UNIVMAR_WEBSITE_EMAIL_FROM", value = "mohamededderyouch5@gmail.com" },

        { name = "UNIVMAR_QUOTATION_EMAIL_ENABLED", value = "true" },
        { name = "UNIVMAR_QUOTATION_EMAIL_FROM", value = "mohamededderyouch5@gmail.com" },
        { name = "UNIVMAR_QUOTATION_PUBLIC_BASE_URL", value = "https://landing.universmarbre.com/fr/quote" },

        { name = "SPRING_MAIL_HOST", value = "smtp.gmail.com" },
        { name = "SPRING_MAIL_PORT", value = "587" },
        { name = "SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH", value = "true" },
        { name = "SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE", value = "true" },
      ]

      secrets = [
        { name = "SPRING_DATASOURCE_PASSWORD", valueFrom = "${aws_db_instance.main.master_user_secret[0].secret_arn}:password::" },
        { name = "UNIVMAR_JWT_SECRET", valueFrom = data.aws_secretsmanager_secret.runtime_jwt.arn },
        { name = "UNIVMAR_INITIAL_ADMIN_PASSWORD", valueFrom = "${data.aws_secretsmanager_secret.bootstrap_admin.arn}:password::" },
        { name = "SPRING_MAIL_USERNAME", valueFrom = "${data.aws_secretsmanager_secret.smtp.arn}:username::" },
        { name = "SPRING_MAIL_PASSWORD", valueFrom = "${data.aws_secretsmanager_secret.smtp.arn}:password::" },
      ]


      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.service["api"].name
          awslogs-region        = "eu-west-3"
          awslogs-stream-prefix = "api"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "univmar-production-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  health_check_grace_period_seconds = 90

  network_configuration {
    subnets          = values(aws_subnet.public)[*].id
    security_groups  = [aws_security_group.api.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8080
  }
}

output "public_api_catalog_url" {
  value = "https://api.universmarbre.com/api/v1/public/catalog/categories"
}
