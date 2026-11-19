# Curso de Exame de DNA — plataforma interativa

Apresentação didática em tela cheia sobre fundamentos da herança genética, testes de paternidade por STR, procedimentos laboratoriais, interpretação da evidência e discussão de uma investigação de parentesco. A navegação é orientada por slides, sem rolagem vertical, com pausas para quizzes e revisão final dos dados.

## Problema, público e resultado

**Problema.** Interpretar um teste de paternidade por STR exige entender herança genética, procedimento laboratorial e leitura da evidência, o que costuma ser difícil só com texto.

**Para quem.** Estudantes do curso de Exame de DNA, com identidade visual da UNIPÊ.

**O que entrega.** Apresentação interativa em tela cheia com 19 slides, nove questões, um conjunto de dados para resolver o caso de parentesco e QR codes para o livro e a apostila.

**Tecnologias.** JavaScript, HTML, CSS.

**Qualidade e evidências.** Navegação orientada por slides, sem rolagem vertical, com pausas para quizzes e revisão final dos dados.

## Estrutura

- `index.html` — documento HTML e metadados.
- `app.js` — navegação, atividades, resolução do desafio, diálogo de referências e ajuste automático à altura/largura da tela.
- `data.js` — 19 slides e conteúdo científico, nove questões e conjunto de dados do exercício.
- `styles.css` — identidade visual UNIPÊ em azul, branco e amarelo e layout responsivo de apresentação.
- `qr-local.js` — geração de QR code da apresentação no próprio navegador, incluindo o domínio real usado no acesso.
- `assets/livro-qr.png`, `assets/apostila-qr.png` — QR codes do livro e da apostila.
- `assets/` — imagens didáticas e cenas de apoio da apresentação.
- `portal-original.html`, `casos.html`, `pcr.html`, `perito.html` — versões e simuladores anteriores mantidos.

## Percurso

1. Apresentação do desafio e dados STR em duas telas separadas.
2. Fundamentos genéticos e três perguntas de fixação.
3. Etapas laboratoriais e três perguntas de fixação.
4. Interpretação e três perguntas de fixação.
5. Retorno aos genótipos, comparação dos loci e discussão pericial fundamentada.
6. Tela final com três QR codes: **livro, apostila e apresentação**.

O exame ilustrado contém uma discordância com André no STR-05 e três com Bruno nos STR-02, 07 e 09; não contém frequências alélicas ou parâmetros para um cálculo válido de probabilidades ou Índices de Paternidade. As explicações destacam essas limitações sem antecipar a solução no desafio inicial. O texto é apoiado por referências de NIST, ISFG e Butler et al., acessíveis no diálogo **Fontes**.

## QR codes

- O QR do livro aponta ao ASIN `B0G2DZ2X3K`, já presente no portal anterior.
- O QR da apostila aponta ao PDF disponível no Google Drive. Se o Drive exigir autenticação, o proprietário deve ajustar as permissões de compartilhamento conforme o público pretendido.
- O QR da apresentação é renderizado localmente como SVG por `qr-local.js` e utiliza `window.location.origin + pathname`, sem endereço Vercel fixo nem dependência de API pública de QR code.

O gerador de QR code incorpora o projeto [QRCode for JavaScript](https://github.com/kazuhikoarase/qrcode-generator), © Kazuhiko Arase, licenciado sob MIT, através de código distribuído no `qrcode-terminal` (também MIT). O aviso de licença está preservado em `qr-local.js`.

## Desenvolvimento e testes

O aplicativo é inteiramente estático. Não necessita de compilação, banco de dados, chaves de API ou variáveis de ambiente. Compatível com a integração GitHub → Vercel.

```bash
python -m http.server 8080
python tests/test_content.py
python tests/test_browser.py
```

Os testes de interface cobrem abertura e fechamento da janela de fontes, percurso completo dos slides, três quizzes, painel de genótipos, slides de resolução e QR codes, em tamanhos de tela entre **320×568** e **1920×1080**. O botão de tela cheia é opcional; a experiência não depende dele.
