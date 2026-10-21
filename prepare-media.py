"""Optimize original generated assets, self-host open fonts, render a silent lookbook."""
from pathlib import Path
from urllib.request import Request, urlopen
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'dist' / 'assets'
ORIGINALS = ROOT / 'output' / 'originals'
ORIGINALS.mkdir(parents=True, exist_ok=True)
def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

sources = {
    'hero': 'exec-1459e936-3d47-421a-9081-9ba55851a2b7.png',
    'magnetic': 'exec-6a1d9347-992e-4167-9b40-5db66a010cce.png',
    'drawer': 'exec-c304e363-9631-4985-825a-254ab4b73d1c.png',
    'rigid': 'exec-c1a2118f-0add-4294-acc0-d1213725aa99.png',
    'mailer': 'exec-d28eae3c-c9a6-48c3-8261-484874260f66.png',
    'tube': 'exec-d7be9e2c-a379-4a83-a8fc-8cad1011089e.png',
    'bag': 'exec-fa21e85e-7956-4761-b3a4-c24f5073fa26.png'
}
generated = Path('C:/Users/XuWanPi/.codex/generated_images/01a15c54-d778-7913-b343-c2e06f446851')
for name, filename in sources.items():
    (ORIGINALS / (name + '.png')).write_bytes((generated / filename).read_bytes())

def optimize(name):
    run(['ffmpeg', '-y', '-i', str(ORIGINALS / (name+'.png')), '-c:v', 'libwebp', '-quality', '87', '-compression_level', '6', '-frames:v', '1', str(ASSETS / (name+'.webp'))])
with ThreadPoolExecutor(max_workers=4) as pool:
    list(pool.map(optimize, ['hero','magnetic','rigid','drawer','mailer','tube','bag']))

fonts = {
    'serif-regular': 'Cormorant+Garamond:wght@400',
    'serif-italic': 'Cormorant+Garamond:ital,wght@1,400',
    'sans': 'Manrope:wght@400..700'
}
for filename, family in fonts.items():
    request = Request('https://fonts.googleapis.com/css2?family='+family+'&display=swap', headers={'User-Agent':'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'})
    css = urlopen(request, timeout=30).read().decode()
    # The Latin subset is the final block in Google's stylesheet.
    url = re.findall(r'url\((https://[^)]+)\)', css)[-1]
    (ASSETS / (filename+'.ttf')).write_bytes(urlopen(url, timeout=30).read())

# Silent 12-second lookbook: original stills, gentle camera motion, soft dissolves.
inputs = []
for name in ['hero','magnetic','drawer','rigid']:
    inputs += ['-loop','1','-framerate','30','-i',str(ASSETS/(name+'.webp'))]
filters = []
for i in range(4):
    filters.append(f"[{i}:v]scale=1600:-1,crop=1600:900,zoompan=z='1+0.00032*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=105:s=1280x720:fps=30,trim=duration=3.5,setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
filters += [
    '[v0][v1]xfade=transition=fade:duration=0.5:offset=3[x1]',
    '[x1][v2]xfade=transition=fade:duration=0.5:offset=6[x2]',
    '[x2][v3]xfade=transition=fade:duration=0.5:offset=9,trim=duration=12[out]'
]
run(['ffmpeg','-y',*inputs,'-filter_complex',';'.join(filters),'-map','[out]','-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-t','12',str(ASSETS/'forme-film.mp4')])
print('Prepared 7 optimized original photos, 3 self-hosted font files and a 12-second MP4.')
