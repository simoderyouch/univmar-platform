terraform {
  backend "s3" {
    bucket       = "univmar-089496390808-tfstate"
    key          = "production/terraform.tfstate"
    region       = "eu-west-3"
    encrypt      = true
    use_lockfile = true
  }
}
