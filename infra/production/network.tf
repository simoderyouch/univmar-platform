
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  project     = "univmar"
  environment = "production"

  vpc_cidr = "10.20.0.0/24"
  azs      = slice(data.aws_availability_zones.available.names, 0, 2)

  public_subnet_cidrs = {
    (local.azs[0]) = "10.20.0.0/26"
    (local.azs[1]) = "10.20.0.64/26"
  }

  database_subnet_cidrs = {
    (local.azs[0]) = "10.20.0.128/28"
    (local.azs[1]) = "10.20.0.144/28"
  }
}

resource "aws_vpc" "main" {
  cidr_block           = local.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${local.project}-${local.environment}-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${local.project}-${local.environment}-igw"
  }
}

resource "aws_subnet" "public" {
  for_each = local.public_subnet_cidrs

  vpc_id                  = aws_vpc.main.id
  availability_zone       = each.key
  cidr_block              = each.value
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.project}-${local.environment}-public-${each.key}"
    Tier = "application"
  }
}

resource "aws_subnet" "database" {
  for_each = local.database_subnet_cidrs

  vpc_id            = aws_vpc.main.id
  availability_zone = each.key
  cidr_block        = each.value

  tags = {
    Name = "${local.project}-${local.environment}-database-${each.key}"
    Tier = "database"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${local.project}-${local.environment}-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "alb" {
  name        = "${local.project}-${local.environment}-alb"
  description = "Public traffic to Univmar load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.project}-${local.environment}-alb"
  }
}

resource "aws_security_group" "landing" {
  name        = "${local.project}-${local.environment}-landing"
  description = "Landing container accepts traffic only from ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Landing application"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "erp_web" {
  name        = "${local.project}-${local.environment}-erp-web"
  description = "ERP frontend container accepts traffic only from ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "ERP frontend"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "api" {
  name        = "${local.project}-${local.environment}-api"
  description = "Spring Boot API container accepts traffic only from ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Spring Boot API"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "database" {
  name        = "${local.project}-${local.environment}-database"
  description = "PostgreSQL accepts connections only from Univmar API"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from API"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }

  egress = []
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.project}-${local.environment}-database"
  subnet_ids = values(aws_subnet.database)[*].id

  tags = {
    Name = "${local.project}-${local.environment}-database"
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = values(aws_subnet.public)[*].id
}

output "database_subnet_group_name" {
  value = aws_db_subnet_group.main.name
}

output "alb_security_group_id" {
  value = aws_security_group.alb.id
}

output "landing_security_group_id" {
  value = aws_security_group.landing.id
}

output "erp_web_security_group_id" {
  value = aws_security_group.erp_web.id
}

output "api_security_group_id" {
  value = aws_security_group.api.id
}

output "database_security_group_id" {
  value = aws_security_group.database.id
}
