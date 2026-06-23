Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead("c:\Users\arjun\Downloads\Antigravity Files\5.20_v5.pptx")

# Read slide14 XML (board members slide)
$slide14 = $null
foreach($entry in $zip.Entries) {
    if ($entry.FullName -eq "ppt/slides/slide14.xml") {
        $sr = New-Object System.IO.StreamReader($entry.Open())
        $slide14 = $sr.ReadToEnd()
        $sr.Close()
    }
}

# Read rels for slide14
$rels14 = $null
foreach($entry in $zip.Entries) {
    if ($entry.FullName -eq "ppt/slides/_rels/slide14.xml.rels") {
        $sr = New-Object System.IO.StreamReader($entry.Open())
        $rels14 = $sr.ReadToEnd()
        $sr.Close()
    }
}
$zip.Dispose()

# Parse relationship IDs to image files
Write-Host "=== RELATIONSHIPS ==="
$relMatches = [regex]::Matches($rels14, 'Id="(rId\d+)"[^>]*Target="([^"]*)"')
$relMap = @{}
foreach($r in $relMatches) {
    $relMap[$r.Groups[1].Value] = $r.Groups[2].Value
    if ($r.Groups[2].Value -like "*image*") {
        Write-Host "$($r.Groups[1].Value) -> $($r.Groups[2].Value)"
    }
}

# Parse each shape (sp) in slide14 to get position, text, and image references
# We need to find picture elements (p:pic) and text shapes (p:sp) with their positions
Write-Host "`n=== PICTURE ELEMENTS WITH POSITIONS ==="

# Find all pic elements with their positions and rIds
$picPattern = '<p:pic>.*?</p:pic>'
$picMatches = [regex]::Matches($slide14, $picPattern, 'Singleline')
foreach($pic in $picMatches) {
    $content = $pic.Value
    # Get position
    $offMatch = [regex]::Match($content, '<a:off x="(\d+)" y="(\d+)"')
    $extMatch = [regex]::Match($content, '<a:ext cx="(\d+)" cy="(\d+)"')
    $embedMatch = [regex]::Match($content, 'r:embed="(rId\d+)"')
    
    if ($offMatch.Success -and $embedMatch.Success) {
        $x = [int64]$offMatch.Groups[1].Value
        $y = [int64]$offMatch.Groups[2].Value
        $rId = $embedMatch.Groups[1].Value
        $img = $relMap[$rId]
        Write-Host "Position: x=$x y=$y -> $rId -> $img"
    }
}

Write-Host "`n=== TEXT SHAPES WITH POSITIONS ==="
# Find text shapes with their positions and text content
$spPattern = '<p:sp>.*?</p:sp>'
$spMatches = [regex]::Matches($slide14, $spPattern, 'Singleline')
foreach($sp in $spMatches) {
    $content = $sp.Value
    $offMatch = [regex]::Match($content, '<a:off x="(\d+)" y="(\d+)"')
    $texts = [regex]::Matches($content, '<a:t>(.*?)</a:t>')
    $allText = ""
    foreach($t in $texts) { 
        if ($t.Groups[1].Value.Length -gt 1) { $allText += $t.Groups[1].Value + " " }
    }
    $allText = $allText.Trim()
    
    if ($offMatch.Success -and $allText.Length -gt 2 -and $allText -notlike "*APPENDIX*" -and $allText -notlike "*Board Members*" -and $allText -notlike "*Impact Consulting*" -and $allText -notlike "*supported*") {
        $x = [int64]$offMatch.Groups[1].Value
        $y = [int64]$offMatch.Groups[2].Value
        Write-Host "Position: x=$x y=$y -> Text: '$allText'"
    }
}
