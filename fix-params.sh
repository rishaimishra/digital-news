#!/bin/bash
# Fix all route files to properly await params

files=(
  "app/api/articles/[id]/reject/route.ts"
  "app/api/articles/[id]/publish/route.ts"
  "app/api/articles/[id]/submit/route.ts"
  "app/api/articles/[id]/takedown/route.ts"
  "app/api/grievances/[id]/resolve/route.ts"
  "app/api/grievances/[id]/reject/route.ts"
  "app/api/epaper/[id]/route.ts"
  "app/api/rss/category/[category]/route.ts"
  "app/api/rss/city/[city]/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Check if it needs fixing
    if grep -q "params: Promise<{ id: string }>" "$file" && ! grep -q "const { id } = await params" "$file"; then
      # Add await params after function start
      sed -i '' 's/export async function \([A-Z]*\)(/,/export async function \1(/' "$file"
      sed -i '' '/^  try {$/i\
    const { id } = await params
' "$file"
      # Replace params.id with id
      sed -i '' 's/params\.id/id/g' "$file"
      echo "Fixed: $file"
    elif grep -q "params: Promise<{ category: string }>" "$file" && ! grep -q "const { category } = await params" "$file"; then
      sed -i '' '/^  try {$/i\
    const { category } = await params
' "$file"
      sed -i '' 's/params\.category/category/g' "$file"
      echo "Fixed: $file"
    elif grep -q "params: Promise<{ city: string }>" "$file" && ! grep -q "const { city } = await params" "$file"; then
      sed -i '' '/^  try {$/i\
    const { city } = await params
' "$file"
      sed -i '' 's/params\.city/city/g' "$file"
      echo "Fixed: $file"
    fi
  fi
done

