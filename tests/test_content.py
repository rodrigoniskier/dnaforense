from pathlib import Path
import subprocess
from PIL import Image
root=Path(__file__).resolve().parents[1]
for file in ['index.html','data.js','app.js','styles.css','qr-local.js','vercel.json','favicon.svg']:
 assert (root/file).exists(), file
assert Image.open(root/'assets/apostila-qr.png').width>=200
assert Image.open(root/'assets/livro-qr.png').width>=100
assert Image.open(root/'assets/scene-resolution.webp').width>=1000
assert 'Curso de Exame de DNA' in (root/'app.js').read_text()
assert 'Curso de Exame de DNA' in (root/'index.html').read_text()
assert 'O profissional prepara a amplificação' in (root/'data.js').read_text()
assert 'técnico prepara' not in (root/'data.js').read_text()
assert all(word not in (root/'app.js').read_text().lower() for word in ['fictício','fictícia','fictícios','fictícias'])
assert 'apostila-qr.png' in (root/'app.js').read_text()
assert "liveURL=window.location.origin" in (root/'app.js').read_text()
assert 'B0G2DZ2X3K' in (root/'data.js').read_text()
assert '/portal-original.html' in (root/'app.js').read_text()
for file in ['app.js','data.js','qr-local.js']:
 subprocess.run(['node','--check',str(root/file)],check=True)
for n in (root/'assets').glob('*.webp'):
 assert n.stat().st_size<250_000,n
print('Static source and asset checks: OK')
