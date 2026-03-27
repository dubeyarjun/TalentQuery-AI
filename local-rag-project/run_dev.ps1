# run_dev.ps1 - Start both Backend and Frontend

# 1. Start FastAPI Backend in a new terminal
Start-Process powershell -ArgumentList "-NoExit -Command cd backend; uvicorn main:app --reload" -WindowStyle Normal

# 2. Start Vite Frontend in another terminal
Start-Process powershell -ArgumentList "-NoExit -Command cd frontend; npm run dev" -WindowStyle Normal

Write-Host "Local RAG Application started!"
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: Check the console output for Vite URL (usually http://localhost:5173)"
