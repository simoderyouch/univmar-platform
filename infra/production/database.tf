resource "aws_db_instance" "main" {
  identifier = "univmar-production-postgres"

  engine         = "postgres"
  instance_class = "db.t4g.micro"

  db_name  = "univmar"
  username = "univmar_admin"
  port     = 5432

  # AWS creates and stores the password in Secrets Manager.
  manage_master_user_password = true

  allocated_storage     = 20
  max_allocated_storage = 20
  storage_type          = "gp3"
  storage_encrypted     = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.database.id]
  publicly_accessible    = false
  multi_az               = false

  backup_retention_period = 1
  backup_window           = "02:00-02:30"
  maintenance_window      = "sun:03:00-sun:03:30"

  auto_minor_version_upgrade = true
  copy_tags_to_snapshot      = true
  deletion_protection        = false
  skip_final_snapshot        = true
  apply_immediately          = false

  tags = {
    Name = "univmar-production-postgres"
  }
}

output "database_endpoint" {
  value = aws_db_instance.main.address
}

output "database_port" {
  value = aws_db_instance.main.port
}

output "database_master_secret_arn" {
  value     = aws_db_instance.main.master_user_secret[0].secret_arn
  sensitive = true
}
