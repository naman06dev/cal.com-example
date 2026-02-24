#!/bin/sh
set -x

# Replace the statically built BUILT_NEXT_PUBLIC_WEBAPP_URL with run-time NEXT_PUBLIC_WEBAPP_URL
# NOTE: if these values are the same, this will be skipped.
scripts/replace-placeholder.sh "$BUILT_NEXT_PUBLIC_WEBAPP_URL" "$NEXT_PUBLIC_WEBAPP_URL"

# Write runtime env vars to .env so Next.js can read them even in standalone mode
if [ -n "$MWAI_APP_ID" ]; then
  echo "MWAI_APP_ID=${MWAI_APP_ID}" >> /calcom/.env
fi
if [ -n "$MWAI_API_KEY" ]; then
  echo "MWAI_API_KEY=${MWAI_API_KEY}" >> /calcom/.env
fi

scripts/wait-for-it.sh ${DATABASE_HOST} -- echo "database is up"
npx prisma migrate deploy --schema /calcom/packages/prisma/schema.prisma
npx ts-node --transpile-only /calcom/scripts/seed-app-store.ts
yarn start
