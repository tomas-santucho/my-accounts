# MyAccountsTS

A personal learning project built to explore **Express**, **MongoDB**, and **Terraform** — all running with **Bun** 🧠⚡

---

## 🚀 About

This project is part of my journey to learn how backend systems fit together — from building APIs with **Express**, to managing data with **MongoDB**, and provisioning infrastructure using **Terraform** on AWS.

The app currently exposes a simple REST API for managing **expenses** (and later, incomes), following a **DDD + functional** architecture.

---

## 🏗️ Architecture & Infrastructure

This project is designed to run as a **serverless application** on AWS, provisioned entirely with **Terraform**. It does **not** use Docker for deployment.

The main components are:

-   **AWS Lambda**: The Express.js application is wrapped using the `serverless-http` library to run inside a Node.js Lambda function. This handles all API logic.
-   **API Gateway (HTTP API)**: Acts as the public-facing entry point for the API, proxying all requests to the Lambda function.
-   **AWS Cognito**: Manages user authentication and authorization. It's configured to allow sign-ins via email/password and Google.
-   **S3 Bucket**: Used to store the zipped deployment package for the Lambda function.
-   **IAM Roles**: Defines the necessary permissions for the Lambda function to execute and write logs.

This serverless approach avoids the need to manage servers, relying on AWS to handle scaling and availability.

---

## 🧩 Stack

-   **Runtime**: [Bun](https://bun.sh)
-   **Backend**: Express.js (TypeScript)
-   **Database**: MongoDB
-   **Infrastructure**: Terraform
-   **Cloud Provider**: AWS (Lambda, API Gateway, Cognito)
-   **Architecture**: Hexagonal / Functional DDD

---

## 🛠️ Local Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourusername/myaccountsts.git
cd myaccountsts
```

### 2️⃣ Install dependencies

```bash
bun install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the root:

```bash
MONGO_URI=mongodb://localhost:27017/my-accounts
PORT=3000
```

### 4️⃣ Run MongoDB

If you have Docker:

```bash
docker run -d --name mongo -p 27017:27017 mongo
```

or using `docker compose`:

```bash
docker compose up -d
```

---

## 🧰 Running the App Locally

### Development Mode (with hot-reload)

```bash
bun run dev
```

### Build for Production

```bash
bun run build
```

### Run Production Build

```bash
bun run start
```

---

## ✅ Testing and Linting

### Run Tests

```bash
bun test
```

### Run Linter

```bash
bun run lint
```

---

## ☁️ Deploying to AWS with Terraform

The infrastructure is defined in the `/infra` directory.

To deploy the application to your AWS account:

1.  **Navigate to the Terraform directory**:
    ```bash
    cd infra/dev
    ```

2.  **Initialize Terraform**:
    ```bash
    terraform init
    ```

3.  **Review the plan**:
    ```bash
    terraform plan
    ```

4.  **Apply the changes**:
    ```bash
    terraform apply
    ```

⚠️ **Important**: When you're finished, remember to destroy your test infrastructure to avoid incurring costs.

```bash
terraform destroy
```

---

## 🧠 Learning Goals

-   Build clean, testable Express APIs with TypeScript.
-   Model data and domain logic with MongoDB.
-   Learn infrastructure as code (Terraform) for serverless applications.
-   Understand AWS Lambda, API Gateway, and Cognito.
-   Set up CI/CD pipelines for automated deployments.

---

## 📜 License

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
