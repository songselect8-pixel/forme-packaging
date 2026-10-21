from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, subprocess, shutil
root=Path(__file__).resolve().parents[1]
items=json.loads((root/'output/revision-assets.json').read_text(encoding='utf-8'))
originals=root/'output/originals'; originals.mkdir(parents=True,exist_ok=True)
def convert(item):
    name,source=item
    shutil.copyfile(source, originals/(name+'.png'))
    result=subprocess.run(['ffmpeg','-y','-i',source,'-c:v','libwebp','-quality','86','-compression_level','6','-frames:v','1',str(root/'dist/assets'/(name+'.webp'))],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    if result.returncode: raise RuntimeError(result.stderr.decode(errors='replace')[-800:])
    return name
with ThreadPoolExecutor(max_workers=4) as pool:
    results=list(pool.map(convert,items.items()))
print('Prepared',len(results),'new original product photographs.')
