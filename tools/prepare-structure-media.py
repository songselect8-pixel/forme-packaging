from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,subprocess,shutil,sys
root=Path(__file__).resolve().parents[1]
paths=json.loads((root/'output/structure-image-paths.json').read_text(encoding='utf-8-sig'))
assets=root/'dist/assets'; originals=root/'output/structure-originals';originals.mkdir(exist_ok=True)
def convert(item):
 name,source=item;source=Path(source);target=assets/(name+'.webp')
 if target.exists() and target.stat().st_mtime>source.stat().st_mtime:return
 shutil.copyfile(source,originals/(name+'.png'))
 subprocess.run(['ffmpeg','-y','-i',str(source),'-c:v','libwebp','-quality','86','-compression_level','6','-frames:v','1',str(target)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(convert,paths.items()))
aliases={'hero':'p05','magnetic':'p05','drawer':'p07','rigid':'p10','mailer':'p06','tube':'p08','bag':'p09','wellness':'p01','holiday':'p02','candle':'p03','vial':'p04','hexagon':'p33','heart':'p34','pyramid':'p35','gable':'p36','calendar':'p49','cabinet':'p50','corporate':'p42','wine':'p53','chocolate':'p37','ramadan':'p51','keepsake':'p55','coffee':'p58','retail':'p22','phone':'p25','collapsible':'p38','medal':'p54','book':'p56','elongated':'p32'}
for name,id in aliases.items():
 if id in paths:shutil.copyfile(assets/(id+'.webp'),assets/(name+'.webp'))
if '--video' in sys.argv:
 assert len(paths)==78,'Complete imagery before rebuilding the film'
 inputs=[]
 for id in ['p05','p61','p67','p73']:inputs+=['-loop','1','-framerate','30','-i',str(assets/(id+'.webp'))]
 filters=[]
 for i in range(4):filters.append(f"[{i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xf5f2ea,setsar=1,trim=duration=3.5,setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
 filters+=['[v0][v1]xfade=transition=fade:duration=0.5:offset=3[x1]','[x1][v2]xfade=transition=fade:duration=0.5:offset=6[x2]','[x2][v3]xfade=transition=fade:duration=0.5:offset=9,trim=duration=12[out]']
 subprocess.run(['ffmpeg','-y',*inputs,'-filter_complex',';'.join(filters),'-map','[out]','-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-t','12',str(assets/'forme-film.mp4')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print('Prepared',len(paths),'product photos and refreshed',sum(id in paths for id in aliases.values()),'shared image slots.')
