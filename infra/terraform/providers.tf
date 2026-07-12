terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment and configure before running `terraform init` in a real environment.
  # backend "s3" {
  #   bucket         = "cloudbank-terraform-state"
  #   key            = "cloudbank/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "cloudbank-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}
