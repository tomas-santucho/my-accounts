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

variable "google_client_id" {
  type        = string
  description = "Google OAuth Client ID"
  sensitive   = true
}

variable "google_client_secret" {
  type        = string
  description = "Google OAuth Client Secret"
  sensitive   = true
}

variable "cognito_domain_prefix" {
  type        = string
  description = "Prefix for the Cognito Hosted UI domain"
  default     = "my-accounts-auth"
}

variable "expo_redirect_uris" {
  type        = list(string)
  description = "List of allowed callback/logout URLs for the Expo app"
  default = [
    "exp://127.0.0.1:19000/--/oauthredirect",
    "myaccounts://oauthredirect"
  ]
}

variable "expo_logout_uris" {
  type        = list(string)
  description = "List of allowed logout URLs for the Expo app"
  default = [
    "exp://127.0.0.1:19000/--/signout",
    "myaccounts://signout"
  ]
}
