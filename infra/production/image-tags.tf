variable "api_image_tag" {
  description = "Immutable ECR tag for the API image."
  type        = string
  default     = "cc3854b"

  validation {
    condition     = can(regex("^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$", var.api_image_tag))
    error_message = "api_image_tag must be a valid ECR image tag."
  }
}

variable "landing_image_tag" {
  description = "Immutable ECR tag for the landing image."
  type        = string
  default     = "46bca69"

  validation {
    condition     = can(regex("^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$", var.landing_image_tag))
    error_message = "landing_image_tag must be a valid ECR image tag."
  }
}

variable "erp_image_tag" {
  description = "Immutable ECR tag for the ERP frontend image."
  type        = string
  default     = "b5f072c"

  validation {
    condition     = can(regex("^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$", var.erp_image_tag))
    error_message = "erp_image_tag must be a valid ECR image tag."
  }
}
