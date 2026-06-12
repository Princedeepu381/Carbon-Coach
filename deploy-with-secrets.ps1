# Carbon Coach Deployment Script with Secrets
# This script sets up secrets and deploys to Google Cloud Run

Write-Host "🚀 Carbon Coach Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "carbon-coach-499117"
$REGION = "us-central1"
$SERVICE_NAME = "carboncoach"
$SECRET_NAME = "gemini-api-key"

# Step 1: Check if gcloud is installed
Write-Host "📋 Step 1: Checking gcloud CLI..." -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud version 2>&1
    Write-Host "✅ gcloud CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ gcloud CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Step 2: Set project
Write-Host ""
Write-Host "📋 Step 2: Setting project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID
Write-Host "✅ Project set to $PROJECT_ID" -ForegroundColor Green

# Step 3: Enable required APIs
Write-Host ""
Write-Host "📋 Step 3: Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable secretmanager.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
Write-Host "✅ APIs enabled" -ForegroundColor Green

# Step 4: Create or update secret
Write-Host ""
Write-Host "📋 Step 4: Setting up Gemini API Key secret..." -ForegroundColor Yellow
Write-Host "Please enter your Gemini API Key:" -ForegroundColor Cyan
$apiKey = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
$plainApiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Check if secret exists
$secretExists = gcloud secrets describe $SECRET_NAME 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Secret exists, adding new version..." -ForegroundColor Yellow
    echo $plainApiKey | gcloud secrets versions add $SECRET_NAME --data-file=-
} else {
    Write-Host "Creating new secret..." -ForegroundColor Yellow
    echo $plainApiKey | gcloud secrets create $SECRET_NAME --data-file=-
}
Write-Host "✅ Secret configured" -ForegroundColor Green

# Step 5: Grant Cloud Run access to secret
Write-Host ""
Write-Host "📋 Step 5: Granting Cloud Run access to secret..." -ForegroundColor Yellow
$serviceAccount = gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(spec.template.spec.serviceAccountName)" 2>&1
if ($LASTEXITCODE -ne 0) {
    $serviceAccount = "$PROJECT_ID-compute@developer.gserviceaccount.com"
    Write-Host "Using default service account: $serviceAccount" -ForegroundColor Yellow
}

gcloud secrets add-iam-policy-binding $SECRET_NAME `
    --member="serviceAccount:$serviceAccount" `
    --role="roles/secretmanager.secretAccessor" `
    --quiet

Write-Host "✅ Access granted" -ForegroundColor Green

# Step 6: Build and push Docker image
Write-Host ""
Write-Host "📋 Step 6: Building and pushing Docker image..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Image built and pushed" -ForegroundColor Green

# Step 7: Deploy to Cloud Run
Write-Host ""
Write-Host "📋 Step 7: Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run services replace service.yaml --region=$REGION
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Deployment successful" -ForegroundColor Green

# Step 8: Get service URL
Write-Host ""
Write-Host "📋 Step 8: Getting service URL..." -ForegroundColor Yellow
$serviceUrl = gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)"
Write-Host "✅ Service URL: $serviceUrl" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the application: $serviceUrl" -ForegroundColor White
Write-Host "2. Verify API endpoints work" -ForegroundColor White
Write-Host "3. Check logs: gcloud run services logs read $SERVICE_NAME --region=$REGION" -ForegroundColor White
Write-Host ""

# Made with Bob
