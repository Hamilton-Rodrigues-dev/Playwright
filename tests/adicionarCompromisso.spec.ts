import { test } from "@playwright/test";

test("Adicionar evento", async ({ page }) => {
  test.setTimeout(100000);

///usar o código de login aqui 

  await page.goto("https://app.docshifts.com.br/index/calendario");

  //Aqui tem que alterar de acordo com o dia, pq aqui só esta pegando dia 27
  await page.locator("div").filter({ hasText: /^27$/ }).nth(3).click();

  await page.getByRole("textbox", { name: "Descrição" }).click();
  await page
    .getByRole("textbox", { name: "Descrição" })
    .fill("Deu certo a automação");
  await page.getByRole("button", { name: "Criar" }).click();
});

