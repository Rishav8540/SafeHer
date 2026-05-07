#!/bin/bash

# SafeHer Quick Setup Script
# Run: chmod +x setup.sh && ./setup.sh

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🛡️  SafeHer – Setup Script        ║${NC}"
echo -e "${BLUE}║   One Click Protection              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found. Please install from https://nodejs.org${NC}"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
  echo -e "${RED}❌ Node.js v16+ required. You have $(node -v)${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo -e "${YELLOW}⚠️  MongoDB not found locally. Make sure you have a MongoDB URI ready.${NC}"
fi

echo ""
echo -e "${BLUE}📦 Installing Backend dependencies...${NC}"
cd backend
npm install --silent
echo -e "${GREEN}✅ Backend packages installed${NC}"

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}📄 Created backend/.env — please update it with your values${NC}"
fi

echo ""
echo -e "${BLUE}🌱 Seeding database...${NC}"
node seeder.js

echo ""
echo -e "${BLUE}📦 Installing Frontend dependencies...${NC}"
cd ../frontend
npm install --silent
echo -e "${GREEN}✅ Frontend packages installed${NC}"

if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}📄 Created frontend/.env${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ SafeHer Setup Complete!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}To start the app:${NC}"
echo ""
echo -e "  ${YELLOW}Terminal 1 (Backend):${NC}"
echo -e "  cd backend && npm run dev"
echo ""
echo -e "  ${YELLOW}Terminal 2 (Frontend):${NC}"
echo -e "  cd frontend && npm start"
echo ""
echo -e "  ${YELLOW}Then open:${NC} http://localhost:3000"
echo ""
echo -e "${BLUE}Login Credentials:${NC}"
echo -e "  👩‍💼 Admin:     admin@safeher.com / admin123"
echo -e "  👩 Demo User: priya@example.com / demo123"
echo ""
