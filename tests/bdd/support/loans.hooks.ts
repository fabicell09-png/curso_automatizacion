import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { chromium, type Browser } from '@playwright/test';
import { LoansPage } from '../../../playwright/pages/LoansPage';
import { LoansWorld } from './loans.world';
import { CuentasPage } from "../../../grupos/grupo-01-cuentas-bancarias/playwright/pages/CuentasPage";

let browser: Browser;

BeforeAll(async () => {
  browser = await chromium.launch();
});

Before({ tags: '@grupo-03 and @web and not @wip' }, async function (this: LoansWorld) {
  this.browser = browser;
  this.context = await browser.newContext({
    baseURL: process.env.BASE_URL || 'https://aiquaa-sandbox-web.vercel.app',
  });
  this.page = await this.context.newPage();
  this.loans = new LoansPage(this.page);
});

After({ tags: '@grupo-03 and @web and not @wip' }, async function (this: LoansWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    await this.attach(await this.page.screenshot(), 'image/png');
  }
  await this.context?.close();
});

Before(
  { tags: "@grupo-01" },
  async function (this: LoansWorld) {
    this.browser = browser;

    this.context = await browser.newContext({
      baseURL:
        process.env.BASE_URL ||
        "https://aiquaa-sandbox-web.vercel.app",
    });

    this.page = await this.context.newPage();

    this.cuentas = new CuentasPage(this.page);
  }
);

After(
  { tags: "@grupo-01" },
  async function (this: LoansWorld, { result }) {
    try {
      if (
        result?.status === Status.FAILED &&
        this.page
      ) {
        await this.attach(
          await this.page.screenshot(),
          "image/png"
        );
      }
    } finally {
      await this.context?.close();
    }
  }
);

AfterAll(async () => {
  await browser?.close();
});
