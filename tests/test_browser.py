from playwright.sync_api import sync_playwright
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for device in [('desktop',1366,768),('mobile',390,844)]:
  name,w,h=device
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  def serve(route):
   rel=route.request.url.split('demo.test/')[-1]
   path=ROOT/rel
   if path.is_file():
    mime='image/webp' if path.suffix=='.webp' else ('image/png' if path.suffix=='.png' else 'text/plain')
    route.fulfill(status=200,content_type=mime,body=path.read_bytes())
   else: route.abort()
  page.route('**/*',serve)
  page.set_content('<html><head><base href="https://demo.test/"></head><body><div id="app"></div></body></html>')
  page.add_style_tag(content=(ROOT/'styles.css').read_text())
  page.add_script_tag(content=(ROOT/'data.js').read_text())
  page.add_script_tag(content=(ROOT/'app.js').read_text())
  assert page.get_by_role('heading',name='O menino sem identidade').count()>0
  assert page.locator('img[src="/assets/livro-qr.png"]').count()==1
  assert page.get_by_role('link',name='Ver livro na Amazon ↗').get_attribute('href').endswith('B0G2DZ2X3K')
  page.screenshot(path=str(ROOT/f'tests/{name}-home.png'),full_page=True)
  page.locator('[data-act=begin]').click()
  assert page.get_by_text('Relatório genético preliminar').count()>0
  assert page.locator('table tbody tr').count()==10
  page.screenshot(path=str(ROOT/f'tests/{name}-case.png'),full_page=True)
  page.locator('[data-act=next]').click()
  assert page.get_by_text('O DNA tem uma história familiar.').count()>0
  page.screenshot(path=str(ROOT/f'tests/{name}-slide.png'),full_page=True)
  for i in range(5):
   if i>0: pass
   page.locator('[data-act=next]').click()
  assert page.get_by_text('Pense, discuta, responda.').count()>0
  for j,ans in enumerate([0,1,2]):
   page.locator(f'[data-act="answer-0-{j}-{ans}"]').click()
   page.locator('[data-act=quiznext]').click()
  assert page.get_by_text('3 / 3 respostas corretas').count()>0
  page.locator('[data-act=next]').click()
  for _ in range(8):page.locator('[data-act=next]').click()
  for j,ans in enumerate([0,1,2]):
   page.locator(f'[data-act="answer-1-{j}-{ans}"]').click()
   page.locator('[data-act=quiznext]').click()
  page.locator('[data-act=next]').click()
  for _ in range(6):page.locator('[data-act=next]').click()
  for j,ans in enumerate([0,1,2]):
   page.locator(f'[data-act="answer-2-{j}-{ans}"]').click()
   page.locator('[data-act=quiznext]').click()
  page.locator('[data-act=next]').click()
  assert page.get_by_text('Qual é seu parecer inicial?').count()>0
  page.locator('[data-act=choice-care]').click()
  page.locator('[data-act=next]').click()
  assert page.get_by_text('Vamos reconstruir a evidência.').count()>0
  page.locator('[data-act=next]').click()
  assert page.get_by_text('André apresenta').count()>0
  assert page.locator('table tbody tr').count()==10
  page.screenshot(path=str(ROOT/f'tests/{name}-resolution.png'),full_page=True)
  for _ in range(3):page.locator('[data-act=next]').click()
  assert page.get_by_text('O que podemos afirmar?').count()>0
  page.screenshot(path=str(ROOT/f'tests/{name}-final.png'),full_page=True)
  print(name, 'flow completed; js errors:',errors)
  assert errors==[]
  page.close()
 browser.close()
