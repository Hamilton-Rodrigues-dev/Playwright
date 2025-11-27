# 🎭 Manual de Automação com Playwright

Este guia serve como referência rápida para configurar, criar e executar testes automatizados neste projeto. Focado em boas práticas e simplicidade.

---

## 🚀 1. Configuração Inicial

Se você acabou de clonar este projeto, execute os comandos abaixo no terminal para preparar o ambiente:

# 1. Instalar as dependências do projeto (Node.js)

npm install

# 2. Baixar os binários dos navegadores (Chromium, Firefox, WebKit)

npx playwright install

---

## 🏃 2. Como Rodar os Testes

Comandos essenciais para o dia a dia.

| Comando                                 | Descrição                                                                                     |
| :-------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `npx playwright test`                   | **Modo Headless:** Roda todos os testes em segundo plano (sem abrir janela). É o mais rápido. |
| `npx playwright test --headed`          | **Modo Visual:** Abre o navegador para você acompanhar a execução.                            |
| `npx playwright test --ui`              | **UI Mode (Recomendado):** Abre um painel interativo com histórico, logs e linha do tempo.    |
| `npx playwright test --debug`           | **Inspector:** Roda passo-a-passo, pausando em cada linha.                                    |
| `npx playwright test --project=firefox` | Roda apenas em um navegador específico (chromium, firefox, webkit).                           |
| `npx playwright test -g "login"`        | Roda apenas testes que tenham a palavra "login" no título.                                    |
| `npx playwright show-report`            | Abre o relatório HTML do último teste rodado.                                                 |

---

## 📝 3. Estrutura de Código (TypeScript)

Todo arquivo de teste deve ficar na pasta tests/ e terminar com .spec.ts.

Template Básico:

```typescript
import { test, expect } from "@playwright/test";

test("nome do cenário", async ({ page }) => {
  // 1. Configuração (ex: aumentar timeout para este teste específico)
  test.setTimeout(60000);

  // 2. Ação: Navegar
  await page.goto("[https://www.google.com](https://www.google.com)", {
    waitUntil: "domcontentloaded",
  });

  // 3. Interação
  await page.getByLabel("Pesquisar").fill("Playwright");
  await page.keyboard.press("Enter");

  // 4. Validação (Assertion)
  await expect(page).toHaveTitle(/Playwright/);
});
```

---

## 🎯 4. Seletores (Locators) - Boas Práticas

O Playwright prioriza seletores que refletem como o usuário enxerga a página. Evite usar CSS complexo se possível.

Exemplo de uso correto:

```typescript
// ✅ Bom (Semântico)
await page.getByRole("button", { name: "Salvar" }).click();

// ❌ Ruim (Quebra se o design mudar)
await page.locator("div > span > .btn-primary").click();
```

---

## 🛠️ 5. Cheat Sheet de Métodos (API)

Ações de Interação

```typescript
await page.click("seletor"); // Clicar
await page.dblclick("seletor"); // Clique duplo
await page.fill("input", "texto"); // Limpa e preenche
await page.type("input", "texto"); // Digita tecla por tecla (mais lento)
await page.check("checkbox"); // Marcar opção
await page.selectOption("select", "valor"); // Selecionar em dropdown
await page.hover("elemento"); // Passar o mouse em cima
await page.screenshot({ path: "img.png" }); // Tirar print
```

Validações (expect)
Se a condição não for atendida, o teste falha imediatamente.

```typescript
await expect(page).toHaveTitle("Título"); // Verificar título da página
await expect(page.locator("seletor")).toBeVisible(); // Verificar visibilidade
await expect(page.locator("seletor")).toHaveText("Texto"); // Verificar texto
await expect(page.locator("seletor")).toHaveCount(3); // Verificar quantidade de elementos
await expect(locator).toBeVisible(); // Está visível na tela?
await expect(locator).toBeHidden(); // Está escondido?
await expect(locator).toBeEnabled(); // O botão está habilitado?
await expect(locator).toHaveText("Ok"); // O texto é EXATAMENTE esse?
await expect(locator).toContainText("k"); // O texto CONTÉM isso?
await expect(page).toHaveURL(/dashboard/); // A URL mudou?
```

---

## 🐛 6. Solução de Erros Comuns

🔴 Erro: Strict mode violation
Causa: O seu seletor encontrou mais de um elemento na tela.

Solução: Seja mais específico ou pegue o primeiro/último.

