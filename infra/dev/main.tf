terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.6.0"
}

provider "aws" {
  region = "sa-east-1"
}

locals {
  project_name = "my-accounts"
  environment  = "dev"
}

resource "aws_s3_bucket" "dev_bucket" {
  bucket = "${local.project_name}-${local.environment}-bucket"

  tags = {
    Name        = "${local.project_name}-${local.environment}-bucket"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_s3_bucket_versioning" "dev_bucket_versioning" {
  bucket = aws_s3_bucket.dev_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "dev_bucket_sse" {
  bucket = aws_s3_bucket.dev_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "dev_bucket_block_pub" {
  bucket                  = aws_s3_bucket.dev_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "dev_bucket_ownership" {
  bucket = aws_s3_bucket.dev_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}