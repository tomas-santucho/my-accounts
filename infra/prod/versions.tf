terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "my-accounts-tf-state"
    key    = "prod/terraform.tfstate"
    region = "sa-east-1"
  }
}
