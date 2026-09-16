#!/usr/bin/env bash
# Schnitt „Eine Nacht, ein Take" in Seitenreihenfolge: Hero → Morgen danach → Faden (Über NiteNexo) → Club → Website → Tresen/Handy (Assistent + CTA)
# Desktop: 1600x900, 24 fps, Keyframe alle 8 Frames (Scroll-Scrubbing), Ping-Pong nicht nötig (linear gescrubbt)
# Mobil: 540x960 Hochkant (Center-Crop), gleiche Schnittfolge
set -eu
cd /root/projects/nitenexo/assets/film
ORDER=(01_hero 05_morgen 06_faden 04_club 03_website 02_tresen)
XF=0.6; D=5.041667
# Filtergraph mit xfade-Kette
inputs=(); for n in "${ORDER[@]}"; do inputs+=(-i "$n.mp4"); done
fg=""; off=0
for i in 0 1 2 3 4 5; do fg+="[$i:v]fps=24,scale=1600:900:flags=lanczos,setsar=1,format=yuv420p[v$i];"; done
prev="v0"
for i in 1 2 3 4 5; do
  off=$(python3 -c "print(round($D*$i - $XF*$i, 3))")
  out="x$i"; [ $i -eq 5 ] && out="vout"
  fg+="[$prev][v$i]xfade=transition=fade:duration=$XF:offset=$off[$out];"
  prev="$out"
done
fg="${fg%;}"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$fg" -map "[vout]" -an \
  -c:v libx264 -preset slow -crf 25 -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart film-desktop.mp4
# Mobil hochkant aus dem Desktop-Schnitt (Center-Crop 9:16)
ffmpeg -v error -y -i film-desktop.mp4 -vf "crop=506:900:547:0,scale=540:960:flags=lanczos" -an \
  -c:v libx264 -preset slow -crf 26 -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart film-mobile.mp4
# Poster + Szenen-Standbilder (Reduced-Motion / LCP)
ffmpeg -v error -y -ss 0 -i film-desktop.mp4 -vframes 1 -c:v libwebp -quality 82 film-poster.webp
ffmpeg -v error -y -ss 0 -i film-mobile.mp4 -vframes 1 -c:v libwebp -quality 82 film-poster-mobile.webp
# Szenen-Zeitkarte
python3 - <<'PY'
import json
order=["01_hero","05_morgen","06_faden","04_club","03_website","02_tresen"]; D=5.041667; XF=0.6
scenes=[]; t=0.0
labels={"01_hero":"Hero: Bar von außen, Tür offen","05_morgen":"Kapitel 1 · Der Morgen danach","06_faden":"Kapitel 2 · Über NiteNexo (der Faden)","04_club":"Kapitel 3 · Für deine Art von Laden","03_website":"Kapitel 4 · Was wir bauen","02_tresen":"Kapitel 5/6 · Dein Assistent + Dein Zug (Handy leuchtet)"}
for i,n in enumerate(order):
    start=round(i*(D-XF),3); end=round(start+D,3)
    scenes.append({"scene":n,"page":labels[n],"start":start,"end":end,"stable_from":round(start+ (XF if i else 0),3),"stable_to":round(end-XF,3)})
json.dump({"fps":24,"crossfade":XF,"total":round(5*(D-XF)+D,3),"scenes":scenes}, open("scene-map.json","w"), indent=2, ensure_ascii=False)
print(json.dumps(scenes, ensure_ascii=False, indent=1))
PY
for f in film-desktop.mp4 film-mobile.mp4 film-poster.webp film-poster-mobile.webp; do printf '%-24s %s\n' $f "$(du -h $f | cut -f1)"; done
ffprobe -v error -show_entries format=duration -of csv=p=0 film-desktop.mp4
echo "Keyframes desktop: $(ffprobe -v error -skip_frame nokey -select_streams v -show_entries frame=pts_time -of csv=p=0 film-desktop.mp4 | wc -l)"
