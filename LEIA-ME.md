# LUDI — Catálogo online

Site catálogo (não é loja de compra direta): o cliente vê os produtos, monta uma seleção
num carrinho e envia o pedido pelo WhatsApp. O fechamento da venda continua manual.

## Arquivos desta pasta

- `index.html` — o site inteiro (HTML + CSS + JS, sem build).
- `produtos.csv` — lista de produtos. Editável em Excel/Google Sheets sem tocar no código.
- `manifest.json` — configuração de PWA (nome, ícones, cor do tema).
- `icon-192.png` / `icon-512.png` — ícones do app, gerados a partir da logo oficial
  (`assets/logo-ludi-source.png`) centralizada num fundo claro.
- `assets/logo-ludi.svg` — logo oficial da LUDI em vetor, usada no topo e no rodapé do site.
- `assets/logo-ludi-source.png` — arquivo de origem (alta resolução) usado para gerar os
  ícones do app; troque por uma versão nova aqui e rode de novo o script de geração se a
  logo mudar.
- `CNAME` — domínio configurado para o GitHub Pages (`ludib2b.com.br`).
- `backend/google-apps-script.gs` — código que recebe os cadastros (nome/telefone/carrinho)
  numa Planilha Google. Veja "Cadastro de clientes e carrinho em aberto" abaixo.

## Como testar localmente

Como o navegador bloqueia `fetch()` de arquivos abertos direto do disco (`file://`), há
duas formas de testar:

1. **Simples:** dar duplo clique no `index.html`. O site funciona normalmente, mas usa os
   dados de exemplo embutidos no próprio código (`DEFAULT_ROWS`) em vez do `produtos.csv`.
2. **Completo (recomendado):** rodar um servidor local nesta pasta e abrir
   `http://localhost:8080`. Isso testa o carregamento real do `produtos.csv`. Com Python
   instalado:
   ```bash
   python -m http.server 8080
   ```
   Sem Python, qualquer servidor estático simples serve (extensão "Live Server" do VS Code,
   por exemplo).

## Como atualizar os produtos

Tem dois jeitos de editar `produtos.csv` — os dois funcionam ao mesmo tempo, célula por
célula, então dá pra misturar (por exemplo, um export do Olist com `destaque`/`exemplo`
acrescentados na mão).

### Jeito 1 — colunas simples de sempre

1. Abra `produtos.csv` (Excel, Google Sheets ou editor de texto).
2. Cada linha é um produto. Colunas:
   - `sku` — identificador único (não repetir; trocar o sku "vira" um produto novo pro carrinho).
   - `nome`, `categoria` (`brinquedos`, `decoracao` ou `chaveiros` — só esses três valores),
     `preco` (formato `21.00`), `tamanho`, `peso_kg`, `material`, `descricao`.
   - `imagem_url` — deixe vazio para usar um ícone ilustrativo, ou cole o link de uma foto
     real do produto (ex.: hospedada no GitHub, Imgur, etc.) para usar foto de verdade.
   - `destaque` — `sim` no primeiro produto de cada categoria que deve aparecer nos cards de
     destaque da Home.
   - `ativo` — `não` esconde o produto do site sem apagar a linha (ex.: item esgotado).
   - `exemplo` — `sim` mostra a etiqueta "Exemplo" no card (usar em produtos que ainda são
     placeholder, como os de Decoração e Chaveiros hoje).

### Jeito 2 — export direto do Olist/Tiny (recomendado quando o catálogo crescer)

**Esse é o formato padrão usado hoje** — `produtos.csv` já está exatamente assim, com o seu
catálogo real. O site lê o arquivo que o Olist exporta sem precisar renomear nenhuma
coluna (não precisa nem manter a coluna "Descrição complementar" — decidimos que descrição
não é importante pra esse catálogo, só a medida):

