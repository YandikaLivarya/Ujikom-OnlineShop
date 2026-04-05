@echo off
REM Test Xendit API endpoint

echo Testing Xendit Payment API...
echo.

REM Test 1: Check if backend is running
echo Test 1: Check backend connection...
curl http://localhost:5000/ 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Backend not running! Start backend first with: node server.js
  exit /b
)
echo OK - Backend is running
echo.

REM Test 2: Create Invoice
echo Test 2: Create Invoice via API...
powershell -Command "
  \$body = @{
    amount=50000
    description='Test Order'
    customer_name='Test Customer'
    customer_email='test@example.com'
    customer_phone='081234567890'
    tracking_number='999999'
    payment_method='E-Wallet'
  } | ConvertTo-Json

  try {
    \$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/payment/create-invoice' `
      -Method POST `
      -ContentType 'application/json' `
      -Body \$body `
      -ErrorAction Stop
    
    Write-Host 'Response: ' -ForegroundColor Green
    Write-Host (\$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10)
  } catch {
    Write-Host 'ERROR: ' -ForegroundColor Red
    Write-Host \$_.Exception.Message
    Write-Host 'Response: ' (\$_.Exception.Response.StatusDescription)
  }
"

echo.
echo Done!
