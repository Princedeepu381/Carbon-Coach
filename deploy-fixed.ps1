# Carbon Coach Fixed Deployment Script
Write-Host "🚀 Carbon Coach Deployment (Fixed)" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "carbon-coach-499117"
$REGION = "us-central1"

# Step 1: Build and push image
Write-Host "📋 Step 1: Building Docker image..." -ForegroundColor Yellow
Write-Host "This will take a few minutes..." -ForegroundColor Gray
gcloud builds submit --config cloudbuild.yaml

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check the error above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Image built and pushed successfully" -ForegroundColor Green

# Step 2: Deploy to Cloud Run using service.yaml
Write-Host ""
Write-Host "📋 Step 2: Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run services replace service.yaml --region=$REGION

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed. Check the error above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Deployment successful" -ForegroundColor Green

# Step 3: Get service URL
Write-Host ""
Write-Host "📋 Step 3: Getting service information..." -ForegroundColor Yellow
$serviceUrl = gcloud run services describe carboncoach --region=$REGION --format="value(status.url)"

# Summary
Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test your deployment:" -ForegroundColor Yellow
Write-Host "  curl -I $serviceUrl" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  gcloud run services logs read carboncoach --region=$REGION --limit=50" -ForegroundColor White
Write-Host ""

# Made with Bob
