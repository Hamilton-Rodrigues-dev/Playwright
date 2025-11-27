import { test, expect, type Page } from '@playwright/test';

test('exemplo completo - formulário de contato', async ({ page }) => {
  // Ir para uma página com formulário
  await page.goto('https://www.techlistic.com/p/selenium-practice-form.html');
  
  // 1. PREENCHER CAMPOS (FILL)
  await page.fill('input[name="firstname"]', 'João');
  await page.fill('input[name="lastname"]', 'Silva');
  
  // 2. SELECIONAR RADIO BUTTON
  await page.check('input#sex-0'); // masculino
  
  // 3. SELECIONAR CHECKBOX
  await page.check('input#profession-1'); // Automation Tester
  
  // 4. SELECIONAR DROPDOWN
  await page.selectOption('select#continents', 'South America');
  
  // 5. PEGAR DADOS (extrair informações)
  const primeiroNome = await page.inputValue('input[name="firstname"]');
  console.log('Nome preenchido:', primeiroNome);
  
  // Verificar se radio está marcado
  const isChecked = await page.isChecked('input#sex-0');
  console.log('Radio marcado?', isChecked);
  
  // Pegar valor selecionado no dropdown
  const continenteSelecionado = await page.locator('select#continents').inputValue();
  console.log('Continente:', continenteSelecionado);
  
  // 6. SCREENSHOT final
  await page.screenshot({ path: 'formulario-preenchido.png', fullPage: true });
});
test('extrair dados de tabela', async ({ page }) => {
  await page.goto('https://www.w3schools.com/html/html_tables.asp');
  
  // Pegar todas as linhas da tabela
  const linhas = await page.locator('table#customers tr').allTextContents();
  console.log('Linhas da tabela:', linhas);
  
  // Pegar células específicas
  const primeiraLinha = await page.locator('table#customers tr').nth(1).textContent();
  console.log('Primeira linha:', primeiraLinha);
  
  // Pegar todos os dados de uma coluna
  const empresas = await page.locator('table#customers td:nth-child(1)').allTextContents();
  console.log('Empresas:', empresas);
});
test('buscar no Google e pegar resultados', async ({ page }) => {
  await page.goto('https://www.google.com');
  
  // 1. PREENCHER campo de busca
  await page.fill('textarea[name="q"]', 'Playwright automation');
  
  // 2. PRESSIONAR Enter
  await page.press('textarea[name="q"]', 'Enter');
  
  // 3. ESPERAR resultados carregarem
  await page.waitForSelector('h3');
  
  // 4. PEGAR títulos dos resultados
  const titulos = await page.locator('h3').allTextContents();
  console.log('Primeiros resultados:', titulos.slice(0, 5));
  
  // 5. PEGAR links dos resultados
  const links = await page.locator('a h3').evaluateAll(elements => 
    elements.map(el => el.closest('a').href)
  );
  console.log('Links:', links.slice(0, 3));
  
  // 6. SCREENSHOT da página de resultados
  await page.screenshot({ path: 'resultados-google.png' });
});