| Coluna no export do Olist | Vira no site |
|---|---|
| `Código (SKU)` | identificador do produto (SKU). Se vier em branco (aconteceu com 2 produtos no seu arquivo), o site gera um identificador a partir do nome — funciona, mas o ideal é preencher o SKU no Olist quando puder. |
| `Descrição` | nome do produto — o Olist exporta em CAIXA ALTA, o site converte pra Title Case sozinho na hora de mostrar (ex.: "DRAGÃO VOADOR" vira "Dragão Voador") |
| `Categoria` | categoria — o site olha só a primeira parte antes do "`>`" (se houver) e entende se começa com "Brinquedos", "Decoração" ou "Chaveiros", não importa maiúscula/minúscula; qualquer outra coisa (ex.: "Vestuário") fica de fora do site |
| `Preço` | preço |
| `Situação` | `Ativo` mostra no site, qualquer outro valor (`Inativo`, etc.) esconde |
| `Altura embalagem` | tamanho exibido no card (`Alt. X cm`) — deixe `0` ou em branco se não tiver essa medida ainda, o site simplesmente não mostra essa linha |
| `URL imagem 1` a `URL imagem 6` | fotos do produto. Com só a 1 preenchida, mostra uma foto fixa; com 2 ou mais, o card ganha um carrossel — o cliente arrasta ou clica nas setinhas pra ver as outras fotos sem sair do catálogo. Sem nenhuma, usa um ícone ilustrativo conforme palavras do nome ("dragão", "tubarão", "cubo" etc.). |

As outras colunas do export (Unidade, e qualquer outra que apareça em exports futuros) o
site ignora — pode deixar todas elas no arquivo sem problema.

Só duas coisas não existem no Olist e são exclusivas do site — acrescente à mão se quiser
usar (colunas extras no fim da planilha, o Olist ignora elas se você reimportar o arquivo
lá — hoje só usamos em 3 produtos, um por categoria):
- `destaque` — `sim` marca o produto que aparece em destaque na Home da categoria dele.
- `exemplo` — `sim` mostra a etiqueta "Exemplo" no card (produto de mentira/placeholder).

Sem essas duas colunas o site também funciona normal (só não destaca nenhum produto em
especial, e não mostra a etiqueta "Exemplo" em nenhum). Ou seja: **dá pra pegar um export
do Olist puro, sem editar nada, salvar como `produtos.csv` e já funciona.**
3. Salve como CSV (UTF-8) substituindo o arquivo `produtos.csv` desta pasta.
4. Suba a mudança pro GitHub (veja abaixo) — o site atualiza sozinho.

## Como publicar (GitHub Pages + domínio próprio)

1. Crie um repositório no GitHub (pode ser público) e suba todos os arquivos desta pasta.
2. No repositório, vá em **Settings → Pages** e configure para publicar a partir da branch
   principal (`main`), pasta raiz (`/`).
3. Em **Settings → Pages → Custom domain**, coloque `ludib2b.com.br` (o arquivo `CNAME`
   já está pronto com esse valor).
4. No Registro.br, aponte o DNS do domínio `ludib2b.com.br` para o GitHub Pages:
   - Registros **A** apontando para os IPs do GitHub Pages:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Ou um registro **CNAME** em `www` apontando para `SEU-USUARIO.github.io`, se preferir
     usar `www.ludib2b.com.br`.
5. Aguarde a propagação do DNS (pode levar algumas horas) e marque "Enforce HTTPS" nas
   configurações do GitHub Pages assim que o domínio for reconhecido.

## Cadastro de clientes e carrinho em aberto

O carrinho tem um cadastro rápido opcional (nome + WhatsApp). Isso serve pra você conseguir
ver quem montou uma seleção e ainda não fechou pedido, e mandar uma mensagem manual tipo
"vi que você tinha um carrinho aberto, quer finalizar?".

