# MyAccountsTS

A personal learning project built to explore **Express**, **MongoDB**, and **Terraform** — all running with **Bun** 🧠⚡

---

## 🚀 About

This project is part of my journey to learn how backend systems fit together — from building APIs with **Express**, to managing data with **MongoDB**, and provisioning infrastructure using **Terraform** on AWS.

The app currently exposes a simple REST API for managing **expenses** (and later, incomes), following a **DDD + functional** architecture.

---

## 🧩 Stack

- **Runtime:** [Bun](https://bun.sh)
- **Backend:** Express.js (TypeScript)
- **Database:** MongoDB
- **Infra:** Terraform (AWS)
- **Architecture:** Hexagonal / Functional DDD

---

## 🛠️ Setup

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

## 🧰 Running the App

### Development
```bash
bun run src/index.ts
```

or if your entry file is `src/main.ts`:
```bash
bun run src/main.ts
```

### Production (after building)
```bash
bun build src/index.ts --outdir dist
bun run dist/index.js
```

---

## 🧱 Infrastructure (Terraform)

To start experimenting with **Terraform** + AWS:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

⚠️ Remember to destroy your test infra when done:
```bash
terraform destroy
```

Recommended AWS region for Argentina 🇦🇷 → `sa-east-1` (São Paulo).

---

## 🧠 Learning Goals

- Build clean, testable Express APIs with TypeScript.
- Model data and domain logic with MongoDB.
- Learn infrastructure as code (Terraform).
- Understand deployment pipelines and containerization.

---

## 🐇 Quick Commands

| Task | Command |
|------|----------|
| Install deps | `bun install` |
| Dev run | `bun run src/index.ts` |
| Build | `bun build src/index.ts --outdir dist` |
| Run built app | `bun run dist/index.js` |
| Run MongoDB | `docker run -d -p 27017:27017 mongo` |
| Apply Terraform infra | `terraform apply` |
| Destroy Terraform infra | `terraform destroy` |

---

## 📜 License

MIT © 2025 — built while learning and experimenting.
