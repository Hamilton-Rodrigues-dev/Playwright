import { test, expect, type Page } from '@playwright/test';

/**
 * 📘 GUIA DE REFERÊNCIA RÁPIDA DO PLAYWRIGHT
 * * Este arquivo reúne exemplos práticos de todos os principais comandos.
 * Você pode descomentar os blocos para testar ou usar como cola (Cheat Sheet).
 */




test.describe('1. Navegação e Configuração Básica', () => {

  test('Como navegar e lidar com sites lentos', async ({ page }) => {
    // Aumenta o tempo limite só para este teste (útil para sites pesados)
    test.setTimeout(60000); 

    // Navegação simples
    await page.goto('https://www.google.com');

    // Navegação otimizada (Não espera imagens/ads, só o HTML)
    // Use isso se o site fica carregando eternamente
    await page.goto('https://www.globo.com', { waitUntil: 'domcontentloaded' });

    // Mudar tamanho da tela (Viewport) no meio do teste
    await page.setViewportSize({ width: 1280, height: 720 });
  });

});

test.describe('2. Interação com Elementos (Ações)', () => {

  test('Preencher formulários completos', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc'); 

    // 🅰️ PREENCHER INPUT (TEXTO)
    // O .fill() foca no elemento, limpa o texto existente e digita o novo.
    await page.getByPlaceholder('What needs to be done?').fill('Comprar Café');
    await page.keyboard.press('Enter');

    // 🅱️ CLICAR (CLICK)
    // Usando getByRole (Melhor prática: busca por semântica)
    await page.getByRole('checkbox', { name: 'Toggle Todo' }).first().click();
    
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

test.describe('3. Locators (Como encontrar elementos)', () => {

  test('Estratégias de Seleção (Do melhor para o pior)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // 🥇 1. getByRole (Acessibilidade - Ouro)
    // Use para botões, links, headings, inputs.
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 🥈 2. getByPlaceholder (Campos de texto)
    await page.getByPlaceholder('Username').fill('standard_user');

    // 🥉 3. getByText (Texto visível)
    // Cuidado: pode pegar textos soltos no meio de parágrafos.
    await expect(page.getByText('Swag Labs')).toBeVisible();

    // ⚠️ 4. Locator com CSS (Último recurso)
    // Use quando não tiver ID, Label ou Texto claro.
    await page.locator('.login_logo').isVisible();
    
    // ⚠️ RESOLVENDO ERRO "STRICT MODE VIOLATION"
    // Se o seu seletor encontrar 10 elementos, o Playwright trava.
    // Use .first(), .last() ou .nth(0) para resolver.
    const primeiroInput = page.locator('input').first(); 
    await expect(primeiroInput).toBeVisible();
  });

  test('Listas e Filtros Avançados', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    // ... imagine que fizemos login ...

    // Filtrar um elemento que contenha um texto específico dentro dele
    // Ex: Encontrar o "div" do produto que tem o texto "Backpack"
    const produtoMochila = page.locator('.inventory_item').filter({ hasText: 'Backpack' });
    
    // Clicar no botão SÓ DENTRO desse produto específico
    // await produtoMochila.getByRole('button', { name: 'Add to cart' }).click();
  });

});

test.describe('4. Asserções (Validações)', () => {

  test('Garantindo que o teste passou', async ({ page }) => {
    await page.goto('https://www.google.com');

    const logo = page.locator('img[alt="Google"]');

    // ✅ Verifica se está visível
    await expect(logo).toBeVisible();

    // ✅ Verifica se NÃO está visível (ex: mensagem de erro sumiu)
    await expect(page.locator('.erro-sistema')).not.toBeVisible();

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

test.describe('5. Extração de Dados e Debug', () => {

  test('Pegando dados da tela e Debugando', async ({ page }) => {
    await page.goto('https://www.google.com');

    // 📸 SCREENSHOT
    // Tira foto da página inteira
    await page.screenshot({ path: 'screenshots/evidencia-teste.png', fullPage: true });
    
    // Tira foto só de um elemento específico
    await page.locator('img[alt="Google"]').screenshot({ path: 'screenshots/logo.png' });

    // 🕵️ EXTRAIR TEXTO
    // textContent: Pega tudo, inclusive texto escondido via CSS.
    // innerText: Pega só o que o usuário vê (respeita CSS display:none).
    const textoBotao = await page.getByRole('button', { name: 'Pesquisa Google' }).innerText();
    console.log('Texto do botão:', textoBotao);

    // 🕵️ EXTRAIR ATRIBUTO (Link, ID, Class, SRC)
    // Exemplo: Pegar o link de uma imagem ou href de um botão
    const linkImagem = await page.locator('img[alt="Google"]').getAttribute('src');
    console.log('Fonte da imagem:', linkImagem);

    // ⏸️ PAUSA MÁGICA (DEBUG)
    // O teste congela aqui e abre o Inspector para você mexer.
    // await page.pause(); 
  });

});