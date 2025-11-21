#!/bin/bash
echo "Running production verification..."
echo

export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bmF0dXJhbC1tb25hcmNoLTM1LmNsZXJrLmFjY291bnRzLmRldiQ
export CLERK_SECRET_KEY=sk_test_o3TI1ruXoy7rFEGxlNjkIXVrbvnuDQPc9x8CXQeiSq
export DATABASE_URL=postgres://5a29de660604b14b251f985af2ffec21e65b094b4c2f4fbbace84ad9757626f3:sk_gczEiDrvZghOtr3VrDpJY@db.prisma.io:5432/postgres?sslmode=require
export GEMINI_API_KEY=AIzaSyBScpDcBYdiRBX5-4eggXB4dC9-tHTz7kk

node scripts/verify-production-setup.js

echo
echo "Verification complete."