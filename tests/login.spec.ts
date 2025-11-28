import { test } from "@playwright/test";

test("Entrar", async ({ page }) => {
  test.setTimeout(100000);

  await page.goto("https://app.docshifts.com.br/");
  await page.getByText("LOGIN").click();
  await page
    .getByPlaceholder("hipocrates@docshifts.com")
    .fill("email");
  await page.getByPlaceholder("***********").fill("senha");
  await page.getByRole("textbox", { name: "***********" }).press("Enter");
  await page.goto("https://app.docshifts.com.br/index/calendario");
});

