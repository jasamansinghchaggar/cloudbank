variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix applied to all resources"
  type        = string
  default     = "cloudbank"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Two AZs are used for the public/app/db subnet tiers so the ALB, Auto
# Scaling group, and RDS can actually be Multi-AZ. The PRD's single-CIDR
# tiers are kept as the first subnet in each pair.
variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (ALB, NAT Gateway)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.4.0/24"]
}

variable "app_subnet_cidrs" {
  description = "CIDR blocks for private application subnets (EC2)"
  type        = list(string)
  default     = ["10.0.2.0/24", "10.0.5.0/24"]
}

variable "db_subnet_cidrs" {
  description = "CIDR blocks for private database subnets (RDS)"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.6.0/24"]
}

variable "availability_zones" {
  description = "Availability zones to spread subnets across (must match the CIDR list lengths)"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "admin_cidr" {
  description = "CIDR allowed to SSH into EC2 instances (lock this down to your own IP, e.g. 203.0.113.5/32)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "instance_type" {
  description = "EC2 instance type for the Next.js app servers"
  type        = string
  default     = "t3.micro"
}

variable "asg_min_size" {
  type    = number
  default = 2
}

variable "asg_max_size" {
  type    = number
  default = 4
}

variable "asg_desired_capacity" {
  type    = number
  default = 2
}

variable "key_pair_name" {
  description = "Existing EC2 key pair name for SSH access (leave null to disable SSH key access)"
  type        = string
  default     = null
}

variable "db_name" {
  type    = string
  default = "cloudbank"
}

variable "db_username" {
  type    = string
  default = "cloudbank_app"
}

variable "db_password" {
  description = "Master password for RDS. Provide via terraform.tfvars or TF_VAR_db_password env var - do not commit real values."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "db_multi_az" {
  description = "Whether RDS should run Multi-AZ for high availability (increases cost)"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Root domain managed in Route 53 (leave empty to skip DNS setup)"
  type        = string
  default     = ""
}

variable "app_subdomain" {
  description = "Subdomain the app is served from, e.g. app.example.com"
  type        = string
  default     = "app"
}

variable "app_repo_url" {
  description = "Git URL the EC2 instances clone to deploy the Next.js app"
  type        = string
  default     = "https://github.com/your-org/cloudbank.git"
}

variable "app_repo_branch" {
  type    = string
  default = "main"
}

variable "jwt_secret" {
  description = "Secret used to sign session JWTs, injected into the EC2 app via user data"
  type        = string
  sensitive   = true
  default     = "change-me-in-production"
}
