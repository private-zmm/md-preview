Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$buildDir = Join-Path $root 'build'
$sourcePath = Join-Path $buildDir 'source-logo.png'
$pngPath = Join-Path $buildDir 'icon.png'
$icoPath = Join-Path $buildDir 'icon.ico'

if (-not (Test-Path $sourcePath)) {
  throw "Missing source logo: $sourcePath"
}

function Get-ColorDistance {
  param([System.Drawing.Color]$A, [System.Drawing.Color]$B)
  $dr = [int]$A.R - [int]$B.R
  $dg = [int]$A.G - [int]$B.G
  $db = [int]$A.B - [int]$B.B
  return [Math]::Sqrt(($dr * $dr) + ($dg * $dg) + ($db * $db))
}

function Test-BackgroundLike {
  param([System.Drawing.Color]$Color)

  $max = [Math]::Max($Color.R, [Math]::Max($Color.G, $Color.B))
  $min = [Math]::Min($Color.R, [Math]::Min($Color.G, $Color.B))
  $saturation = $max - $min
  $brightness = ($Color.R + $Color.G + $Color.B) / 3

  return $brightness -gt 208 -and $saturation -lt 18
}

function Remove-Background {
  param([System.Drawing.Bitmap]$Source)

  $width = $Source.Width
  $height = $Source.Height
  $output = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $visited = New-Object 'bool[,]' $width, $height
  $queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()

  for ($x = 0; $x -lt $width; $x++) {
    $queue.Enqueue([System.Drawing.Point]::new($x, 0))
    $queue.Enqueue([System.Drawing.Point]::new($x, $height - 1))
  }
  for ($y = 0; $y -lt $height; $y++) {
    $queue.Enqueue([System.Drawing.Point]::new(0, $y))
    $queue.Enqueue([System.Drawing.Point]::new($width - 1, $y))
  }

  while ($queue.Count -gt 0) {
    $point = $queue.Dequeue()
    $x = $point.X
    $y = $point.Y
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $width -or $y -ge $height) { continue }
    if ($visited[$x, $y]) { continue }

    $color = $Source.GetPixel($x, $y)
    if (-not (Test-BackgroundLike $color)) { continue }

    $visited[$x, $y] = $true
    $queue.Enqueue([System.Drawing.Point]::new($x + 1, $y))
    $queue.Enqueue([System.Drawing.Point]::new($x - 1, $y))
    $queue.Enqueue([System.Drawing.Point]::new($x, $y + 1))
    $queue.Enqueue([System.Drawing.Point]::new($x, $y - 1))
  }

  $minX = $width
  $minY = $height
  $maxX = 0
  $maxY = 0

  for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
      $color = $Source.GetPixel($x, $y)
      if ($visited[$x, $y] -or (Test-BackgroundLike $color -and ($x -lt 160 -or $x -gt $width - 160 -or $y -lt 160 -or $y -gt $height - 160))) {
        $output.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }

      $alpha = $color.A
      $max = [Math]::Max($color.R, [Math]::Max($color.G, $color.B))
      $min = [Math]::Min($color.R, [Math]::Min($color.G, $color.B))
      $saturation = $max - $min

      if ($saturation -gt 14) {
        $r = [Math]::Min(255, [int](($color.R - 128) * 1.16 + 128))
        $g = [Math]::Min(255, [int](($color.G - 128) * 1.16 + 128))
        $b = [Math]::Min(255, [int](($color.B - 128) * 1.2 + 128))
        $color = [System.Drawing.Color]::FromArgb($alpha, [Math]::Max(0, $r), [Math]::Max(0, $g), [Math]::Max(0, $b))
      }

      $output.SetPixel($x, $y, $color)
      if ($alpha -gt 8) {
        $minX = [Math]::Min($minX, $x)
        $minY = [Math]::Min($minY, $y)
        $maxX = [Math]::Max($maxX, $x)
        $maxY = [Math]::Max($maxY, $y)
      }
    }
  }

  if ($minX -ge $maxX -or $minY -ge $maxY) {
    return $output
  }

  $padding = 34
  $cropX = [Math]::Max(0, $minX - $padding)
  $cropY = [Math]::Max(0, $minY - $padding)
  $cropW = [Math]::Min($width - $cropX, ($maxX - $minX) + ($padding * 2))
  $cropH = [Math]::Min($height - $cropY, ($maxY - $minY) + ($padding * 2))
  $side = [Math]::Max($cropW, $cropH)
  $square = [System.Drawing.Bitmap]::new($side, $side, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($square)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($output, [System.Drawing.Rectangle]::new(($side - $cropW) / 2, ($side - $cropH) / 2, $cropW, $cropH), $cropX, $cropY, $cropW, $cropH, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  $output.Dispose()
  return $square
}

function Resize-Icon {
  param([System.Drawing.Bitmap]$Source, [int]$Size)

  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $margin = if ($Size -le 32) { 1 } elseif ($Size -le 64) { 2 } else { 4 }
  $graphics.DrawImage($Source, [System.Drawing.Rectangle]::new($margin, $margin, $Size - ($margin * 2), $Size - ($margin * 2)))
  $graphics.Dispose()
  return $bitmap
}

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)
$clean = Remove-Background $source
$source.Dispose()

$icon1024 = Resize-Icon $clean 1024
$icon1024.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$icon1024.Dispose()

$sizes = @(16, 24, 32, 48, 64, 128, 256)
$images = @()
foreach ($size in $sizes) {
  $bitmap = Resize-Icon $clean $size
  $stream = [System.IO.MemoryStream]::new()
  $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  $images += [PSCustomObject]@{ Size = $size; Bytes = $stream.ToArray() }
  $stream.Dispose()
  $bitmap.Dispose()
}
$clean.Dispose()

$file = [System.IO.File]::Create($icoPath)
$writer = [System.IO.BinaryWriter]::new($file)
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]$images.Count)
$offset = 6 + (16 * $images.Count)
foreach ($image in $images) {
  $dimension = if ($image.Size -eq 256) { 0 } else { $image.Size }
  $writer.Write([Byte]$dimension)
  $writer.Write([Byte]$dimension)
  $writer.Write([Byte]0)
  $writer.Write([Byte]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]32)
  $writer.Write([UInt32]$image.Bytes.Length)
  $writer.Write([UInt32]$offset)
  $offset += $image.Bytes.Length
}
foreach ($image in $images) {
  $writer.Write($image.Bytes)
}
$writer.Dispose()
$file.Dispose()

Write-Host "Generated $pngPath"
Write-Host "Generated $icoPath"