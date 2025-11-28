import { expect, test } from "@playwright/test";

test("Extrair todos os compromissos", async ({ page }) => {
  test.setTimeout(180000);

  await page.goto("https://app.docshifts.com.br/");
  await page.getByText("LOGIN").click();
  await page
    .getByPlaceholder("hipocrates@docshifts.com")
    .fill("email");
  await page.getByPlaceholder("***********").fill("senha");
  await page.getByRole("textbox", { name: "***********" }).press("Enter");

  await page.waitForURL("**/index/calendario", { timeout: 30000 });
  await expect(page.getByText("Nome do usuario")).toBeVisible({ timeout: 15000 });
  console.log("✅ Login confirmado!");

  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  const todosEventos = page.locator(".fc-daygrid-event-harness");
  const quantidade = await todosEventos.count();

  console.log(`\n✅ Encontrei ${quantidade} eventos\n`);

  const relatorio = [];

  for (let i = 0; i < quantidade; i++) {
    console.log(`${"=".repeat(50)}`);
    console.log(`🔍 Evento ${i + 1}/${quantidade}`);

    try {
      await todosEventos.nth(i).click();

      await expect(page.getByText("Editar Compromisso")).toBeVisible({
        timeout: 10000,
      });
      console.log("   ✅ Modal aberta");

      await page.waitForTimeout(1500);

      const isPessoal = await page
        .locator('input[type="checkbox"]')
        .first()
        .isChecked();

      let dados = {};

      if (isPessoal) {
        console.log("   📌 PESSOAL");

        const inputs = await page.locator('div[role="dialog"] input').all();

        dados = {
          tipo: "Pessoal",
          descricao: await page.locator("input").nth(0).inputValue(),
          data: await page.locator("input").nth(3).inputValue(),
          hora: await page.locator("input").nth(5).inputValue(),
        };
      } else {
        console.log("   💼 PROFISSIONAL");

        const inputs = await page.locator('div[role="dialog"] input').all();

        dados = {
          tipo: "Profissional",
          descricao: await page.locator("input").nth(0).inputValue(),
          data: await page.locator("input").nth(3).inputValue(),
          hora: await page.locator("input").nth(5).inputValue(),
          valor: await page.locator("input").nth(6).inputValue(),
        };
      }

      console.log("   📝", dados);
      relatorio.push(dados);

      console.log("   🚪 Fechando modal...");

      await page.mouse.click(50, 50);

      await page.waitForTimeout(500);

      const modalVisivel = await page
        .getByText("Editar Compromisso")
        .isVisible();

      if (modalVisivel) {
        console.log("   ⚠️ Ainda aberta, tentando ESC...");
        await page.keyboard.press("Escape");
        await page.waitForTimeout(500);
      }

      await expect(page.getByText("Editar Compromisso")).toBeHidden({
        timeout: 5000,
      });

      console.log("   ✅ Modal fechada!\n");

      await page.waitForTimeout(1000);
    } catch (erro) {
      console.error(`\n❌ ERRO no evento ${i + 1}:`, erro.message);

      await page.screenshot({ path: `erro-evento-${i + 1}.png` });

      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
      await page.mouse.click(50, 50);
      await page.waitForTimeout(2000);

      console.log("   ⏩ Pulando...\n");
    }
  }

  console.log("\n" + "🎉".repeat(30));
  console.log("📊 RELATÓRIO FINAL");
  console.log("🎉".repeat(30));
  console.log(JSON.stringify(relatorio, null, 2));
  console.log(`\n✅ Total: ${relatorio.length}/${quantidade} eventos`);

  const fs = require("fs");
  fs.writeFileSync("compromissos.json", JSON.stringify(relatorio, null, 2));
  console.log("💾 Salvo em compromissos.json");
});