**Importante sobre onde isso fica guardado:** o GitHub Pages só hospeda os arquivos do site
— ele não roda nenhum código no servidor e não tem banco de dados, então não tem como
*receber e gravar* o que o cliente digita. Por isso os cadastros vão direto do navegador do
cliente para uma **Planilha Google** sua (o GitHub Pages nem participa dessa parte). É um
complemento ao site, não uma troca: o site continua 100% no GitHub Pages, a planilha é só o
"arquivo" onde os cadastros ficam anotados.

### Passo a passo (uma vez só)

1. Crie uma Planilha Google nova (sheets.new).
2. Nela, vá em **Extensões → Apps Script**.
3. Apague o código de exemplo e cole o conteúdo do arquivo `backend/google-apps-script.gs`
   desta pasta.
4. Clique em **Implantar → Nova implantação**.
5. Em "Tipo", escolha **App da Web**.
6. Em "Executar como", deixe **Eu (seu e-mail)**.
7. Em "Quem pode acessar", escolha **Qualquer pessoa**.
8. Clique em **Implantar**, autorize o acesso (é a sua própria planilha) e copie a **URL do
   app da Web** que aparece (termina em `/exec`).
9. Abra `index.html` num editor de texto, procure por `SHEET_WEBHOOK_URL = ""` (perto do
   início do `<script>`) e cole a URL entre as aspas.
10. Suba a mudança pro GitHub. Pronto — a partir de agora, cada vez que alguém clicar em
    "Salvar meus dados" ou "Enviar pedido pelo WhatsApp" no carrinho, uma linha nova aparece
    na aba "Cadastros" da sua planilha, com nome, telefone, itens do carrinho, total, status
    (carrinho salvo ou pedido enviado) e um link pronto pra abrir o WhatsApp da pessoa.

Se um dia você mudar o código do Apps Script, é só salvar e fazer **Implantar → Gerenciar
implantações → editar (ícone de lápis) → Nova versão → Implantar** — a mesma URL continua
funcionando, não precisa trocar no `index.html` de novo.

## Carrossel de "Destaques" (mais adicionados ao carrinho)

Na Home, cada categoria tem um cartão de destaque que fica passando entre os produtos
daquela categoria — sempre um cartão por categoria, pra Decoração e Chaveiros não sumirem
mesmo se Brinquedos vender muito mais. A ordem de rotação é pela quantidade de vezes que
cada produto foi clicado em "+ Selecionar" (somando todo mundo que usa o site, não só o seu
navegador); sem clique nenhum ainda, a ordem é sorteada.

Isso usa a **mesma Planilha Google** do cadastro de clientes — toda vez que alguém adiciona
um produto ao carrinho, o site registra numa aba nova chamada "Populares" (só o produto, sem
nenhum dado pessoal). Como acabei de atualizar o `backend/google-apps-script.gs` pra isso
funcionar, **é preciso reimplantar o Apps Script** uma vez (mesmo passo do parágrafo acima:
cole o conteúdo atualizado do arquivo, Implantar → Gerenciar implantações → editar → Nova
versão → Implantar). Sem esse passo, o carrossel continua funcionando normal, só que sempre
na ordem sorteada, sem aprender com os cliques.

## Pendências conhecidas

- Fotos reais dos produtos (hoje o site usa ícones ilustrativos via `imagem_url` vazio,
  escolhidos por palavra-chave no nome do produto).
- 2 produtos vieram sem SKU no export ("Sereia" e "Skull Bonnie") — o site funciona normal
  (gera um identificador a partir do nome), mas o ideal é preencher o código deles no Olist
  quando puder, pra ficar igual aos outros.
- Reparei um typo no nome de um produto no export ("HOMEM HARANHA MINECRAFT" — faltou o
  "A" de "Aranha"). Mantive exatamente como veio do Olist; se quiser, corrija lá e o
  próximo export já vem certo.
- Integração com Tiny/Olist ERP para criar pedido de venda automaticamente — precisa de um
  backend pequeno (Cloudflare Worker ou Vercel Function) para não expor o token da API no
  front-end.
- Service worker para funcionamento 100% offline (hoje o PWA só permite "Adicionar à tela
  inicial", sem cache).
