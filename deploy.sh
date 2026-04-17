#!/bin/bash
set -e
export PATH=$PATH:/opt/homebrew/bin:/usr/local/bin

echo ">>> Building project locally..."
npm run build
/opt/homebrew/bin/node generate-locales.js

PASS="Mimajiushi666"
HOST="root@47.83.211.119"

echo ">>> Deploying SOAS Frontend..."
expect -c "
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $HOST \"rm -rf /var/www/soas-app/*\"
expect \"*?assword:*\" { send \"$PASS\r\" }
expect eof
"
expect -c "
set timeout -1
spawn bash -c \"scp -o StrictHostKeyChecking=no -r dist/* $HOST:/var/www/soas-app/\"
expect \"*?assword:*\" { send \"$PASS\r\" }
expect eof
"

echo ">>> Deploying SOAS Backend..."
expect -c "
set timeout -1
spawn bash -c \"scp -o StrictHostKeyChecking=no server/index.js server/db.js server/package.json server/package-lock.json server/database.sqlite $HOST:/var/www/soas-server/\"
expect \"*?assword:*\" { send \"$PASS\r\" }
expect eof
"
expect -c "
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $HOST \"mkdir -p /var/www/src/i18n/locales\"
expect \"*?assword:*\" { send \"$PASS\r\" }
expect eof
"
expect -c "
set timeout -1
spawn bash -c \"scp -o StrictHostKeyChecking=no src/i18n/locales/*.json $HOST:/var/www/src/i18n/locales/\"
expect \"*?assword:*\" { send \"$PASS\r\" }
expect eof
"

echo ">>> Restarting Server..."
expect -c "
set timeout -1
spawn ssh -o StrictHostKeyChecking=no $HOST \"cd /var/www/soas-server && npm install && (pm2 restart soas-server || pm2 start index.js --name soas-server) && pm2 save && curl -s -X POST http://localhost:3001/api/translations/init\"
expect \"*?assword:*\" { send \"$PASS\r\" }
expect eof
"

echo "✅ SOAS Production deployed!"
