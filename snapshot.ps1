# snapshot.ps1 - save a project snapshot with a comment and date
# Usage: .\snapshot.ps1 "comment describing the change"
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Comment
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path (Join-Path $root ".git"))) {
    Write-Host "No git repository found in this folder. Run: git init" -ForegroundColor Red
    exit 1
}

$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HHmm"
$msgComment = if ($Comment -and $Comment.Count -gt 0) { ($Comment -join " ") } else { "snapshot $date" }
$fullMsg = "snapshot $date $time - $msgComment"

# Stage all changes (new, modified, deleted)
git add -A

# Is there anything to save?
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "No changes to save (working tree clean)." -ForegroundColor Yellow
    Write-Host "Last commit: $(git rev-parse --short HEAD)" -ForegroundColor DarkGray
    exit 0
}

Write-Host "Files staged:" -ForegroundColor Cyan
$staged | ForEach-Object { Write-Host "  + $_" }

git commit -q -m $fullMsg
$sha = git rev-parse --short HEAD
$tag = "snapshot-$date-$time"
git tag -a $tag -m $fullMsg

Write-Host ""
Write-Host "Snapshot saved:" -ForegroundColor Green
Write-Host "   commit : $sha" -ForegroundColor Green
Write-Host "   tag    : $tag" -ForegroundColor Green
Write-Host "   comment: $fullMsg" -ForegroundColor Green
Write-Host ""
Write-Host "To restore this snapshot (if an unwanted change happened):" -ForegroundColor Yellow
Write-Host "   git checkout $tag        # view (read-only)" -ForegroundColor Yellow
Write-Host "   git reset --hard $tag    # WARNING: discards current changes, restores snapshot" -ForegroundColor Yellow
Write-Host ""
Write-Host "To list all snapshots:" -ForegroundColor DarkGray
Write-Host '   git tag -l "snapshot-*" -n1' -ForegroundColor DarkGray