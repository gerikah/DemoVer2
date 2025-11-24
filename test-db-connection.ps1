# Test PostgreSQL Connection to Docker Database
# Run this script to verify you can connect to the correct database

$connectionString = "Host=127.0.0.1;Port=15432;Database=gcs_db;Username=postgres;Password=lipad123"

Write-Host "Testing connection to Docker PostgreSQL..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Connection Details:" -ForegroundColor Cyan
Write-Host "  Host: 127.0.0.1" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host "  Database: gcs_db" -ForegroundColor White
Write-Host "  Username: postgres" -ForegroundColor White
Write-Host "  Password: lipad123" -ForegroundColor White
Write-Host ""

# Test using Docker
Write-Host "Querying database via Docker..." -ForegroundColor Yellow
$container = (docker compose ps -q db).Trim()
if ([string]::IsNullOrEmpty($container)) {
	Write-Host "ERROR: Could not find running 'db' container from docker compose." -ForegroundColor Red
	Write-Host "Run 'docker compose ps' to inspect services." -ForegroundColor Yellow
} else {
	docker exec $container psql -U postgres -d gcs_db -c "SELECT COUNT(*) as total_missions, MAX(id) as latest_id FROM mission_logs;"
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "IMPORTANT: Use these EXACT settings in your database client!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "If you're currently connected to 192.168.254.144," -ForegroundColor Yellow
Write-Host "that's a DIFFERENT database server!" -ForegroundColor Red
Write-Host ""
Write-Host "Create a NEW connection with:" -ForegroundColor Cyan
Write-Host "  Server/Host: 127.0.0.1 (or try 'host.docker.internal')" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host "  Database: gcs_db" -ForegroundColor White
Write-Host "  Username: postgres" -ForegroundColor White
Write-Host "  Password: lipad123" -ForegroundColor White
