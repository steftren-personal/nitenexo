#!/usr/bin/env bash
# Film „Eine Nacht, ein Take": 6 Szenen animieren (Kling 3.0 Turbo, 720p, 5 s, start_image = Storyboard-Still)
set -u
cd /root/projects/nitenexo/assets/film
declare -A M
M[01_hero]="Slow cinematic dolly forward toward the open bar door, rain streaks slide down the window, neon reflections shimmer, warm light pulses gently from inside, camera almost steady, no people, no text"
M[02_tresen]="Static camera with a very slow push-in on the counter, the smartphone screen lights up and glows brighter, tiny condensation drops run down the glass, bottles' backlight breathes softly, no people, no text"
M[03_website]="Slow lateral glide along the table, candle flame flickers, the tablet screen softly shimmers as abstract dark layout blocks glow, shallow focus shifts from menu card to screen, no readable text, no people"
M[04_club]="Slow crane move over the dance floor, silhouettes sway, laser beams sweep through haze, confetti drifts down, magenta and violet light pulses, no faces visible, no text"
M[05_morgen]="Static dawn scene, steam rises slowly from the coffee cup, morning light gently brightens through the window, dust particles float, subtle camera drift, calm, no people, no text"
M[06_faden]="The lime-green light thread gently drifts and pulses, violet smoke rolls slowly, nodes breathe with glow, very slow push-in, calm seamless motion, no text, no people"
pids=()
for k in 01_hero 02_tresen 03_website 04_club 05_morgen 06_faden; do
  higgsfield generate create kling3_0_turbo --prompt "${M[$k]}" --start-image "$k.png" --aspect_ratio 16:9 --resolution 720p --duration 5 --wait --wait-timeout 15m --json > "$k.video.json" 2>&1 &
  pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done
python3 - <<'PY'
import json, subprocess, glob
for f in sorted(glob.glob('*.video.json')):
    d=json.load(open(f)); j=d[0] if isinstance(d,list) else d; n=f.replace('.video.json','')
    if j.get('status')!='completed' or not j.get('result_url'): print(n, 'FEHLER', str(j)[:160]); continue
    subprocess.run(['curl','-sL','-o',f'{n}.mp4', j['result_url']])
    print(n, subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=width,height','-of','csv=p=0',f'{n}.mp4'],capture_output=True,text=True).stdout.replace('\n',' '))
PY
higgsfield workspace list 2>&1 | tail -1 | awk '{print "Credits:", $4}'
