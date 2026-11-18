'use strict';
(() => {
const C = window.DNA_COURSE;
if (!C) throw Error('Não foi possível carregar o conteúdo didático.');
const $ = document.getElementById('app');
const KEY = 'dnaforense-curso-v2';
const flow = [{kind:'intro'}, {kind:'case'}];
C.modules.forEach((mod, mi) => {
  mod.slides.forEach((slide,si) => flow.push({kind:'slide',mi,si}));
  flow.push({kind:'quiz',mi});
});
flow.push({kind:'analysis'});
for(let r=0;r<5;r++) flow.push({kind:'resolution',r});
flow.push({kind:'resources'});
const qStart = C.modules.map((_,i) => flow.findIndex(s=>s.kind==='quiz' && s.mi===i));
const createState=()=>({pos:-1,furthest:0,answers:{},quizIndex:{},choice:null,modal:false,refPage:0});
let state=createState();
try{const old=JSON.parse(localStorage.getItem(KEY)||'null');if(old&&Number.isInteger(old.pos)&&old.pos>=-1&&old.pos<flow.length){state={...createState(),...old,modal:false}}}catch{}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({...state,modal:false}))}catch{}}
function safe(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function img(file,alt,cls=''){return `<img class="${cls}" src="/assets/${safe(file)}" alt="${safe(alt)}" loading="lazy">`}
function tags(arr=[]){return `<div class="taglist">${arr.map(t=>`<span>${safe(t)}</span>`).join('')}</div>`}
function button(label,act,cls='primary-button',extra=''){return `<button type="button" class="${cls}" data-act="${act}" ${extra}>${label}</button>`}
function referenceList(page=0){return C.references.slice(page*3,(page+1)*3).map(r=>`<li><a target="_blank" rel="noopener noreferrer" href="${safe(r.url)}">${safe(r.text)}</a></li>`).join('')}
function brand(){return `<a href="/" class="brand" aria-label="Voltar à abertura">${img('unipe.png','Centro Universitário de João Pessoa - UNIPÊ')}<span><strong>Curso de Exame de DNA</strong><small>Genética forense e paternidade</small></span></a>`}
function homepage(){
 return `<div class="opening-stage">
  <header class="opening-top">${brand()}<div class="opening-links">${button('Fontes','refs','outline-button')}<a href="/portal-original.html" target="_blank" rel="noopener noreferrer">Portal anterior ↗</a></div></header>
  <main class="opening-main"><div class="opening-inner">
   <section class="opening-copy"><span class="kicker">GENÉTICA FORENSE · APRENDIZAGEM INTERATIVA</span>
    <h1>Curso de Exame de DNA</h1>
    <p>Uma investigação desafiadora. Um percurso pelos fundamentos da genética, pelo laboratório e pela interpretação da paternidade.</p>
    <div class="opening-actions">${button('Começar apresentação →','begin','primary-button')}<span>3 blocos · 3 quizzes · resolução comentada</span></div>
    <a class="opening-old" href="/portal-original.html" target="_blank" rel="noopener noreferrer">Conhecer a página original do projeto ↗</a>
   </section>
   <section class="opening-photo" aria-label="Cena de abertura">${img('hero-case.webp','Participantes da investigação; rosto da criança preservado')}
    <div class="opening-book"><a href="${safe(C.book.url)}" target="_blank" rel="noopener noreferrer">${img('livro-qr.png','QR code do livro Introdução à Genética Molecular Forense','qr')}<span><b>Livro de apoio</b><small>Introdução à Genética Molecular Forense ↗</small></span></a></div>
   </section>
  </div></main>
 </div>`;
}
function geneticTable(mode='plain'){
  const c=C.case;
  if(mode==='analysis'){
    return `<div class="table-wrap"><table class="genetic-table" aria-label="Genótipos e análise dos alelos paternos"><thead><tr><th>Marcador</th><th>Alelo paterno</th><th>André</th><th>Bruno</th></tr></thead><tbody>${c.rows.map(row=>{
      const mom=parse(row[1]), child=parse(row[2]), a=parse(row[3]),b=parse(row[4]);
      const obligate=child.filter(x=>!mom.includes(x));
      const v=obligate.length===1?obligate[0]:null;
      return `<tr><td>${safe(row[0])}</td><td class="paternal">${v===null?'Requer avaliação':safe(v)}</td><td class="${v!==null&&!a.includes(v)?'allele-mismatch':'allele-match'}">${safe(row[3])} ${v!==null?(a.includes(v)?'✓':'✕'):''}</td><td class="${v!==null&&!b.includes(v)?'allele-mismatch':'allele-match'}">${safe(row[4])} ${v!==null?(b.includes(v)?'✓':'✕'):''}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  return `<div class="table-wrap"><table class="genetic-table" aria-label="Resultados de perfis STR"><thead><tr>${c.columns.map(h=>`<th scope="col">${safe(h)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(row=>`<tr>${row.map((v,i)=>`<td>${safe(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function parse(v){return String(v).split('/').map(x=>x.trim()).filter(Boolean)}
function stageHead(s){
 const mi=s.mi??(s.kind==='case'?-1:2);
 const label=s.kind==='intro'||s.kind==='case'?'Desafio de abertura':s.kind==='analysis'?'Seu parecer inicial':s.kind==='resolution'?'Resolução comentada':s.kind==='resources'?'Materiais para consulta':`Bloco ${mi+1} · ${C.modules[mi].title}`;
 const visibleStep=Math.max(0,state.pos+1);
 const p=Math.round(visibleStep/flow.length*100);
 return `<header class="stage-top"><div class="cluster">${button('← Início','home','ghost')}<strong>${safe(label)}</strong></div><div class="cluster"><span class="tiny">${visibleStep} de ${flow.length}</span>${button('Fontes','refs','ghost')}${button('⛶','fullscreen','ghost','aria-label="Alternar tela cheia"')}</div></header><div class="progress-track"><span style="width:${p}%"></span></div>`;
}
function stageFoot(s){
 let allowed=true;
 if(s.kind==='quiz')allowed=allAnswered(s.mi);
 if(s.kind==='analysis')allowed=state.choice!==null;
 const last=state.pos===flow.length-1;
 const nextlabel=last?'Voltar ao início':'Continuar →';
 return `<footer class="stage-bottom"><div>${button('← Voltar','back','nav-button',state.pos<=0?'disabled':'')}</div><div class="step-dots" aria-hidden="true">${Array.from({length:flow.length},(_,i)=>`<span class="step-dot ${i===state.pos?'active':''}"></span>`).join('')}</div>${button(nextlabel,'next','nav-button next',allowed?'':'disabled')}</footer>`;
}
function caseIntroView(){
 const p=C.case.paragraphs;
 return `<section class="case-intro-screen"><div class="case-intro-copy"><span class="kicker">O DESAFIO</span><h2>${safe(C.case.name)}</h2><p>${safe(p[0])}</p><p>${safe(p[1])}</p><div class="hint-chip">Observe os fatos. Os resultados laboratoriais vêm a seguir.</div></div>${img('hero-case.webp','Helena, Lucas, André e Bruno; rosto da criança preservado','case-intro-photo')}</section>`;
}
function caseView(){
 const p=C.case.paragraphs;
 return `<section class="case-evidence-screen"><div class="evidence-context"><span class="kicker">DOSSIÊ DE INVESTIGAÇÃO</span><h2>Relatório genético preliminar</h2><p>${safe(p[2])} ${safe(p[3])}</p><div class="case-instruction">${safe(C.case.instruction)}</div></div><div class="data-panel"><div class="panel-title"><h3>Perfis STR</h3><small>10 marcadores</small></div>${geneticTable()}</div></section>`;
}
function slideView(s){
const slide=C.modules[s.mi].slides[s.si];
const mainText=`<div class="slide-text"><div class="kicker">${safe(C.modules[s.mi].eyebrow)} · ${safe(slide.kicker)}</div><h2>${safe(slide.title)}</h2><p>${safe(slide.lead)}</p>${tags(slide.chips)}</div>`;
let visual='';
if(slide.type==='terms')visual=`<div class="slide-terms">${slide.terms.map(([a,b],i)=>`<div class="term-card"><div class="term-icon">${['◎','↔','②'][i]}</div><div><h3>${safe(a)}</h3><p>${safe(b)}</p></div></div>`).join('')}</div>`;
else if(slide.type==='metrics')visual=`<div class="slide-metrics"><div class="metric-card"><b>IP</b><p>Força da evidência em um locus, sob duas hipóteses.</p></div><div class="metric-card"><b>ICP</b><p>Integração da evidência obtida em vários loci.</p></div></div>`;
else if(slide.type==='stat')visual=`<div class="stat-visual"><span class="stat-number">99,99%</span><span class="stat-line">É uma estimativa <b>dependente do modelo</b>,<br>não a taxa de acerto do laboratório.</span></div>`;
else visual=`<div class="slide-visual ${slide.image.startsWith('scene')?'photo':''}">${img(slide.image,slide.imageAlt)}</div>`;
return `<section class="slide-view ${slide.type==='terms'?'wide-text':''}" aria-label="Slide: ${safe(slide.title)}">${mainText}${visual}</section>`;
}
function qArr(mi){return state.answers[String(mi)]||[]}
function allAnswered(mi){return qArr(mi).filter(x=>Number.isInteger(x)).length===C.modules[mi].quiz.questions.length}
function quizView(s){
 const quiz=C.modules[s.mi].quiz;
 const answers=qArr(s.mi); const qi=state.quizIndex[String(s.mi)]||0;
 const complete=allAnswered(s.mi);
 if(complete && qi>=quiz.questions.length){
  const count=quiz.questions.reduce((sum,q,i)=>sum+(answers[i]===q.correct?1:0),0);
  return `<section class="quiz-view"><div class="quiz-head"><span class="kicker">Pausa interativa · bloco ${s.mi+1}</span><span class="counter">${count} / ${quiz.questions.length} respostas corretas</span></div><div class="quiz-card"><h2>Boa revisão.</h2><p class="quiz-description">Você completou as três perguntas. O importante é compreender as justificativas, não apenas acertar.</p>${button('Rever perguntas','quizreset-'+s.mi,'nav-button')}${tags(['Você pode avançar para o próximo bloco'])}</div></section>`;
 }
 const q=quiz.questions[Math.min(qi,quiz.questions.length-1)]; const selected=answers[qi]; const answered=Number.isInteger(selected);
 return `<section class="quiz-view"><div class="quiz-head"><span class="kicker">${safe(quiz.title)}</span><span class="counter">${qi+1} / ${quiz.questions.length}</span></div><h2>Pense, discuta, responda.</h2><p class="quiz-description">${safe(quiz.description)}</p><div class="quiz-card"><div class="quiz-step-label">PERGUNTA ${qi+1}</div><h3>${safe(q.q)}</h3><div class="answer-list">${q.answers.map((a,i)=>`<button type="button" class="answer-option ${answered?(i===q.correct?'correct':i===selected?'incorrect':''):''}" data-act="answer-${s.mi}-${qi}-${i}" ${answered?'disabled':''}><span class="letter">${'ABC'[i]}</span><span>${safe(a)}</span></button>`).join('')}</div>${answered?`<div class="quiz-feedback"><strong>${selected===q.correct?'Correto.':'Revise este conceito.'}</strong>${safe(q.explain)}</div><div class="quiz-actions">${button(qi===quiz.questions.length-1?'Ver resultado da pausa →':'Próxima pergunta →','quiznext','nav-button next')}</div>`:''}</div></section>`;
}
function analysisView(){
 return `<section class="analysis-screen"><header class="analysis-heading"><div><span class="kicker">O CASO VOLTA À SUA MESA</span><h2>Qual é seu parecer inicial?</h2></div><p>Compare as variantes herdadas e considere que os candidatos são irmãos.</p></header>
 <div class="data-panel analysis-data"><div class="panel-title"><h3>Perfis genéticos</h3><small>Releia os dez loci</small></div>${geneticTable()}</div>
 <div class="analysis-choices">${[['and','Apontar André sem ressalvas.'],['bru','Apontar Bruno sem ressalvas.'],['care','Solicitar avaliação complementar.']].map(([v,t])=>`<button type="button" class="${state.choice===v?'selected':''}" data-act="choice-${v}" aria-pressed="${state.choice===v}">${safe(t)}</button>`).join('')}</div></section>`;
}
function resolutionView(s){
 const r=s.r;
 if(r===0)return `<section class="resolution-view resolution-hero"><div><span class="kicker">A REUNIÃO DOS PERITOS</span><h2>Vamos reconstruir a evidência.</h2><p>O biomédico responsável reúne a equipe para separar observações genéticas, possíveis explicações e conclusões admissíveis.</p>${tags(['Alelo obrigatório','Incompatibilidade','Hipóteses'])}</div>${img('scene-resolution.webp','Biomédico e equipe de laboratório discutindo dados de eletroferogramas e um caso de parentesco')}</section>`;
 if(r===1)return `<section class="resolution-view resolution-step"><div><span class="kicker">REVISÃO 01</span><h2>Primeiro, o alelo paterno.</h2><p>Em cada um destes exemplos, verificamos qual alelo de Lucas não pode ser explicado por Helena. Depois observamos se cada candidato apresenta esse alelo.</p><p>André apresenta <strong>uma discordância aparente</strong> (STR-05). Bruno apresenta <strong>três</strong> (STR-02, STR-07 e STR-09).</p><div class="resolution-banner">Compatibilidade em um locus não identifica, sozinha, um pai. Incompatibilidade merece interpretação técnica.</div></div><div class="resolution-evidence"><h3>Comparação dos 10 loci</h3>${geneticTable('analysis')}<p class="case-note">✓ = alelo observado · ✕ = alelo não observado · sem cálculo de IP.</p></div></section>`;
 if(r===2)return `<section class="resolution-view resolution-step"><div><span class="kicker">REVISÃO 02</span><h2>Uma discordância pode ser mutação.</h2><p>Em STR-05, o filho tem alelo 15 não explicado pela mãe. André apresenta 14 e 16. Uma mudança de uma unidade repetida durante a transmissão é uma hipótese biológica a investigar.</p><p>Isso <strong>não prova</strong> que ocorreu mutação, nem permite desconsiderar a discrepância automaticamente.</p>${tags(['Repetição','Controle de qualidade','Análise validada'])}</div><div class="resolution-evidence">${img('diagram-str.webp','Dois alelos de STR com números diferentes de repetições')}<div class="resolution-banner">STR-05 · Helena 9/12 · Lucas 12/15 · André 14/16 · Bruno 15/17.</div></div></section>`;
 if(r===3)return `<section class="resolution-view resolution-step"><div><span class="kicker">REVISÃO 03</span><h2>Os suspeitos são irmãos. Isso importa.</h2><p>Uma análise que compara André com um homem aleatório não responde à mesma pergunta que uma análise que compara André com seu irmão Bruno.</p><p>É necessário um modelo de parentesco apropriado, painel completo validado, frequências alélicas, taxas de mutação e revisão técnica antes de estimar a força da evidência.</p><div class="resolution-banner">Sem esses dados, não é correto inventar um ICP nem uma probabilidade de paternidade.</div></div><div class="resolution-evidence">${img('diagram-special.webp','Situações especiais de parentesco no exame de paternidade')}${tags(['Irmãos biológicos','Hipóteses alternativas','Razão de verossimilhanças'])}</div></section>`;
 return `<section class="resolution-view final-summary"><div class="kicker">ESCLARECIMENTOS AO JUÍZO</div><h2>O que podemos afirmar?</h2><p>Nos dez loci apresentados, André tem uma discordância aparente e Bruno tem três. A discrepância em STR-05 e o parentesco entre os candidatos impedem uma atribuição definitiva sem investigação adicional.</p><div class="report-snippet"><strong>Manifestação pericial didática:</strong> “Observa-se uma discordância aparente entre André e Lucas e três discordâncias entre Bruno e Lucas nos loci apresentados. Recomenda-se análise integral validada dos perfis, verificação de qualidade, consideração formal da possibilidade de mutação e aplicação de um modelo estatístico que inclua o parentesco entre candidatos. Não é tecnicamente justificável atribuir paternidade definitiva apenas com a tabela didática disponível.”</div><div class="resolution-banner">Questões de identidade e registros documentais exigem provas independentes do exame genético.</div></section>`;
}
function linkQr(url,label,asset){
 const src=asset?`/assets/${safe(asset)}`:window.DNA_QR.svgData(url);
 return `<a class="resource-qr" href="${safe(url)}" target="_blank" rel="noopener noreferrer"><img src="${safe(src)}" alt="QR code para ${safe(label)}" loading="eager"><strong>${safe(label)}</strong><small>Abrir recurso ↗</small></a>`;
}
function resourcesView(){
 // QR da apresentação usa a origem real do site para funcionar em qualquer domínio Vercel.
 const liveURL=window.location.origin==='null'?new URL('/',document.baseURI).href:window.location.origin+window.location.pathname;
 const pdfURL='https://drive.google.com/file/d/1z2DVXo7Dg4RmpLjQ3Vw9sKNfuSCTwqjQ/view';
 return `<section class="resource-screen"><div class="resource-heading"><span class="kicker">CONTINUE ESTUDANDO</span><h2>Materiais para consulta</h2><p>Escaneie um QR code ou selecione um recurso.</p></div><div class="resource-qr-grid">${linkQr(C.book.url,'Livro na Amazon','livro-qr.png')}${linkQr(pdfURL,'Apostila completa','apostila-qr.png')}${linkQr(liveURL,'Esta apresentação')}</div><div class="resource-actions">${button('Recomeçar apresentação','reset','nav-button next')}${button('Consultar fontes','refs','nav-button')}</div></section>`;
}
function modal(){
 const page=Math.max(0,Math.min(state.refPage||0,Math.ceil(C.references.length/3)-1));
 return `<div class="modal-backdrop" data-act="closemodal"><aside role="dialog" aria-modal="true" aria-labelledby="ref-heading" class="modal"><div class="modal-top"><span class="kicker">BASES ACADÊMICAS</span>${button('✕','closemodal','modal-x','aria-label="Fechar fontes"')}</div><h2 id="ref-heading">Referências científicas</h2><ul>${referenceList(page)}</ul><div class="modal-navigation"><button class="nav-button" type="button" data-act="refprev" ${page===0?'disabled':''}>← Anteriores</button><span>${page+1} / ${Math.ceil(C.references.length/3)}</span><button class="nav-button" type="button" data-act="refnext" ${page>=Math.ceil(C.references.length/3)-1?'disabled':''}>Próximas →</button></div>${button('Fechar','closemodal','nav-button')}</aside></div>`;
}
function render(){
 if(state.pos<0){$.innerHTML=homepage()+(state.modal?modal():''); fitFrame(); watchFit(); document.title='Curso de Exame de DNA | UNIPÊ';return}
 const s=flow[state.pos];
 const main=s.kind==='intro'?caseIntroView():s.kind==='case'?caseView():s.kind==='slide'?slideView(s):s.kind==='quiz'?quizView(s):s.kind==='analysis'?analysisView():s.kind==='resources'?resourcesView():resolutionView(s);
 $.innerHTML=`<div class="course-stage" id="app">${stageHead(s)}<main class="stage-center">${main}</main>${stageFoot(s)}</div>`+(state.modal?modal():'');
 document.title=`${s.kind==='slide'?C.modules[s.mi].slides[s.si].title:s.kind==='quiz'?C.modules[s.mi].quiz.title:s.kind==='resolution'?'Resolução pericial':C.case.name} | Curso de Exame de DNA`;
 fitFrame();watchFit();
}
function fitFrame(){
 document.body.classList.toggle('is-presenting',state.pos>=0);
 const box=document.querySelector(state.pos<0?'.opening-main':'.stage-center');
 const content=box?.firstElementChild;
 if(!box||!content)return;
 content.style.transform='';content.style.flexShrink='0';content.style.transformOrigin='center center';
 const w=content.offsetWidth,h=content.offsetHeight;
 const scale=Math.min(1,box.clientWidth/w,box.clientHeight/h);
 content.style.transform=`scale(${Math.max(0.15,scale).toFixed(4)})`;
 box.dataset.fitScale=scale.toFixed(3);
}
const fitObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>requestAnimationFrame(fitFrame)):null;
function watchFit(){
 fitObserver?.disconnect();
 const box=document.querySelector(state.pos<0?'.opening-main':'.stage-center');
 if(box){fitObserver?.observe(box);if(box.firstElementChild)fitObserver?.observe(box.firstElementChild)}
 $.querySelectorAll('img').forEach(el=>{if(!el.complete)el.addEventListener('load',()=>requestAnimationFrame(fitFrame),{once:true})});
 requestAnimationFrame(fitFrame);
}
window.addEventListener('resize',()=>requestAnimationFrame(fitFrame));
function go(pos){state.pos=Math.max(-1,Math.min(flow.length-1,pos));state.furthest=Math.max(state.furthest,state.pos);persist();render();window.scrollTo({top:0,behavior:'instant'})}
function next(){if(state.pos<0)return go(0);const s=flow[state.pos];if(s.kind==='quiz'&&!allAnswered(s.mi))return;if(s.kind==='analysis'&&!state.choice)return;if(state.pos===flow.length-1)return go(-1);return go(state.pos+1)}
function answer(mi,qi,ai){if(state.pos<0||flow[state.pos].kind!=='quiz'||flow[state.pos].mi!==mi)return;const arr=qArr(mi).slice();if(Number.isInteger(arr[qi]))return;arr[qi]=ai;state.answers[String(mi)]=arr;persist();render()}
function quiznext(){const s=flow[state.pos];if(s.kind!=='quiz')return;const idx=state.quizIndex[String(s.mi)]||0;if(!Number.isInteger(qArr(s.mi)[idx]))return;state.quizIndex[String(s.mi)]=idx+1;persist();render()}
$.addEventListener('click',evt=>{
 const b=evt.target.closest('[data-act]');if(!b)return;
 const act=b.dataset.act;
 if(act==='home'){state.modal=false;return go(-1)}
 if(act==='begin'){if(state.pos<0)return go(state.furthest>0?state.pos===-1?0:state.pos:0);return}
 if(act==='next')return next();
 if(act==='back')return go(state.pos-1);
 if(act==='refs'){state.refPage=0;state.modal=true;return render()}
 if(act==='closemodal'){if(b.classList.contains('modal-backdrop')&&evt.target!==b)return;state.modal=false;return render()}
 if(act==='refnext'){state.refPage=Math.min(Math.ceil(C.references.length/3)-1,state.refPage+1);return render()}
 if(act==='refprev'){state.refPage=Math.max(0,state.refPage-1);return render()}
 if(act==='fullscreen'){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();return}
 if(act==='quiznext')return quiznext();
 if(act==='reset'){state=createState();persist();return go(-1)}
 if(act==='print'){window.print();return}
 if(act.startsWith('answer-')){const [,mi,qi,ai]=act.split('-').map((s,i)=>i===0?s:Number(s));return answer(mi,qi,ai)}
 if(act.startsWith('quizreset-')){const mi=Number(act.split('-')[1]);state.answers[String(mi)]=[];state.quizIndex[String(mi)]=0;persist();return render()}
 if(act.startsWith('choice-')){state.choice=act.slice(7);persist();return render()}
});
window.addEventListener('keydown',e=>{
 if(state.modal&&e.key==='Escape'){state.modal=false;render();return}
 if(state.pos<0||state.modal||e.target?.tagName==='BUTTON'||e.target?.tagName==='INPUT')return;
 if(e.key==='ArrowRight'){e.preventDefault();next()}
 if(e.key==='ArrowLeft'){e.preventDefault();go(Math.max(0,state.pos-1))}
});
render();
window.DNA_COURSE_TEST={flow,parse,allAnswered,table:C.case.rows};
})();
