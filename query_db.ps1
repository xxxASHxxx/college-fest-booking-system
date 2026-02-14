param(
    [string]$Query,
    [string]$Database = "fest_booking"
)

if ([string]::IsNullOrWhiteSpace($Query)) {
    Write-Host "Please provide a query as an argument." -ForegroundColor Yellow
    Write-Host "Example: .\query_db.ps1 'SELECT * FROM users'"
    exit
}

& "C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe" -u root -phello -D $Database -e "$Query"
