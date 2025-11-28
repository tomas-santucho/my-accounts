provider "aws" {
  region = "sa-east-1"
}

locals {
  project_name = "my-accounts"
  environment  = "prod"
}

data "aws_region" "current" {}

# S3 bucket for deployment artifacts
resource "aws_s3_bucket" "deploy" {
  bucket        = var.s3_bucket_name
  force_destroy = true

  tags = {
    Name        = "${local.project_name}-${local.environment}-deploy"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_s3_bucket_versioning" "deploy_versioning" {
  bucket = aws_s3_bucket.deploy.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "deploy_sse" {
  bucket = aws_s3_bucket.deploy.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "deploy_block_pub" {
  bucket                  = aws_s3_bucket.deploy.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM role for Lambda execution
resource "aws_iam_role" "lambda_exec" {
  name = "${local.project_name}-${local.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })

  tags = {
    Name        = "${local.project_name}-${local.environment}-lambda-role"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda function
resource "aws_lambda_function" "express" {
  function_name = "${local.project_name}-${local.environment}-api"

  s3_bucket = aws_s3_bucket.deploy.bucket
  s3_key    = "deploy/my-accounts.zip"

  handler = "lambda.handler"
  runtime = "nodejs20.x"
  role    = aws_iam_role.lambda_exec.arn
  timeout = 12

  environment {
    variables = {
      NODE_ENV  = local.environment
      MONGO_URI = var.mongo_uri
    }
  }

  tags = {
    Name        = "${local.project_name}-${local.environment}-api"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "http" {
  name          = "${local.project_name}-${local.environment}-api"
  protocol_type = "HTTP"

  tags = {
    Name        = "${local.project_name}-${local.environment}-api"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.express.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "any" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.express.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Name        = "${local.project_name}-${local.environment}-stage"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# Outputs
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.http.api_endpoint
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.express.function_name
}