```typescript
// Solução 1: Melhorar o seletor (Ex: procurar apenas dentro do menu)
await page.locator("nav >> text=Contato").click();

// Solução 2: Forçar o primeiro (use com cuidado)
await page.locator("button").first().click();
```

🔴 Erro: Test timeout of 30000ms exceeded
Causa: O teste demorou mais de 30s. Comum em sites pesados (Globo, UOL) ou internet lenta.

Solução 1 (Estratégia de Carga): Não espere imagens e ads carregarem, espere apenas o HTML.

```typescript
await page.goto("https://site-pesado.com", { waitUntil: "domcontentloaded" });
```

Solução 2 (Aumentar Tempo):

```typescript
test.setTimeout(60000); // 60 segundos
```

---

## ⚡ 7. Ferramentas de Produtividade

Codegen (Gerador de Código)
Não perca tempo procurando seletores manualmente. Use o gravador:

Bash

```
npx playwright codegen wikipedia.org
```

Uma janela abrirá. Tudo o que você clicar gera código TypeScript pronto para copiar.

# Debug com page.pause()

Insira essa linha no meio do seu código para congelar a execução e inspecionar a tela.

```typescript
await page.pause();
```

## 📚 8. Principais comandos

```typescript
// PREENCHER
await page.fill("input#email", "teste@email.com");
await page.locator("input#email").fill("teste@email.com");

// CLICAR
await page.click("button#submit");
await page.locator("button#submit").click();

// PEGAR TEXTO
const texto = await page.locator("h1").textContent();
const textoInterno = await page.locator("p").innerText();

// PEGAR ATRIBUTO
const href = await page.locator("a").getAttribute("href");
const value = await page.inputValue("input#name");

// VERIFICAR ESTADO
const isVisible = await page.isVisible("div#modal");
const isEnabled = await page.isEnabled("button#submit");
const isChecked = await page.isChecked("input#checkbox");

// CONTAR ELEMENTOS
const quantidade = await page.locator("li").count();

// ESPERAR
await page.waitForSelector("div.resultado");
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2000); // não recomendado, use apenas quando necessário
```

## 📄 9. Dicas importantes

```typescript
// ✅ BOM - Esperar elemento aparecer
await page.waitForSelector("button");
await page.click("button");

// ❌ EVITAR - Timeout fixo
await page.waitForTimeout(3000);
await page.click("button");

// ✅ BOM - Usar expect para validações
await expect(page.locator("h1")).toHaveText("Título esperado");

// ✅ BOM - Pegar primeiro elemento
const primeiro = await page.locator("li").first().textContent();

// ✅ BOM - Pegar último elemento
const ultimo = await page.locator("li").last().textContent();

// ✅ BOM - Pegar por index
const terceiro = await page.locator("li").nth(2).textContent();
```

## 10. Guia rápido

