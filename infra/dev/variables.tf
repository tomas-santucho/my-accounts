variable "s3_bucket_name" {
  type        = string
  default     = "my-accounts-dev-deploy"
  description = "S3 bucket for Lambda deployment artifacts"
}

variable "mongo_uri" {
  type        = string
  description = "MongoDB connection URI"
  sensitive   = true
}
