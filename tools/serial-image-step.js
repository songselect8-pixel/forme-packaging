async (approveId,id)=>{
 if(approveId)text(await tools.exec_command({cmd:"python tools/prepare-structure-media.py --approve "+approveId,workdir:"D:/SongSelect/礼盒网站/forme-packaging",max_output_tokens:100}));
 const rr=await tools.exec_command({cmd:"@'\nimport json\nfrom pathlib import Path\nx=next(x for x in json.loads(Path('docs/product-image-prompts.json').read_text(encoding='utf-8')) if x['id']=='"+id+"');print(json.dumps({'prompt':x['prompt'],'state':x['regeneration']},ensure_ascii=True))\n'@ | python -",workdir:"D:/SongSelect/礼盒网站/forme-packaging",max_output_tokens:1800});
 const item=JSON.parse(rr.output);
 if(item.state.paused)throw Error("Image generation is paused at the user request; resume only after an explicit instruction.");
 if(item.state.status==='generated'){text({id,resumed:true,path:item.state.sourcePath});image((await tools.view_image({path:item.state.sourcePath})).image_url);return;}
 if(item.state.status==='complete'){text({id,alreadyComplete:true});return;}
 const r=await tools.image_gen__imagegen({prompt:item.prompt,transparent_background:false});
 store('lastGenerationHint',{id,hint:r.output_hint});
 const path=(r.output_hint.split(' as ')[1]||'').split(' by default.')[0].trim();if(!path.endsWith('.png'))throw Error('Inspect saved generation hint; do not retry blindly.');
 await tools.exec_command({cmd:"python tools/prepare-structure-media.py --record "+id+" --source '"+path.replaceAll(String.fromCharCode(92),'/')+"'",workdir:"D:/SongSelect/礼盒网站/forme-packaging",max_output_tokens:100});
 text({id,path});generatedImage(r);
}
