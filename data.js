'use strict';
/* Conteúdo didático de genética forense. */
window.DNA_COURSE = Object.freeze({
  title: 'Curso de Exame de DNA',
  book: {
    title: 'Introdução à Genética Molecular Forense',
    url: 'https://www.amazon.com.br/Introdu%C3%A7%C3%A3o-%C3%A0-Gen%C3%A9tica-Molecular-Forense-ebook/dp/B0G2DZ2X3K'
  },
  case: {
    name: 'O menino sem identidade',
    paragraphs: [
      'Em uma investigação policial sobre falsificação de registros de nascimento, foi localizado um menino de nove anos, identificado nos documentos como Lucas. A polícia suspeita que ele seja uma criança desaparecida de uma maternidade nove anos antes.',
      'Uma mulher chamada Helena afirma ser sua mãe biológica. A investigação genética inicial confirmou uma forte evidência de maternidade, e Helena revelou que, na época da concepção, havia se relacionado com dois homens: André e Bruno, que são irmãos biológicos.',
      'Ambos concordaram em fornecer amostras de DNA para a investigação.',
      'O laboratório analisou um painel de marcadores STR autossômicos. A identificação das amostras foi confirmada e os controles laboratoriais foram satisfatórios.'
    ],
    instruction: 'Você foi convidado a revisar o caso como integrante da equipe de genética forense e prestar esclarecimentos ao juiz do caso.',
    columns: ['Marcador', 'Helena (mãe)', 'Lucas (filho)', 'André', 'Bruno'],
    rows: [
      ['STR-01','10 / 12','12 / 14','11 / 14','14 / 15'],
      ['STR-02','7 / 9','7 / 11','10 / 11','8 / 10'],
      ['STR-03','15 / 16','14 / 16','14 / 18','14 / 19'],
      ['STR-04','8 / 11','8 / 13','12 / 13','9 / 13'],
      ['STR-05','9 / 12','12 / 15','14 / 16','15 / 17'],
      ['STR-06','13 / 15','11 / 13','11 / 16','11 / 12'],
      ['STR-07','6 / 8','8 / 10','9 / 10','7 / 9'],
      ['STR-08','17 / 19','17 / 21','20 / 21','21 / 22'],
      ['STR-09','9 / 11','9 / 13','10 / 13','10 / 12'],
      ['STR-10','12 / 14','14 / 16','16 / 17','16 / 18']
    ]
  },
  modules: [
    {
      eyebrow:'01 · FUNDAMENTOS', title:'O DNA que herdamos', duration:'20 min de exposição + 15 min de prática',
      slides:[
        {kicker:'O PONTO DE PARTIDA',title:'O DNA tem uma história familiar.',lead:'O DNA nuclear é organizado em cromossomos. Para cada autossomo, recebemos uma cópia de cada genitor.',image:'diagram-dna.webp',imageAlt:'Da célula ao DNA e ao locus: esquema da organização do material genético',chips:['DNA','23 pares de cromossomos','Herança']},
        {kicker:'TRANSMISSÃO',title:'Uma contribuição de cada genitor.',lead:'Em um locus STR autossômico, o filho normalmente herda um alelo da mãe e um do pai biológico.',image:'diagram-alleles.webp',imageAlt:'Dois alelos por pessoa e transmissão materna e paterna de marcadores STR',chips:['Mãe → filho','Pai → filho','Locus autossômico']},
        {kicker:'MARCADOR GENÉTICO',title:'STR: pequenos trechos repetidos.',lead:'Pessoas podem apresentar números diferentes de repetições de uma sequência curta de DNA no mesmo locus.',image:'diagram-str.webp',imageAlt:'Duas moléculas de DNA demonstrando alelos STR com diferentes números de repetição',chips:['STR','Repetições','Alelos']},
        {kicker:'TRÊS CONCEITOS',title:'Locus. Alelo. Genótipo.',lead:'Locus é a posição analisada; alelo é sua variante; genótipo é o par de alelos registrado naquele locus.',type:'terms',terms:[['Locus','posição no DNA'],['Alelo','variante observada'],['Genótipo','par de alelos']],chips:['Exemplo: 12 / 14']},
        {kicker:'REGRA ESSENCIAL',title:'Compatível não significa confirmado.',lead:'Compartilhar um alelo é comum. Precisamos observar vários marcadores e avaliar a força da evidência sob hipóteses bem definidas.',image:'diagram-trio.webp',imageAlt:'Quadro ilustrativo de genótipos de mãe, filho e suposto pai em três loci',chips:['Vários loci','Hipóteses','Evidência']}
      ],
      quiz:{title:'Pausa 1 · Herança genética',description:'Três perguntas para aplicar os conceitos antes do próximo bloco.',questions:[
        {q:'Num STR autossômico, uma criança normalmente apresenta:',answers:['Um alelo de cada genitor','Somente os alelos maternos','Um único alelo em todos os loci'],correct:0,explain:'Um alelo provém do gameta materno e o outro do paterno no modelo autossômico usual.'},
        {q:'O que significa um genótipo 12/14?',answers:['12% de DNA materno e 14% paterno','Dois alelos observados no mesmo locus','Dois exames de DNA diferentes'],correct:1,explain:'Os números identificam variantes do locus; não são percentuais.'},
        {q:'Uma compatibilidade em um único STR comprova paternidade?',answers:['Sim, se o alelo for raro','Sim, se a mãe participou','Não; um único locus é insuficiente'],correct:2,explain:'A interpretação depende do conjunto de marcadores, da qualidade e da análise estatística.'}
      ]}
    },
    {
      eyebrow:'02 · PROCEDIMENTOS',title:'Da amostra ao perfil',duration:'20 min de exposição + 15 min de prática',
      slides:[
        {kicker:'CONFIGURAÇÃO DO EXAME',title:'Trio e duo não são iguais.',lead:'Comparar mãe, filho e suposto pai ajuda a reconhecer o alelo paterno obrigatório. Sem a mãe, o modelo exige mais cuidado.',image:'diagram-trio.webp',imageAlt:'Comparação de genótipos STR da mãe, filho e suposto pai',chips:['Trio: 3 pessoas','Duo: 2 pessoas']},
        {kicker:'ETAPA 1',title:'Coletar é também identificar.',lead:'O swab bucal fornece células para o teste. Identificação, consentimento e rastreabilidade protegem a conclusão.',image:'scene-swab.webp',imageAlt:'Profissional usando swab bucal em uma pessoa adulta',chips:['Swab bucal','Identificação','Cadeia de custódia']},
        {kicker:'ETAPA 2',title:'Extrair DNA. Verificar qualidade.',lead:'O laboratório obtém DNA da amostra e avalia sua quantidade e integridade antes da amplificação.',image:'scene-extraction.webp',imageAlt:'Profissional de laboratório pipetando amostras na etapa de extração de DNA',chips:['Extração','Quantificação','Controle de qualidade']},
        {kicker:'ETAPA 3',title:'A PCR amplia regiões selecionadas.',lead:'A reação em cadeia da polimerase produz muitas cópias dos loci que serão comparados — não de todo o genoma.',image:'diagram-pcr.webp',imageAlt:'Esquema de amplificação por PCR e separação de fragmentos',chips:['Primers','Ciclos','STR multiplex']},
        {kicker:'ETAPA 3 · NA BANCADA',title:'O profissional prepara a amplificação.',lead:'A mistura de reação, os controles e as amostras são organizados antes de o termociclador executar os ciclos da PCR.',image:'scene-pcr.webp',imageAlt:'Biomédica preparando a placa de PCR e colocando-a em termociclador',chips:['Reagentes','Controles','Termociclador']},
        {kicker:'ETAPA 4',title:'A eletroforese transforma DNA em sinais.',lead:'Fragmentos amplificados são separados e detectados. Os picos do eletroferograma ajudam a identificar os alelos.',image:'diagram-peak.webp',imageAlt:'Eletroferograma simplificado mostrando dois picos correspondentes a um heterozigoto',chips:['Eletroforese capilar','Eletroferograma','Genotipagem']},
        {kicker:'ETAPA 4 · NO LABORATÓRIO',title:'O analista verifica cada sinal.',lead:'O equipamento registra os fragmentos. A interpretação precisa examinar posição, intensidade, controles e possíveis artefatos.',image:'scene-electrophoresis.webp',imageAlt:'Biomédica operando analisador genético capilar e verificando sinais em um computador',chips:['Leitura crítica','Picos','Revisão']},
        {kicker:'ETAPA 5',title:'Um laudo depende de todo o percurso.',lead:'Troca de amostras, contaminação ou leitura inadequada podem comprometer uma conclusão mesmo com bons equipamentos.',image:'diagram-workflow.webp',imageAlt:'Fluxograma do teste de paternidade, da coleta ao laudo',chips:['Validação','Revisão técnica','Laudo']}
      ],
      quiz:{title:'Pausa 2 · Laboratório',description:'Confirme o que acontece com uma amostra entre a coleta e o laudo.',questions:[
        {q:'A PCR de um teste STR é usada principalmente para:',answers:['Produzir cópias dos loci escolhidos','Determinar diretamente a probabilidade de paternidade','Fotografar o núcleo das células'],correct:0,explain:'A PCR amplifica regiões específicas para permitir sua detecção.'},
        {q:'Um pico mais alto no eletroferograma significa:',answers:['Maior probabilidade de paternidade','Sinal fluorescente mais intenso, não probabilidade','Paternidade automaticamente confirmada'],correct:1,explain:'Altura do pico e razão de verossimilhança são medidas diferentes.'},
        {q:'Se houver dúvida sobre a identidade de uma amostra, o correto é:',answers:['Ignorar, se o DNA amplificou','Escolher o perfil genético mais compatível','Interromper e resolver a não conformidade'],correct:2,explain:'O DNA é confiável somente quando a atribuição das amostras também é confiável.'}
      ]}
    },
    {
      eyebrow:'03 · INTERPRETAÇÃO',title:'O que os resultados significam',duration:'20 min de exposição + 15 min de prática',
      slides:[
        {kicker:'PRIMEIRO PASSO',title:'Descubra o alelo paterno obrigatório.',lead:'No trio, o alelo do filho não explicado pela mãe deve ser avaliado na contribuição paterna, no modelo simples.',image:'diagram-alleles.webp',imageAlt:'Esquema de herança de alelos em um trio',chips:['Mãe','Filho','Suposto pai']},
        {kicker:'TRÊS CLASSIFICAÇÕES',title:'Nem todo resultado permite concluir.',lead:'Não exclusão, exclusão e inconclusivo dependem de critérios técnicos e da qualidade dos dados.',image:'diagram-outcomes.webp',imageAlt:'Três possíveis interpretações de resultados STR: não exclusão, exclusão e inconclusivo',chips:['Não exclusão','Exclusão','Inconclusivo']},
        {kicker:'FORÇA DA EVIDÊNCIA',title:'Índice de Paternidade não é porcentagem.',lead:'O IP compara o quanto os dados favorecem a paternidade diante de uma hipótese alternativa; o ICP reúne as informações dos loci.',type:'metrics',chips:['IP: por locus','ICP: conjunto','Hipóteses explícitas']},
        {kicker:'ESTATÍSTICA COM CONTEXTO',title:'99,99% não é a taxa de acerto do laboratório.',lead:'A probabilidade de paternidade divulgada em laudos depende do índice combinado e da probabilidade anterior assumida.',type:'stat',chips:['Modelo bayesiano','Pressupostos','Não confundir com erro']},
        {kicker:'SITUAÇÕES ESPECIAIS',title:'Família e mutação podem complicar o caso.',lead:'Um STR pode sofrer mutação durante a transmissão. Candidatos aparentados exigem hipóteses alternativas apropriadas.',image:'diagram-special.webp',imageAlt:'Casos especiais em testes genéticos, incluindo parentes próximos e amostras problemáticas',chips:['Mutação','Irmãos','Mais marcadores']},
        {kicker:'ANTES DA CONCLUSÃO',title:'A perícia precisa comunicar seus limites.',lead:'O resultado deve explicar amostras, método, hipóteses, força da evidência, incompatibilidades e restrições do exame.',image:'scene-director.webp',imageAlt:'Diretora de laboratório revisando documentos de uma investigação genética',chips:['Método','Ressalvas','Revisão']}
      ],
      quiz:{title:'Pausa 3 · Interpretação',description:'Antes de voltar ao processo judicial, revise três decisões importantes.',questions:[
        {q:'Uma incompatibilidade isolada em um STR deve ser:',answers:['Investigada à luz de mutação e falhas possíveis','Sempre ignorada','Sempre tratada como exclusão definitiva'],correct:0,explain:'Uma discrepância isolada requer avaliação técnica, inclusive da possibilidade de mutação.'},
        {q:'Se os dois candidatos são irmãos, a comparação estatística:',answers:['É idêntica à comparação com homem aleatório','Deve considerar o parentesco entre os candidatos','Torna-se desnecessária'],correct:1,explain:'Parentes compartilham mais variantes; o modelo alternativo importa.'},
        {q:'Um ICP elevado permite afirmar que:',answers:['O laboratório erra zero vezes','A questão jurídica está completamente resolvida','Os dados favorecem a hipótese em um modelo definido'],correct:2,explain:'A força da evidência depende das hipóteses, frequências e qualidade analítica.'}
      ]}
    }
  ],
  references:[
    {text:'NIST · Forensic Genetics',url:'https://www.nist.gov/programs-projects/forensic-genetics'},
    {text:'Butler et al. · Short tandem repeat analysis (2008)',url:'https://pubmed.ncbi.nlm.nih.gov/18428356/'},
    {text:'ISFG · Genetic investigations in paternity cases (2002)',url:'https://pubmed.ncbi.nlm.nih.gov/12372685/'},
    {text:'ISFG · Biostatistics in paternity testing (2007)',url:'https://pubmed.ncbi.nlm.nih.gov/19083766/'},
    {text:'NIST · DNA mixture interpretation review (2024)',url:'https://www.nist.gov/publications/dna-mixture-interpretation-nist-scientific-foundation-review'}
  ]
});
