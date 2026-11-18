import re,json,subprocess, pathlib
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
assert all((root/f).exists() for f in ['index.html','data.js','app.js','styles.css','vercel.json','favicon.svg'])
assert all((root/'assets'/f).exists() for f in ['livro-qr.png','unipe.png','diagram-alleles.webp','diagram-outcomes.webp','scene-resolution.webp'])
assert Image.open(root/'assets/scene-resolution.webp').width>=1000
assert 'B0G2DZ2X3K' in (root/'data.js').read_text()
assert '/portal-original.html' in (root/'app.js').read_text()
assert 'mutation' not in (root/'index.html').read_text()
assert 'C.modules' in (root/'app.js').read_text()
assert all((root/'assets'/n).stat().st_size<250000 for n in (x.name for x in (root/'assets').glob('*.webp')))
for f in ['app.js','data.js']:
    subprocess.run(['node','--check',str(root/f)],check=True)
print('Static content and file validation: OK')
