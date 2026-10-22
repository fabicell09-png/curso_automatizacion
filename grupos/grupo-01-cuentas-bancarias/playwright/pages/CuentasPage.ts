
import { expect, type Page } from "@playwright/test";

export class CuentasPage {
  constructor(private readonly page: Page) {}

  async abrirAplicacion() {
    await this.page.goto(
      "https://aiquaa-sandbox-web.vercel.app/cuentas"
    );
  }

  async consultarCuentaActiva() {
    const tabla = this.page.locator("table");
    await expect(tabla).toBeVisible();

    const filas = tabla.locator("tbody tr");
    const activas = filas.filter({
      has: this.page.getByRole("cell", {
        name: "Sí",
        exact: true
      })
    });

    await expect(activas.first()).toBeVisible();

    return activas.first();
  }

  async validarSaldoYMoneda() {
    const fila = await this.consultarCuentaActiva();
    const celdas = fila.locator("td");

    const moneda = (await celdas.nth(4).innerText()).trim();
    const saldo = (await celdas.nth(5).innerText()).trim();

    expect(["PYG", "USD"]).toContain(moneda);
    expect(saldo).toMatch(/^(PYG|USD)\s+[\d.,]+$/);
    expect(saldo).toContain(moneda);
  }
}
