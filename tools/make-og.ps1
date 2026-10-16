# Generates assets/og-image.png (1200x630) - the social preview card.
# Usage:  powershell -ExecutionPolicy Bypass -File tools/make-og.ps1
# Keep this file ASCII-only: Windows PowerShell 5.1 reads .ps1 as ANSI.

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
$out = Join-Path $repoRoot "assets\og-image.png"

$w = 1200
$h = 630

$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Background
$bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(10, 10, 10))
$g.FillRectangle($bg, 0, 0, $w, $h)

# Subtle grid
$gridPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 19, 19, 19)), 1
for ($x = 0; $x -lt $w; $x += 48) { $g.DrawLine($gridPen, $x, 0, $x, $h) }
for ($y = 0; $y -lt $h; $y += 48) { $g.DrawLine($gridPen, 0, $y, $w, $y) }

# Soft top glow
$glow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(10, 255, 255, 255))
$g.FillEllipse($glow, -300, -420, 1100, 700)

# Text brushes
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(237, 237, 237))
$grey  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(150, 150, 154))
$dim   = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(100, 100, 104))

# Fonts
$fTitle = New-Object System.Drawing.Font("Segoe UI", 58, [System.Drawing.FontStyle]::Bold)
$fSub   = New-Object System.Drawing.Font("Segoe UI", 28)
$fMono  = New-Object System.Drawing.Font("Consolas", 19)
$fTag   = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Italic)

# Accent bar
$bar = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(237, 237, 237))
$g.FillRectangle($bar, 76, 176, 72, 5)

# Kicker
$g.DrawString("PORTFOLIO  /  DHAKA, BANGLADESH", $fMono, $dim, 76, 212)

# Name
$g.DrawString("Abdullah Al Mahmud", $fTitle, $white, 72, 250)

# Role
$g.DrawString("Software Quality Assurance Engineer", $fSub, $grey, 76, 348)

# Tagline
$g.DrawString("I break software on purpose - so your users never have to.", $fTag, $dim, 76, 420)

# Footer rule + handles
$rulePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 40, 40, 42)), 1
$g.DrawLine($rulePen, 76, 520, 1124, 520)
$g.DrawString("github.com/Mahmud9248", $fMono, $dim, 76, 545)

$rightText = "4+ years  /  SaaS / AI / FinTech"
$rightSize = $g.MeasureString($rightText, $fMono)
$g.DrawString($rightText, $fMono, $dim, (1124 - $rightSize.Width), 545)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

$info = Get-Item $out
"Generated: $($info.FullName)"
"Size: $([math]::Round($info.Length / 1KB, 1)) KB"
