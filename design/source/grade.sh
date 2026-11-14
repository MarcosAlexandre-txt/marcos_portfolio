#!/usr/bin/env bash
# Regenerates the shipped background rasters from their sources (needs ImageMagick 7).
# Run from the project root: bash design/source/grade.sh
set -euo pipefail
src=design/source
out=public/images
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# gradient maps: luminance -> palette
magick xc:'#020a52' xc:'#041ba5' xc:'#0c46d0' xc:'#1e8ef0' xc:'#35d2ff' xc:'#c9f8ff' +append -filter Cubic -resize 256x1! "$tmp/water-map.png"
magick xc:'#01083f' xc:'#04178f' xc:'#0c3fcc' xc:'#2aa8f5' xc:'#8fe9ff' +append -filter Cubic -resize 256x1! "$tmp/statue-map.png"

# water: surface seen from below, mirrored so the bright surface sits top right
for w in 1920 2560; do
  h=$((w * 9 / 16))
  magick "$src/water-source.jpg" -resize "${w}x" -gravity center -crop "${w}x${h}+0-$((w / 32))" +repage -flop \
    -colorspace Gray -sigmoidal-contrast 4x55% -colorspace sRGB -type TrueColor "$tmp/water-map.png" -clut \
    -quality 84 "$out/water-$w.jpg"
done

# statues: cut-out graded to the same blues, alpha kept
magick "$src/statue-cut.png" -alpha extract -blur 0x1 "$tmp/statue-alpha.png"
magick "$src/statue-cut.png" -alpha off -colorspace Gray -normalize -sigmoidal-contrast 3x45% -colorspace sRGB -type TrueColor "$tmp/statue-map.png" -clut \
  "$tmp/statue-alpha.png" -alpha off -compose CopyOpacity -composite -quality 86 "$out/statue.webp"
