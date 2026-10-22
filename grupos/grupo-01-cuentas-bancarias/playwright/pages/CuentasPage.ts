
import { expect, type Page } from "@playwright/test";

export class CuentasPage {
  constructor(private readonly page: Page) {}

async ingresarConCorreoAutorizado(): Promise<void> {
  const email = process.env.TEST_ADMIN_EMAIL;

  if (!email) {
    throw new Error(
      "Falta configurar TEST_ADMIN_EMAIL"
    );
  }

  await this.page.goto(
    "https://aiquaa-sandbox-web.vercel.app/auth/login"
  );

  await this.page.getByLabel("Email").first().fill(email);

  await this.page.getByRole("button", {
    name: "Ingresar",
    exact: true
  }).click();

  await expect(
    this.page.getByRole("heading", {
      name: /Bienvenido/i
    })
  ).toBeVisible();
}

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
