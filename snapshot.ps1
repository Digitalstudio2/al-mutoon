# ============================================================
# snapshot.ps1 — حفظ نسخة (snapshot) من المشروع بتعليق وتاريخ
# الاستخدام:
#   .\snapshot.ps1 "تعليق يوضّح التغيير"
# أمثلة:
#   .\snapshot.ps1 "قبل تعديل الألوان"
#   .\snapshot.ps1 "بعد إضافة صفحة حفظ التقدّم"
# ============================================================
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Comment
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (-not (Test-Path (Join-Path $root ".git"))) {
    Write-Host "لا يوجد مستودع git في المجلد. شغّل: git init" -ForegroundColor Red
    exit 1
}

$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HHmm"
$msgComment = if ($Comment -and $Comment.Count -gt 0) { ($Comment -join " ") } else { "snapshot $date" }
$fullMsg = "snapshot $date $time - $msgComment"

# تجهيز كل التغييرات (ملفات جديدة + تعديلات + حذف)
git add -A

# هل يوجد ما يُحفظ؟
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "لا توجد تغييرات لحفظها (working tree clean)." -ForegroundColor Yellow
    Write-Host "آخر commit: $(git rev-parse --short HEAD)" -ForegroundColor DarkGray
    exit 0
}

Write-Host "الملفات المُضافة:" -ForegroundColor Cyan
$staged | ForEach-Object { Write-Host "  + $_" }

git commit -q -m $fullMsg
$sha = git rev-parse --short HEAD
$tag = "snapshot-$date-$time"
git tag -a $tag -m $fullMsg

Write-Host ""
Write-Host "تم حفظ النسخة:" -ForegroundColor Green
Write-Host "   commit : $sha" -ForegroundColor Green
Write-Host "   tag    : $tag" -ForegroundColor Green
Write-Host "   تعليق : $fullMsg" -ForegroundColor Green
Write-Host ""
Write-Host "للعودة إلى هذه النسخة (في حال حدث أي تغيير غير مرغوب):" -ForegroundColor Yellow
Write-Host "   git checkout $tag        # عرض النسخة (read-only)" -ForegroundColor Yellow
Write-Host "   git reset --hard $tag    # يمحو التغييرات الحالية ويعيد هذه النسخة" -ForegroundColor Yellow
Write-Host ""
Write-Host "لعرض كل النسخ المحفوظة:" -ForegroundColor DarkGray
Write-Host "   git tag -l `"snapshot-*`" -n1" -ForegroundColor DarkGray
EOF