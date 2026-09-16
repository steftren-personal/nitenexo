#!/usr/bin/env bash
# Storyboard „Eine Nacht, ein Take" – 6 fotorealistische Stills via Higgsfield (nano_banana_pro, 16:9, 2k)
set -u
cd /root/projects/nitenexo/assets/film
STYLE="Photorealistic cinematic film still, anamorphic 35mm, shallow depth of field, moody night lighting, color palette deep violet (#150f23) shadows with a single lime-green (#c8f04a) neon accent, natural film grain, no people, no faces, no text, no logos, no watermark"
declare -A P
P[01_hero]="Exterior of an upscale cocktail bar at night, seen through a rain-covered window from outside, neon reflections in violet and one lime-green neon line above the door, blurred city lights, the entrance door slightly open with warm light spilling out. $STYLE"
P[02_tresen]="Inside the bar at 23:40: a polished dark counter, one smartphone lying on it lighting up with a glowing screen, condensation on a lone glass, bottles softly backlit in violet, empty stools, lime-green light reflecting on the counter edge. $STYLE"
P[03_website]="Close-up over a tablet standing on a restaurant table, its screen glowing with a dark elegant website layout (abstract blocks, no readable text), a menu card and a candle beside it, violet ambient light, lime-green accent glow from the screen edge. $STYLE"
P[04_club]="Wide shot over a packed nightclub dance floor seen from the DJ booth, only silhouettes and raised hands in backlight and haze, no faces visible, laser beams in violet and magenta, one lime-green laser line cutting through, confetti in the air. $STYLE"
P[05_morgen]="The same bar at dawn: chairs stacked on tables, soft blue morning light through the window, a cash register drawer open on the counter, coffee cup steaming, a receipt printer, quiet and clean, a faint lime-green neon still glowing. $STYLE"
P[06_faden]="Abstract finale: a single thin lime-green thread of light weaving through violet smoke and connecting glowing nodes, glassy reflections, dark premium tech mood, seamless calm. $STYLE"
pids=()
for k in 01_hero 02_tresen 03_website 04_club 05_morgen 06_faden; do
  higgsfield generate create nano_banana_pro --prompt "${P[$k]}" --aspect_ratio 16:9 --resolution 2k --wait --wait-timeout 5m --json > "$k.json" 2>&1 &
  pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done
python3 - <<'PY'
import json, subprocess, glob
from PIL import Image, ImageDraw
ims=[]
for f in sorted(glob.glob('*.json')):
    d=json.load(open(f)); j=d[0] if isinstance(d,list) else d; n=f[:-5]
    if j.get('status')!='completed': print(n, 'FEHLER', str(j)[:120]); continue
    subprocess.run(['curl','-sL','-o',f'{n}.png', j['result_url']]); im=Image.open(f'{n}.png').convert('RGB'); print(n, im.size)
    t=im.copy(); t.thumbnail((640,640)); ImageDraw.Draw(t).text((12,10), n, fill=(200,240,74)); ims.append(t)
cols=3; w=ims[0].width; h=ims[0].height; rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(cols*w+(cols-1)*8, rows*h+(rows-1)*8))
for i,im in enumerate(ims): sheet.paste(im,((i%cols)*(w+8),(i//cols)*(h+8)))
sheet.save('/tmp/film_storyboard.jpg',quality=85); print('storyboard', sheet.size)
PY
higgsfield workspace list 2>&1 | tail -1 | awk '{print "Credits:", $4}'
