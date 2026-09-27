resource "aws_lb" "main" {
  name               = "univmar-production"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = values(aws_subnet.public)[*].id

  drop_invalid_header_fields = true
  idle_timeout               = 60
  enable_deletion_protection = false
}

resource "aws_lb_target_group" "landing" {
  name        = "univmar-production-landing"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  deregistration_delay = 20

  health_check {
    enabled = true
    path    = "/fr"
    matcher = "200-399"
  }
}

resource "aws_lb_target_group" "erp_web" {
  name        = "univmar-production-erp-web"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  deregistration_delay = 20

  health_check {
    enabled = true
    path    = "/"
    matcher = "200-399"
  }
}

resource "aws_lb_target_group" "api" {
  name        = "univmar-production-api"
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  deregistration_delay = 20

  health_check {
    enabled = true
    path    = "/actuator/health"
    matcher = "200"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Univmar service is not ready."
      status_code  = "404"
    }
  }
}

output "load_balancer_dns_name" {
  value = aws_lb.main.dns_name
}

output "load_balancer_zone_id" {
  value = aws_lb.main.zone_id
}
