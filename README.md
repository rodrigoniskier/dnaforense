# DNA Forense — O menino sem identidade

Plataforma didática interativa, com slides curtos, atividades de fixação e resolução fundamentada de um caso fictício de investigação de paternidade. Desenvolvida para introdução à genética e biologia molecular, sem exigir cálculos dos participantes.

## Organização

- `index.html`: nova experiência interativa de entrada, caso forense, três blocos didáticos, três quizzes e resolução.
- `data.js`: textos e perguntas, genótipos didáticos e links das referências.
- `app.js`: navegação, quizzes, persistência de respostas no navegador e análise dos loci.
- `styles.css`: editoração visual responsiva, azul/branco/amarelo, ênfase em imagens.
- `assets/`: imagens ilustrativas otimizadas e QR code estático do livro.
- `portal-original.html`: cópia preservada da antiga página de entrada.
- `casos.html`, `pcr.html`, `perito.html`: experiências pré-existentes preservadas.

## Roteiro sugerido

1. Caso inicial: relato + perfis STR fictícios, **sem antecipação do diagnóstico**.
2. Bloco 1: fundamentos da herança (20 min) + três questões (15 min).
3. Bloco 2: fluxo laboratorial (20 min) + três questões (15 min).
4. Bloco 3: interpretação (20 min) + três questões (15 min).
5. Revisão do caso e esclarecimentos ao juízo (15 min).

A duração é uma referência para o facilitador; a navegação não força cronômetro. As respostas são salvas apenas no `localStorage` do navegador.

## Revisão técnico-científica

Os genótipos dos 10 marcadores do caso são **inventados** para ensino. Não constituem perfil validado nem representam um laudo pericial. Pela herança autossômica usual, a comparação do alelo paterno obrigatório evidencia uma discordância aparente com André (STR-05) e três com Bruno (STR-02, STR-07, STR-09). A discrepância isolada pode ter explicações alternativas, inclusive mutação, mas não pode ser simplesmente descartada. A relação de fraternidade entre os candidatos afeta o modelo estatístico e a força da evidência. Portanto, a experiência **não inventa Índice de Paternidade, índice combinado ou probabilidade percentual**; recomenda validação, painel integral, frequências, hipótese alternativa adequada e apreciação de mutação e outras limitações antes de conclusão.

Fontes acadêmicas e institucionais utilizadas: NIST; recomendações ISFG da Comissão de Testes de Paternidade (2002, 2007); Butler et al. (2008). Links de referência estão no modal "Fontes" do aplicativo.

O link do livro foi recuperado da página original deste repositório (ASIN `B0G2DZ2X3K`); o QR code codifica esse mesmo endereço. A paginação anterior não foi excluída.

## Desenvolvimento e testes

O projeto é composto de HTML/CSS/JS estáticos e pode ser servido por qualquer servidor web, incluindo Vercel. Sem compilação nem segredos.

```bash
python -m http.server 8080
python tests/test_content.py
python tests/test_browser.py
```

Os testes de interface utilizam Playwright com Chromium instalado, incluindo validação das três pausas interativas, navegação desktop/mobile, tabela de genótipos e tela de resolução. O código de interface está escrito para funcionar sem biblioteca de frontend; as imagens são locais.

## Responsabilidade

Todos os personagens, imagens de cenas forenses, documentos e resultados genéticos do caso são ilustrações didáticas, não registros de pessoas ou procedimentos reais. A divulgação do caso não substitui aconselhamento, interpretação pericial ou orientação jurídica individualizada.
