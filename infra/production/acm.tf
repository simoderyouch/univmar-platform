resource "aws_acm_certificate" "public" {
  domain_name               = "universmarbre.com"
  subject_alternative_names = ["*.universmarbre.com"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

output "acm_dns_validation_records" {
  value = [
    for record in
    aws_acm_certificate.public.domain_validation_options : {
      domain = record.domain_name
      name   = record.resource_record_name
      type   = record.resource_record_type
      value  = record.resource_record_value
    }
  ]
}
