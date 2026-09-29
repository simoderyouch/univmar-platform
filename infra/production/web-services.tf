resource "aws_ecs_task_definition" "landing" {
  family                   = "univmar-production-landing"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512

  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "landing"
      image     = "${aws_ecr_repository.app["univmar-production-landing"].repository_url}:${var.landing_image_tag}"
      essential = true

      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      environment = [
        { name = "ERP_PUBLIC_API_URL", value = "http://${aws_service_discovery_service.api.name}.${aws_service_discovery_private_dns_namespace.main.name}:8080/api/v1" },
        { name = "NEXT_PUBLIC_SITE_URL", value = "https://landing.universmarbre.com" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.service["landing"].name
          awslogs-region        = "eu-west-3"
          awslogs-stream-prefix = "landing"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "landing" {
  name            = "univmar-production-landing"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.landing.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  health_check_grace_period_seconds = 60

  network_configuration {
    subnets          = values(aws_subnet.public)[*].id
    security_groups  = [aws_security_group.landing.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.landing.arn
    container_name   = "landing"
    container_port   = 3000
  }
}

resource "aws_ecs_task_definition" "erp_web" {
  family                   = "univmar-production-erp-web"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512

  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "erp-web"
      image     = "${aws_ecr_repository.app["univmar-production-erp-web"].repository_url}:${var.erp_image_tag}"
      essential = true

      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.service["erp-web"].name
          awslogs-region        = "eu-west-3"
          awslogs-stream-prefix = "erp-web"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "erp_web" {
  name            = "univmar-production-erp-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.erp_web.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  health_check_grace_period_seconds = 45

  network_configuration {
    subnets          = values(aws_subnet.public)[*].id
    security_groups  = [aws_security_group.erp_web.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.erp_web.arn
    container_name   = "erp-web"
    container_port   = 80
  }
}
