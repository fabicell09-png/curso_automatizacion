
import type { Page } from "@playwright/test";

export class CuentasPage {
  constructor(private readonly page: Page) {}

  async abrirAplicacion() {
    await this.page.goto(
      "https://aiquaa-sandbox-web.vercel.app/"
    );
  }
}
