#!/bin/bash

# Prisma Clientを生成
npx prisma generate

# Next.jsのビルドを実行
npm run build
