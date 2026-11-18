from playwright.sync_api import sync_playwright
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
errs=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,w,h in [('desktop',1366,768),('mobile',390,844),('small',320,568),('wide',1920,1080),('tablet',820,1180)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def serve(route):
   rel=route.request.url.split('demo.test/')[-1].split('?')[0]
   path=ROOT/rel
   if path.is_file():
    mime= {'.webp':'image/webp','.png':'image/png','.css':'text/css','.js':'application/javascript','.html':'text/html','.svg':'image/svg+xml'}.get(path.suffix,'text/plain')
    route.fulfill(status=200,content_type=mime,body=path.read_bytes())
   else:route.abort()
  page.route('**/*',serve)
  page.set_content('<html><head><base href="https://demo.test/"></head><body><div id="app"></div></body></html>')
  page.add_style_tag(content=(ROOT/'styles.css').read_text())
  page.add_script_tag(content=(ROOT/'qr-local.js').read_text())
  page.add_script_tag(content=(ROOT/'data.js').read_text())
  page.add_script_tag(content=(ROOT/'app.js').read_text())
  def check(label):
   page.evaluate("""async () => {await Promise.all([...document.querySelectorAll('.opening-main img,.stage-center img')].map(i=>i.decode().catch(()=>{})));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)}""")
   result=page.evaluate('''() => {const el=document.querySelector('.opening-main,.stage-center');const cont=el.firstElementChild;const a=el.getBoundingClientRect();const b=cont.getBoundingClientRect();return {scroll:document.documentElement.scrollHeight,view:innerHeight,scale:el.dataset.fitScale,overflow:{y1:b.top-a.top,y2:a.bottom-b.bottom,x1:b.left-a.left,x2:a.right-b.right},h:cont.offsetHeight};}''')
   if result['scroll']>h+2:errs.append((name,label,'scroll',result))
   ov=result['overflow']
   if any(v < -3 for v in ov.values()):errs.append((name,label,'clip',result))
   if float(result['scale'])<.48:errs.append((name,label,'tiny',result))
   return result
  check('opening')
  page.screenshot(path=str(ROOT/f'tests/v2-{name}-opening.png'))
  page.get_by_role('button',name='Fontes').click()
  assert page.get_by_role('dialog').is_visible()
  page.get_by_role('button',name='Fechar',exact=True).click()
  assert page.get_by_role('dialog').count()==0
  page.get_by_role('button',name='Fontes').click()
  page.get_by_role('button',name='Fechar fontes').click()
  assert page.get_by_role('dialog').count()==0
  page.locator('[data-act=begin]').click(); check('intro')
  assert page.get_by_text('O menino sem identidade').count()>0
  page.locator('[data-act=next]').click();check('evidence')
  assert page.locator('table tbody tr').count()==10
  page.screenshot(path=str(ROOT/f'tests/v2-{name}-evidence.png'))
  # Navigate all slides and quizzes.
  for i in range(3):
   for j in range(len(page.evaluate(f'window.DNA_COURSE.modules[{i}].slides'))):
    page.locator('[data-act=next]').click()
    check(f'slide{i}-{j}')
   page.locator('[data-act=next]').click();check(f'quiz{i}-1')
   for k,choice in enumerate([0,1,2]):
    page.locator(f'[data-act="answer-{i}-{k}-{choice}"]').click()
    check(f'quiz{i}-{k}-feedback')
    page.locator('[data-act=quiznext]').click()
   check(f'quiz{i}-complete')
  page.locator('[data-act=next]').click()
  check('analysis');page.locator('[data-act=choice-care]').click()
  page.locator('[data-act=next]').click()
  for j in range(5):
   check(f'resolution{j}')
   page.locator('[data-act=next]').click()
  check('resources')
  assert page.get_by_text('Apostila completa').count()>0
  assert page.locator('.resource-qr').count()==3
  assert 'demo.test' in page.locator('.resource-qr').nth(2).get_attribute('href')
  assert page.locator('.resource-qr img').nth(2).get_attribute('src').startswith('data:image/svg+xml')
  assert page.locator('.resource-qr img').nth(2).evaluate('(el)=>el.naturalWidth')>0
  page.screenshot(path=str(ROOT/f'tests/v2-{name}-resources.png'))
  assert errors==[],(name,errors)
  print(name,'PASS',w,h,'scale-final',page.locator('.stage-center').get_attribute('data-fit-scale'))
  page.close()
 browser.close()
print('ISSUES',len(errs))
for x in errs[:25]:print(x)
assert not errs, f'{len(errs)} layout issues'
