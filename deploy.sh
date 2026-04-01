#!/bin/bash

# Configuration
REMOTE_USER="u876344906"
REMOTE_HOST="145.79.213.133"
REMOTE_PORT="65002"
REMOTE_PATH="/home/u876344906/domains/otulia.com/nodejs"

echo "🚀 Starting deployment to $REMOTE_HOST..."

ssh -t -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
  # Load environment (crucial for Hostinger/nvm)
  source ~/.bashrc
  source ~/.profile
  export PATH=\$PATH:/usr/local/bin

  cd $REMOTE_PATH || { echo "❌ Directory $REMOTE_PATH not found on server"; exit 1; }
  
  echo "📥 Pulling latest changes from main branch..."
  # Sometimes git needs the full path if not in the default path
  git pull origin main
  
  echo "📦 Updating server dependencies..."
  cd server && npm install --legacy-peer-deps
  
  echo "🔄 Restarting PM2 processes..."
  pm2 restart all
  
  echo "✅ Deployment complete!"
  exit
EOF
