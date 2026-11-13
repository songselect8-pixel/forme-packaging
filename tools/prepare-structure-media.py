from pathlib import Path
import argparse,hashlib,json,subprocess,shutil,sys
root=Path(__file__).resolve().parents[1]
paths=json.loads((root/'output/structure-image-paths.json').read_text(encoding='utf-8-sig'))
assets=root/'dist/assets'
registry_path=root/'docs/product-image-prompts.json'
registry=json.loads(registry_path.read_text(encoding='utf-8'))
parser=argparse.ArgumentParser()
parser.add_argument('--record')
parser.add_argument('--source')
parser.add_argument('--approve')
parser.add_argument('--video',action='store_true')
args=parser.parse_args()
def save_registry():registry_path.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def find(name):return next(x for x in registry if x['id']==name)
if args.record:
 item=find(args.record);source=Path(args.source).resolve()
 if not source.is_file():raise FileNotFoundError(source)
 item['regeneration'].update(status='generated',sourcePath=str(source))
 save_registry();print('Recorded generated image:',args.record)
if args.approve:
 item=find(args.approve);state=item['regeneration'];source=Path(state['sourcePath'])
 if state['status'] not in ['generated','complete']:raise ValueError('Image must be generated and visually reviewed first')
 target=assets/(args.approve+'.webp')
 if state['status']=='complete':
  assert target.is_file() and hashlib.sha256(target.read_bytes()).hexdigest()==state['sha256']
 else:
  temporary=root/'output/current-image.webp'
  subprocess.run(['ffmpeg','-y','-i',str(source),'-c:v','libwebp','-quality','90','-compression_level','6','-frames:v','1',str(temporary)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  digest=hashlib.sha256(temporary.read_bytes()).hexdigest()
  if digest==state['previousSha256']:raise ValueError('New image matches the previous final')
  temporary.replace(target)
  state.update(status='complete',sha256=digest)
 paths[args.approve]=str(source)
 (root/'output/structure-image-paths.json').write_text(json.dumps(paths,indent=2),encoding='utf-8')
 # Existing aliases retain the image URLs used throughout the site's pages.
 aliases={'magnetic':'p05','drawer':'p07','rigid':'p10','mailer':'p06','tube':'p08','bag':'p09','wellness':'p01','holiday':'p02','candle':'p03','vial':'p04','hexagon':'p33','heart':'p34','pyramid':'p35','gable':'p36','calendar':'p49','cabinet':'p50','corporate':'p42','wine':'p53','chocolate':'p37','ramadan':'p51','keepsake':'p55','coffee':'p58','retail':'p22','phone':'p25','collapsible':'p38','medal':'p54','book':'p56','elongated':'p32'}
 for alias,id in aliases.items():
  if id==args.approve:shutil.copyfile(target,assets/(alias+'.webp'))
 save_registry();print('Reviewed and replaced:',args.approve)
if args.video:
 assert all(find(id)['regeneration']['status']=='complete' for id in ['showcase','p61','p67','p73']),'Review the four selected film photos before rebuilding'
 inputs=[]
 for id in ['showcase','p61','p67','p73']:inputs+=['-loop','1','-framerate','30','-i',str(assets/(id+'.webp'))]
 filters=[]
 for i in range(4):filters.append(f"[{i}:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,trim=duration=3.5,setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
 filters+=['[v0][v1]xfade=transition=fade:duration=0.5:offset=3[x1]','[x1][v2]xfade=transition=fade:duration=0.5:offset=6[x2]','[x2][v3]xfade=transition=fade:duration=0.5:offset=9,trim=duration=12[out]']
 subprocess.run(['ffmpeg','-y',*inputs,'-filter_complex',';'.join(filters),'-map','[out]','-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-t','12',str(assets/'forme-film.mp4')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print('Image progress:',sum(x.get('regeneration',{}).get('status')=='complete' for x in registry),'/',len(registry))
