'use strict';
(() => {
const C = window.DNA_COURSE;
if (!C) throw Error('Não foi possível carregar o conteúdo didático.');
const $ = document.getElementById('app');
const KEY = 'dnaforense-curso-v1';
const flow = [{kind:'case'}];
C.modules.forEach((mod, mi) => {
  mod.slides.forEach((slide,si) => flow.push({kind:'slide',mi,si}));
  flow.push({kind:'quiz',mi});
});
flow.push({kind:'analysis'});
for(let r=0;r<5;r++) flow.push({kind:'resolution',r});
const qStart = C.modules.map((_,i) => flow.findIndex(s=>s.kind==='quiz' && s.mi===i));
const createState=()=>({pos:-1,furthest:0,answers:{},quizIndex:{},choice:null,modal:false});
let state=createState();
try{const old=JSON.parse(localStorage.getItem(KEY)||'null');if(old&&Number.isInteger(old.pos)&&old.pos>=-1&&old.pos<flow.length){state={...createState(),...old,modal:false}}}catch{}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({...state,modal:false}))}catch{}}
function safe(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function img(file,alt,cls=''){return `<img class="${cls}" src="/assets/${safe(file)}" alt="${safe(alt)}" loading="lazy">`}
function tags(arr=[]){return `<div class="taglist">${arr.map(t=>`<span>${safe(t)}</span>`).join('')}</div>`}
function button(label,act,cls='primary-button',extra=''){return `<button type="button" class="${cls}" data-act="${act}" ${extra}>${label}</button>`}
function referenceList(){return C.references.map(r=>`<li><a target="_blank" rel="noopener noreferrer" href="${safe(r.url)}">${safe(r.text)}</a></li>`).join('')}
function brand(){return `<a href="/" class="brand" aria-label="Voltar à abertura">${img('unipe.png','Centro Universitário de João Pessoa - UNIPÊ')}<span><strong>DNA Forense</strong><small>Estudo interativo de paternidade</small></span></a>`}
function homepage(){
  return `<div class="site">
  <header class="topbar">${brand()}<nav aria-label="Links úteis" class="toplinks"><a href="/portal-original.html" target="_blank" rel="noopener">Portal anterior</a><a href="${safe(C.book.url)}" target="_blank" rel="noopener">Livro na Amazon</a>${button('Fontes','refs','outline-button')}</nav></header>
  <section class="home-hero" id="app">
    <div class="hero-panel"><div class="eyebrow">Genética forense · experiência investigativa</div><h1>O menino sem identidade</h1><p>Um caso. Dois irmãos. Dez marcadores genéticos. Você consegue ajudar a esclarecer o que o DNA revela?</p><div class="hero-actions">${button('Abrir o caso <span aria-hidden="true">→</span>','begin')}<a class="secondary-button" href="/portal-original.html" target="_blank" rel="noopener">Portal de genética forense ↗</a></div><small style="color:#aac1d4;margin-top:28px">Curso introdutório · 2 horas · 3 pausas interativas</small></div>
    <div class="hero-photo">${img('hero-case.webp','Helena, Lucas e dois candidatos em cenário fictício; rosto do menor oculto')}<div class="photo-caption"><small>CASO FICTÍCIO · DNA</small><strong>Você é parte da equipe pericial.</strong></div></div>
  </section>
  <section class="content-width" aria-label="Estrutura da formação"><div class="section-heading"><div><span class="kicker">Roteiro de aprendizagem</span><h2>Uma investigação em três atos.</h2></div></div>
  <div class="path-grid">${C.modules.map((m,i)=>`<article class="path-card"><span class="number">0${i+1}</span><h3>${safe(m.title)}</h3><p>${['Descubra os fundamentos de herança e marcadores STR.','Acompanhe as etapas reais do trabalho laboratorial.','Aprenda a raciocinar sobre compatibilidade e limitações.'][i]}</p><div class="duration">${safe(m.duration)}</div></article>`).join('')}</div>
  <div class="extras"><article class="book-card">${img('livro-qr.png','QR code para o livro Introdução à Genética Molecular Forense na Amazon','qr')}<div><h3>Livro de apoio</h3><p>${safe(C.book.title)}. Aponte a câmera para o QR code ou acesse o link.</p><a class="text-link" href="${safe(C.book.url)}" target="_blank" rel="noopener noreferrer">Ver livro na Amazon ↗</a></div></article><article class="reference-card"><h3>Material anterior preservado</h3><p>O portal com simuladores de PCR, casos interativos e preparação pericial continua disponível.</p><a class="text-link" href="/portal-original.html" target="_blank" rel="noopener">Abrir portal original ↗</a></article></div>
  </section><footer class="site-footer">Prof. Rodrigo Niskier Ferreira Barbosa · Material educacional · Situação e personagens fictícios</footer></div>`;
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
  return `<div class="table-wrap"><table class="genetic-table" aria-label="Resultados de perfis STR do caso fictício"><thead><tr>${c.columns.map(h=>`<th scope="col">${safe(h)}</th>`).join('')}</tr></thead><tbody>${c.rows.map(row=>`<tr>${row.map((v,i)=>`<td>${safe(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function parse(v){return String(v).split('/').map(x=>x.trim()).filter(Boolean)}
function stageHead(s){
 const mi=s.mi??(s.kind==='case'?-1:2);
 const label=s.kind==='case'?'Desafio de abertura':s.kind==='analysis'?'Seu parecer inicial':s.kind==='resolution'?'Resolução comentada':`Bloco ${mi+1} · ${C.modules[mi].title}`;
 const visibleStep=Math.max(0,state.pos+1);
 const p=Math.round(visibleStep/flow.length*100);
 return `<header class="stage-top"><div class="cluster">${button('← Início','home','ghost')}<strong>${safe(label)}</strong></div><div class="cluster"><span class="tiny">${visibleStep} de ${flow.length}</span>${button('Fontes','refs','ghost')}${button('⛶','fullscreen','ghost','aria-label="Alternar tela cheia"')}</div></header><div class="progress-track"><span style="width:${p}%"></span></div>`;
}
function stageFoot(s){
 let allowed=true;
 if(s.kind==='quiz')allowed=allAnswered(s.mi);
 if(s.kind==='analysis')allowed=state.choice!==null;
 const last=state.pos===flow.length-1;
 const nextlabel=last?'Concluir':'Continuar →';
 return `<footer class="stage-bottom"><div>${button('← Voltar','back','nav-button',state.pos<=0?'disabled':'')}</div><div class="step-dots" aria-hidden="true">${Array.from({length:flow.length},(_,i)=>`<span class="step-dot ${i===state.pos?'active':''}"></span>`).join('')}</div>${button(nextlabel,'next','nav-button next',allowed?'':'disabled')}</footer>`;
}
function caseView(){return `<div class="case-layout"><aside class="case-sidebar">${img('hero-case.webp','Envolvidos do caso fictício com rosto da criança borrado')}<span class="kicker">Dossiê de investigação</span><h2>${safe(C.case.name)}</h2>${C.case.paragraphs.map(t=>`<p>${safe(t)}</p>`).join('')}<div class="case-instruction">${safe(C.case.instruction)}</div></aside><section class="data-panel"><div class="panel-title"><h3>Relatório genético preliminar</h3><small>10 marcadores · personagens fictícios</small></div>${geneticTable()}<div class="case-footer">Examine os dados. A interpretação será retomada após os três blocos de estudo.</div></section></div>`}
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
function analysisView(){return `<div class="case-layout"><aside class="case-sidebar">${img('scene-court.webp','Audiência fictícia na Justiça com especialista em genética forense')}<span class="kicker">O caso volta à sua mesa</span><h2>Qual é seu parecer inicial?</h2><p>Você estudou as bases da herança genética, a rotina laboratorial e os limites da interpretação.</p><p>Reexamine os perfis e registre uma avaliação antes de ver a revisão da equipe pericial.</p><div class="case-instruction">A decisão deve considerar as variantes herdadas, o parentesco dos candidatos e os limites da evidência.</div></aside><section class="data-panel"><div class="panel-title"><h3>Perfis genéticos apresentados</h3><small>Dados fictícios</small></div>${geneticTable()}<h3 style="margin:22px 0 12px">Que encaminhamento você sugeriria ao juiz?</h3><div class="analysis-choices">${[['and','A conclusão deve apontar André, sem ressalvas.'],['bru','A conclusão deve apontar Bruno, sem ressalvas.'],['care','É necessária interpretação técnica complementar antes de um laudo definitivo.']].map(([v,t])=>`<button type="button" class="${state.choice===v?'selected':''}" data-act="choice-${v}" aria-pressed="${state.choice===v}">${safe(t)}</button>`).join('')}</div><div class="case-note">Sua escolha não altera o caso. A revisão técnica virá a seguir.</div></section></div>`}
function resolutionView(s){
 const r=s.r;
 if(r===0)return `<section class="resolution-view resolution-hero"><div><span class="kicker">A REUNIÃO DOS PERITOS</span><h2>Vamos reconstruir a evidência.</h2><p>O biomédico responsável reúne a equipe para separar observações genéticas, possíveis explicações e conclusões admissíveis.</p><div class="warning-tag">Cena ilustrativa produzida para este caso fictício</div>${tags(['Alelo obrigatório','Incompatibilidade','Hipóteses'])}</div>${img('scene-resolution.webp','Biomédico e equipe de laboratório discutindo dados de eletroferogramas e um caso de parentesco')}</section>`;
 if(r===1)return `<section class="resolution-view resolution-step"><div><span class="kicker">REVISÃO 01</span><h2>Primeiro, o alelo paterno.</h2><p>Em cada um destes exemplos, verificamos qual alelo de Lucas não pode ser explicado por Helena. Depois observamos se cada candidato apresenta esse alelo.</p><p>André apresenta <strong>uma discordância aparente</strong> (STR-05). Bruno apresenta <strong>três</strong> (STR-02, STR-07 e STR-09).</p><div class="resolution-banner">Compatibilidade em um locus não identifica, sozinha, um pai. Incompatibilidade merece interpretação técnica.</div></div><div class="resolution-evidence"><h3>Comparação dos 10 loci</h3>${geneticTable('analysis')}<p class="case-note">✓ = alelo observado · ✕ = alelo não observado · apenas exemplos didáticos, sem cálculo de IP.</p></div></section>`;
 if(r===2)return `<section class="resolution-view resolution-step"><div><span class="kicker">REVISÃO 02</span><h2>Uma discordância pode ser mutação.</h2><p>Em STR-05, o filho tem alelo 15 não explicado pela mãe. André apresenta 14 e 16. Uma mudança de uma unidade repetida durante a transmissão é uma hipótese biológica a investigar.</p><p>Isso <strong>não prova</strong> que ocorreu mutação, nem permite desconsiderar a discrepância automaticamente.</p>${tags(['Repetição','Controle de qualidade','Análise validada'])}</div><div class="resolution-evidence">${img('diagram-str.webp','Dois alelos de STR com números diferentes de repetições')}<div class="resolution-banner">STR-05 · Helena 9/12 · Lucas 12/15 · André 14/16 · Bruno 15/17.</div></div></section>`;
 if(r===3)return `<section class="resolution-view resolution-step"><div><span class="kicker">REVISÃO 03</span><h2>Os suspeitos são irmãos. Isso importa.</h2><p>Uma análise que compara André com um homem aleatório não responde à mesma pergunta que uma análise que compara André com seu irmão Bruno.</p><p>É necessário um modelo de parentesco apropriado, painel completo validado, frequências alélicas, taxas de mutação e revisão técnica antes de estimar a força da evidência.</p><div class="resolution-banner">Sem esses dados, não é correto inventar um ICP nem uma probabilidade de paternidade.</div></div><div class="resolution-evidence">${img('diagram-special.webp','Situações especiais de parentesco no exame de paternidade')}${tags(['Irmãos biológicos','Hipóteses alternativas','Razão de verossimilhanças'])}</div></section>`;
 return `<section class="resolution-view final-summary"><div class="kicker">ESCLARECIMENTOS AO JUÍZO</div><h2>O que podemos afirmar?</h2><p>O conjunto dos dez loci apresentados é mais coerente com André do que com Bruno sob a leitura simples de herança. Porém, a discordância de STR-05 e o parentesco entre os dois candidatos requerem avaliação especializada.</p><div class="report-snippet"><strong>Manifestação pericial didática:</strong> “Observa-se uma discordância aparente entre André e Lucas e três discordâncias entre Bruno e Lucas nos loci apresentados. Recomenda-se análise integral validada dos perfis, verificação de qualidade, consideração formal da possibilidade de mutação e aplicação de um modelo estatístico que inclua o parentesco entre candidatos. Não é tecnicamente justificável atribuir paternidade definitiva apenas com a tabela didática disponível.”</div><div class="resolution-banner">A investigação sobre falsificação documental e identidade também exige provas independentes; um exame de parentesco não reconstitui sozinho os fatos jurídicos.</div><div class="final-reference">${C.references.map(r=>`<a target="_blank" rel="noopener noreferrer" href="${safe(r.url)}">${safe(r.text)} ↗</a>`).join('')}</div><div class="hero-actions">${button('Reiniciar experiência','reset')}${button('Imprimir resumo','print','nav-button')}</div><small style="color:#778ba0;display:block;margin-top:25px">Caso, nomes, perfis STR e cenas são fictícios. Material educacional, não laudo de caso real.</small></section>`;
}
function modal(){return `<div class="modal-backdrop" data-act="closemodal"><aside role="dialog" aria-modal="true" aria-labelledby="ref-heading" class="modal" onclick="event.stopPropagation()"><span class="kicker">Bases acadêmicas</span><h2 id="ref-heading">Referências científicas</h2><p>O conteúdo apresenta os conceitos introdutórios e as cautelas interpretativas presentes nas fontes abaixo. Os genótipos e o caso foram criados para estudo.</p><ul>${referenceList()}</ul>${button('Fechar','closemodal','nav-button')}</aside></div>`}
function render(){
 if(state.pos<0){$.innerHTML=homepage()+(state.modal?modal():''); document.title='O menino sem identidade | DNA Forense';return}
 const s=flow[state.pos];
 const main=s.kind==='case'?caseView():s.kind==='slide'?slideView(s):s.kind==='quiz'?quizView(s):s.kind==='analysis'?analysisView():resolutionView(s);
 $.innerHTML=`<div class="course-stage" id="app">${stageHead(s)}<main class="stage-center">${main}</main>${stageFoot(s)}</div>`+(state.modal?modal():'');
 document.title=`${s.kind==='slide'?C.modules[s.mi].slides[s.si].title:s.kind==='quiz'?C.modules[s.mi].quiz.title:s.kind==='resolution'?'Resolução pericial':C.case.name} | DNA Forense`;
}
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
 if(act==='refs'){state.modal=true;return render()}
 if(act==='closemodal'){state.modal=false;return render()}
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
