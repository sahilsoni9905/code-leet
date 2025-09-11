#!/bin/bash

echo "🔄 Updating service-to-service communication URLs..."

# Update User Service .env
cd ~/code-leet/services/user-service
sed -i 's|SUBMISSION_SERVICE_URL=http://13.201.255.178:3003|SUBMISSION_SERVICE_URL=http://localhost:3003|g' .env

# Update Submission Service .env  
cd ~/code-leet/services/submission-service
sed -i 's|PROBLEM_SERVICE_URL=http://13.201.255.178:3002|PROBLEM_SERVICE_URL=http://localhost:3002|g' .env
sed -i 's|EVALUATOR_SERVICE_URL=http://13.201.255.178:3004|EVALUATOR_SERVICE_URL=http://localhost:3004|g' .env

# Update evaluationClient.ts
sed -i 's|http://13.201.255.178:3002|http://localhost:3002|g' src/utils/evaluationClient.ts
sed -i 's|http://13.201.255.178:3004|http://localhost:3004|g' src/utils/evaluationClient.ts

# Rebuild submission service
echo "🔨 Rebuilding submission service..."
npm run build

# Restart submission service
echo "🔄 Restarting submission service..."
pm2 restart submission-service

echo "✅ Service URLs updated and submission service restarted!"
echo "🧪 Try submitting your code again - it should work now!"
