#!/bin/bash
set -euxo pipefail

# Update system and install required packages
dnf update -y
dnf install -y git nmap-ncat

# Install Node.js 22
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
dnf install -y nodejs

# Install PM2
npm install -g pm2

# Clone application
APP_DIR="/opt/cloudbank"

git clone --branch "${repo_branch}" --depth 1 "${repo_url}" "$APP_DIR"
cd "$APP_DIR"

# Create environment file
cat > .env <<EOF
DATABASE_URL="${database_url}"
JWT_SECRET="${jwt_secret}"
NODE_ENV=production
PORT=3000
EOF

# Install dependencies
npm ci

# Generate Prisma Client
npx prisma generate

# Wait until RDS is reachable
DB_HOST=$(echo "${database_url}" | sed -E 's#.*@(.*):3306.*#\1#')

until nc -z "$DB_HOST" 3306; do
  echo "Waiting for RDS..."
  sleep 5
done

# Run database migrations
npx prisma migrate deploy

# Build the application
npm run build

# Start production server
pm2 start npm --name cloudbank -- start

# Save PM2 process list
pm2 save