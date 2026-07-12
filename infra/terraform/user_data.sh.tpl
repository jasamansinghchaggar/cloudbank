#!/bin/bash
set -euxo pipefail

dnf update -y
dnf install -y git

curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs
npm install -g pm2

APP_DIR=/opt/cloudbank
if [ -d "$APP_DIR" ]; then
  rm -rf "$APP_DIR"
fi
git clone --branch "${repo_branch}" --depth 1 "${repo_url}" "$APP_DIR"
cd "$APP_DIR"

cat > .env <<EOF
DATABASE_URL="${database_url}"
JWT_SECRET="${jwt_secret}"
NODE_ENV=production
PORT=3000
EOF

npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

pm2 start npm --name cloudbank -- start -- -p 3000
pm2 save
pm2 startup systemd -u ec2-user --hp /home/ec2-user
