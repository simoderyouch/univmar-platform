locals {
  ecr_repositories = toset([
    "univmar-production-api",
    "univmar-production-erp-web",
    "univmar-production-landing",
  ])
}

resource "aws_ecr_repository" "app" {
  for_each = local.ecr_repositories

  name                 = each.value
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_lifecycle_policy" "app" {
  for_each = aws_ecr_repository.app

  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Remove untagged images after seven days"

        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }

        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Keep the 15 newest images"

        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 15
        }

        action = {
          type = "expire"
        }
      }
    ]
  })
}

output "ecr_repository_urls" {
  value = {
    for name, repository in aws_ecr_repository.app : name =>
    repository.repository_url
  }
}