```typescript
import { test, expect, type Page } from "@playwright/test";

/**
 * 📘 GUIA DE REFERÊNCIA RÁPIDA DO PLAYWRIGHT
 * * Este arquivo reúne exemplos práticos de todos os principais comandos.
 * Você pode descomentar os blocos para testar ou usar como cola (Cheat Sheet).
 */

test.describe("1. Navegação e Configuração Básica", () => {
  test("Como navegar e lidar com sites lentos", async ({ page }) => {
    // Aumenta o tempo limite só para este teste (útil para sites pesados)
    test.setTimeout(60000);

    // Navegação simples
    await page.goto("https://www.google.com");

    // Navegação otimizada (Não espera imagens/ads, só o HTML)
    // Use isso se o site fica carregando eternamente
    await page.goto("https://www.globo.com", { waitUntil: "domcontentloaded" });

    // Mudar tamanho da tela (Viewport) no meio do teste
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe("2. Interação com Elementos (Ações)", () => {
  test("Preencher formulários completos", async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc");

    // 🅰️ PREENCHER INPUT (TEXTO)
    // O .fill() foca no elemento, limpa o texto existente e digita o novo.
    await page.getByPlaceholder("What needs to be done?").fill("Comprar Café");
    await page.keyboard.press("Enter");

    // 🅱️ CLICAR (CLICK)
    // Usando getByRole (Melhor prática: busca por semântica)
    await page.getByRole("checkbox", { name: "Toggle Todo" }).first().click();

    // ℹ️ Outros tipos de cliques
    // await page.getByText('Botão').dblclick(); // Clique duplo
    // await page.getByText('Botão').click({ button: 'right' }); // Botão direito

    // 🅲 CHECKBOX E RADIO
    // await page.getByLabel('Aceito os termos').check();
    // await page.getByLabel('Aceito os termos').uncheck();

    // 🅳 SELECT / DROPDOWN
    // await page.locator('select#cores').selectOption('azul'); // Pelo valor (value)
    // await page.locator('select#cores').selectOption({ label: 'Azul Escuro' }); // Pelo texto visível
  });
});

test.describe("3. Locators (Como encontrar elementos)", () => {
  test("Estratégias de Seleção (Do melhor para o pior)", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");

    // 🥇 1. getByRole (Acessibilidade - Ouro)
    // Use para botões, links, headings, inputs.
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();

    // 🥈 2. getByPlaceholder (Campos de texto)
    await page.getByPlaceholder("Username").fill("standard_user");

    // 🥉 3. getByText (Texto visível)
    // Cuidado: pode pegar textos soltos no meio de parágrafos.
    await expect(page.getByText("Swag Labs")).toBeVisible();

    // ⚠️ 4. Locator com CSS (Último recurso)
    // Use quando não tiver ID, Label ou Texto claro.
    await page.locator(".login_logo").isVisible();

    // ⚠️ RESOLVENDO ERRO "STRICT MODE VIOLATION"
    // Se o seu seletor encontrar 10 elementos, o Playwright trava.
    // Use .first(), .last() ou .nth(0) para resolver.
    const primeiroInput = page.locator("input").first();
    await expect(primeiroInput).toBeVisible();
  });

  test("Listas e Filtros Avançados", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    // ... imagine que fizemos login ...

    // Filtrar um elemento que contenha um texto específico dentro dele
    // Ex: Encontrar o "div" do produto que tem o texto "Backpack"
    const produtoMochila = page
      .locator(".inventory_item")
      .filter({ hasText: "Backpack" });

    // Clicar no botão SÓ DENTRO desse produto específico
    // await produtoMochila.getByRole('button', { name: 'Add to cart' }).click();
  });
});

test.describe("4. Asserções (Validações)", () => {
  test("Garantindo que o teste passou", async ({ page }) => {
    await page.goto("https://www.google.com");

    const logo = page.locator('img[alt="Google"]');

    // ✅ Verifica se está visível
    await expect(logo).toBeVisible();

    // ✅ Verifica se NÃO está visível (ex: mensagem de erro sumiu)
    await expect(page.locator(".erro-sistema")).not.toBeVisible();

    // ✅ Verifica Texto (Exato)
    // await expect(page.locator('h1')).toHaveText('Bem vindo ao Sistema');

    // ✅ Verifica Texto (Parcial - Contém)
    await expect(page).toHaveTitle(/Google/); // Regex: contém "Google"

    // ✅ Verifica URL
    await expect(page).toHaveURL(/google.com/);

    // ✅ Verifica se campo está habilitado/desabilitado
    // await expect(page.locator('#botao-salvar')).toBeEnabled();
    // await expect(page.locator('#botao-salvar')).toBeDisabled();
  });
});

test.describe("5. Extração de Dados e Debug", () => {
  test("Pegando dados da tela e Debugando", async ({ page }) => {
    await page.goto("https://www.google.com");

    // 📸 SCREENSHOT
    // Tira foto da página inteira
    await page.screenshot({
      path: "screenshots/evidencia-teste.png",
      fullPage: true,
    });

    // Tira foto só de um elemento específico
    await page
      .locator('img[alt="Google"]')
      .screenshot({ path: "screenshots/logo.png" });

    // 🕵️ EXTRAIR TEXTO
    // textContent: Pega tudo, inclusive texto escondido via CSS.
    // innerText: Pega só o que o usuário vê (respeita CSS display:none).
    const textoBotao = await page
      .getByRole("button", { name: "Pesquisa Google" })
      .innerText();
    console.log("Texto do botão:", textoBotao);

    // 🕵️ EXTRAIR ATRIBUTO (Link, ID, Class, SRC)
    // Exemplo: Pegar o link de uma imagem ou href de um botão
    const linkImagem = await page
      .locator('img[alt="Google"]')
      .getAttribute("src");
    console.log("Fonte da imagem:", linkImagem);

    // ⏸️ PAUSA MÁGICA (DEBUG)
    // O teste congela aqui e abre o Inspector para você mexer.
    // await page.pause();
  });
});
```
