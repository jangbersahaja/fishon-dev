#!/bin/bash

# Script to update lib imports after Phase 3 reorganization

echo "Updating lib imports in fishon-market..."

# Define the source directory
SRC_DIR="src"

# Auth files: auth.ts, auth-options.ts, password.ts → auth/
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/auth"|from "@/lib/auth/auth"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/auth-options"|from "@/lib/auth/auth-options"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/password"|from "@/lib/auth/password"|g' {} +

# Database files: prisma.ts, prisma-captain.ts → database/
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/prisma"|from "@/lib/database/prisma"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/prisma-captain"|from "@/lib/database/prisma-captain"|g' {} +

# API files: captain-api.ts, captain-db.ts → api/
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/captain-api"|from "@/lib/api/captain-api"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/captain-db"|from "@/lib/api/captain-db"|g' {} +

# Service files: charter-service.ts, charter-adapter.ts, blog-service.ts → services/
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/charter-service"|from "@/lib/services/charter-service"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/charter-adapter"|from "@/lib/services/charter-adapter"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/blog-service"|from "@/lib/services/blog-service"|g' {} +

# Helper files → helpers/
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/image-helpers"|from "@/lib/helpers/image-helpers"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/popularity-helpers"|from "@/lib/helpers/popularity-helpers"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/city-district-mapping"|from "@/lib/helpers/city-district-mapping"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/ratings"|from "@/lib/helpers/ratings"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/tac"|from "@/lib/helpers/tac"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/email"|from "@/lib/helpers/email"|g' {} +

# Webhook files → webhooks/
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/webhook"|from "@/lib/webhooks/webhook"|g' {} +
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's|from "@/lib/social-webhook"|from "@/lib/webhooks/social-webhook"|g' {} +

echo "✅ Import updates complete!"
echo "Running TypeScript validation..."
npm run typecheck
