import { test } from "@playwright/test";

test("Deletar evento", async ({ page }) => {
  test.setTimeout(100000);
  await page.goto("https://app.docshifts.com.br/");
  await page.getByText("LOGIN").click();
  await page
    .getByPlaceholder("hipocrates@docshifts.com")
    .fill("email");
  await page.getByPlaceholder("***********").fill("senha");
  await page.getByRole("textbox", { name: "***********" }).press("Enter");
  await page.goto("https://app.docshifts.com.br/index/calendario");

  await page
    .locator("a")
    .filter({ hasText: "00Deu certo a automação" })
    .first()
    .click();
  await page.getByRole("button", { name: "Deletar" }).click();
  await page
    .locator("a")
    .filter({ hasText: "00Deu certo a automação" })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Deletar" }).click();
  await page
    .locator("a")
    .filter({ hasText: "00Deu certo a automação" })
    .nth(2)
    .click();
  await page.getByRole("button", { name: "Deletar" }).click();
  await page
    .locator("a")
    .filter({ hasText: "00Deu certo a automação" })
    .nth(3)
    .click();
  await page.getByRole("button", { name: "Deletar" }).click();
});

