# CloudBank

A secure, highly available banking portal, built as described in `PRD.txt`: a
Next.js application backed by MySQL, deployed on AWS behind an Application
Load Balancer and Auto Scaling Group.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma 7 (MySQL, via the `@prisma/adapter-mariadb` driver adapter)
- JWT (`jose`) + bcrypt for authentication
- Terraform for AWS infrastructure (`infra/terraform/`)

## Local development

1. Start a local MySQL instance (or point at any reachable MySQL 8 server), e.g.:
   ```bash
   docker run -d --name cloudbank-mysql \
     -e MYSQL_ROOT_PASSWORD=password \
     -e MYSQL_DATABASE=cloudbank \
     -p 3306:3306 mysql:8
   ```
2. Copy `.env.example` to `.env` and adjust `DATABASE_URL` / `JWT_SECRET` if needed.
3. Install dependencies and set up the database:
   ```bash
   npm install
   npm run db:migrate    # creates tables from prisma/schema.prisma
   npm run db:seed       # seeds a demo admin + two demo customers
   ```
4. Run the app:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

**Seeded accounts** (from `npm run db:seed`):
- Admin: username `admin`, password `admin123`
- Customer: `alice@cloudbank.test` / `password123` (account `CB0000000001`)
- Customer: `bob@cloudbank.test` / `password123` (account `CB0000000002`)

New signups via `/register` start with a demo balance of $1,000.

## Application structure

```
src/
├── app/
│   ├── login/, register/          customer auth
│   ├── dashboard/, transfer/,
│   │   transactions/, profile/    customer banking UI
│   ├── admin/login/, admin/dashboard/  admin console
│   └── api/                       auth, customer, transfer, transactions, admin routes
├── components/                    NavBar, forms, admin table (client islands)
├── lib/                           db.ts, auth.ts, account.ts, validation.ts
├── middleware.ts                  route protection (customer vs admin sessions)
prisma/
├── schema.prisma                  Customer, Transaction, Admin models
└── seed.ts
```

## High availability demo

The dashboard shows the serving instance's hostname and PID
(`src/app/dashboard/page.tsx`, backed by `os.hostname()`). Once deployed
behind the ALB + Auto Scaling Group in `infra/terraform/`, refreshing the
page after logging in shows requests landing on different EC2 instances;
terminating one instance shows the ASG replace it while the app stays up.

## AWS deployment (infrastructure as code)

Terraform config lives in `infra/terraform/` and provisions the architecture
from `PRD.txt`: VPC, public/private/db subnets across 2 AZs, IGW, a single
NAT Gateway, security groups, an ALB + target group, a launch template +
Auto Scaling Group for the app, an RDS MySQL instance, and an optional
Route 53 record.

**Nothing here has been applied — these are plans only.** To actually
provision AWS resources (which will incur cost and requires your own AWS
credentials):

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # fill in db_password, jwt_secret, admin_cidr, app_repo_url
terraform init
terraform plan
terraform apply
```

The EC2 launch template's user data (`user_data.sh.tpl`) clones
`app_repo_url` at boot, installs Node, runs `prisma migrate deploy`, builds,
and starts the app with PM2 — so push this repo to a Git remote and set
`app_repo_url` accordingly before applying.

Tear down with `terraform destroy` when done to avoid ongoing charges.
