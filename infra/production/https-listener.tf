resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.public.arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Not found."
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "https_erp_api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    host_header {
      values = ["erp.universmarbre.com"]
    }
  }

  condition {
    path_pattern {
      values = ["/api/v1/*"]
    }
  }
}

resource "aws_lb_listener_rule" "https_erp" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.erp_web.arn
  }

  condition {
    host_header {
      values = ["erp.universmarbre.com"]
    }
  }
}

resource "aws_lb_listener_rule" "https_api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 30

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    host_header {
      values = ["api.universmarbre.com"]
    }
  }

  condition {
    path_pattern {
      values = ["/api/v1/*"]
    }
  }
}

resource "aws_lb_listener_rule" "https_landing" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 40

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.landing.arn
  }

  condition {
    host_header {
      values = [
        "universmarbre.com",
        "www.universmarbre.com",
        "landing.universmarbre.com",
      ]
    }
  }
}
