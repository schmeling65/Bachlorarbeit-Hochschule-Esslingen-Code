import {
  test,
  expect,
  LocatorScreenshotOptions,
  Locator,
} from "@playwright/test";
/*import * as v8 from 'v8';
const HEAP = v8.getHeapStatistics().heap_size_limit / (1024 * 1024);
*/
import 'dotenv/config';

test("Go to HE-Online", async ({ page }) => {
  await page.goto("https://www.hs-esslingen.de/");
  await page.waitForLoadState("networkidle");
  await page.getByText("Speichern & Schließen").click();
  await page.waitForLoadState("networkidle");
  await page.getByTitle("Login ins Intranetportal").click();
  await page.waitForLoadState("networkidle");
  await page.locator("username");
});

test("test", async ({ page }) => {
  await page.goto("https://www.hs-esslingen.de/");
  await page.getByRole("button", { name: "Speichern & Schließen" }).click();
  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "" }).click();
  const page1 = await page1Promise;
  await page1.getByLabel("Username").click();
  await page1.getByLabel("Username").fill(process.env.loginname!.toString());
  await page1.getByLabel("Username").press("Tab");
  await page1.getByLabel("Password").fill(process.env.loginpassword!.toString());
  await page1.getByRole("button", { name: "Login" }).click();
  await page1.getByRole("button", { name: "Speichern & Schließen" }).click();
  const page2Promise = page1.waitForEvent("popup");
  await page1
    .getByRole("contentinfo")
    .getByRole("link", { name: "HEonline" })
    .click();
  const page2 = await page2Promise;
  await page2.getByRole("button", { name: "Login" }).click();
});

test("stupid test", async ({ page }) => {
  await page.goto("https://www.hs-esslingen.de/");
  console.log(
    await page
      .getByRole("button", { name: "Speichern & Schließen" })
      .isVisible()
  );
  console.log(
    await page
      .getByRole("button", { name: "Speichern & Schliesfadßen" })
      .isVisible()
  );
});

test("Immatrikulationsbescheinigung holen", async ({ page }) => {
  /*PW und username in eine Datei schreiben mit + gitignore
Englisch-Deutsch umschaltung beachten
*/
  const startTime = Date.now();

  await page.goto("https://www.hs-esslingen.de/");
  await page.getByRole("button", { name: "Speichern & Schließen" }).click();
  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("link", { name: "" }).click();
  const page1 = await page1Promise;
  await page1.getByLabel("Username").click();
  await page1.getByLabel("Username").fill(process.env.loginname!.toString());
  await page1.getByLabel("Username").press("Tab");
  await page1.getByLabel("Password").fill(process.env.loginpassword!.toString());
  await page1.getByLabel("Password").press("Enter");

  const termsVisibleeng = await page1
    .getByText("I accept the terms of use")
    .isVisible();
  if (termsVisibleeng) {
    await page1.getByText("I accept the terms of use").click();
    await page1.getByRole("button", { name: "Submit" }).click();
  } else if (await page1.getByText("Ich akzeptiere die").isVisible()) {
    await page1.getByText("Ich akzeptiere die").click();
    await page1.getByRole("button", { name: "Senden" }).click();
  } else {
  }

  await page1.getByRole("button", { name: "Speichern & Schließen" }).click();
  const page2Promise = page1.waitForEvent("popup");
  await page1
    .getByRole("contentinfo")
    .getByRole("link", { name: "HEonline" })
    .click();
  const page2 = await page2Promise;
  await page2.getByRole("button", { name: "Login" }).nth(1).click();
  await page2.waitForTimeout(3000);
  const visible = await page2
    .getByRole("link", { name: "Dokumente   - Studierenden-" })
    .isVisible();
  if (visible) {
    await page2
      .getByRole("link", { name: "Dokumente   - Studierenden-" })
      .click();
  } else {
    await page2.getByRole("link", { name: "Documents   - Student" }).click();
  }

  await page2.waitForTimeout(1000);
  const page3Promise = page2.waitForEvent("popup");
  if (
    (await page2.title()) ==
    "Documents - HEonline - Hochschule Esslingen University of Applied Sciences"
  ) {
    await page2
      .frameLocator('iframe[name="nameIframe"]')
      .getByRole("row", { name: "Certificate of Enrolment" })
      .getByRole("link")
      .click();
  } else {
    await page2
      .frameLocator('iframe[name="nameIframe"]')
      .getByRole("row", { name: "Immatrikulationsbescheinigung" })
      .getByRole("link")
      .click();
  }
  const page3 = await page3Promise;

  const endTime = Date.now();

  console.log("Zeit vergangen: " + (endTime - startTime - 4000) + "ms"); //4000 teil warten von 4000ms an einer Stelle
});

test("Accountinformationen abrufen", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("https://heonline.hs-esslingen.de/");
  await page.getByRole("button", { name: "Login" }).nth(1).click();
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(process.env.loginname!.toString());
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Password").fill(process.env.loginpassword!.toString());
  await page.getByLabel("Password").press("Enter");

  const termsVisibleeng = await page
    .getByText("I accept the terms of use")
    .isVisible();
  if (termsVisibleeng) {
    await page.getByText("I accept the terms of use").click();
    await page.getByRole("button", { name: "Submit" }).click();
  } else if (await page.getByText("Ich akzeptiere die").isVisible()) {
    await page.getByText("Ich akzeptiere die").click();
    await page.getByRole("button", { name: "Senden" }).click();
  } else {
  }
  await page.waitForTimeout(3000);
  const visible = await page
    .getByRole("link", { name: "Accountstatus   -" })
    .isVisible();
  if (visible) {
    await page.getByRole("link", { name: "Accountstatus   -" }).click();
  } else {
    await page
      .getByRole("link", { name: "Account Status   - Retrieve" })
      .click();
  }

  await page.waitForTimeout(4000);
  const nameelement = page
    .frameLocator('iframe[name="nameIframe"]')
    .frameLocator('frame[name="mainaev"]')
    .getByRole("cell", { name: process.env.loginname!.toString(), exact: true });
  const emailelement = page
    .frameLocator('iframe[name="nameIframe"]')
    .frameLocator('frame[name="mainaev"]')
    .getByText(process.env.loginname!.toString()+"@hs-esslingen.de");

  await expect(nameelement).toHaveText(process.env.loginname!.toString());
  await expect(emailelement).toHaveText(process.env.loginname!.toString()+"@hs-esslingen.de");

  const endTime = Date.now();

  console.log("Zeit vergangen: " + (endTime - startTime - 4000) + "ms"); //4000 teil warten von 4000ms an einer Stelle
});

test("Bisher erhaltene Credits ablesen", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("https://heonline.hs-esslingen.de/");
  await page.getByRole("button", { name: "Login" }).nth(1).click();
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(process.env.loginname!.toString());
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Password").fill(process.env.loginpassword!.toString());
  await page.getByLabel("Password").press("Enter");

  const termsVisibleeng = await page
    .getByText("I accept the terms of use")
    .isVisible();
  if (termsVisibleeng) {
    await page.getByText("I accept the terms of use").click();
    await page.getByRole("button", { name: "Submit" }).click();
  } else if (await page.getByText("Ich akzeptiere die").isVisible()) {
    await page.getByText("Ich akzeptiere die").click();
    await page.getByRole("button", { name: "Senden" }).click();
  } else {
  }
  await page.waitForTimeout(3000);
  const visible = await page
    .getByRole("link", { name: "Mein Studium   - Studierende" })
    .isVisible();
  if (visible) {
    await page
      .getByRole("link", { name: "Mein Studium   - Studierende" })
      .click();
  } else {
    await page.getByRole("link", { name: "My Degree Programme   -" }).click();
  }

  await page.waitForSelector(".cm-curriculum-headline");

  const crediterreicht = await page
    .locator(".credits-value")
    .locator(".part")
    .first()
    .innerText();
  const creditsinsgesamt = await page
    .locator(".credits-value")
    .locator(".complete")
    .first()
    .innerText();

  await expect(crediterreicht).toBeDefined();
  await expect(creditsinsgesamt).toBeDefined();
  console.log(crediterreicht + " Credits erreicht von " + creditsinsgesamt);

  const endTime = Date.now();

  console.log("Zeit vergangen: " + (endTime - startTime - 4000) + "ms"); //4000 teil warten von 4000ms an einer Stelle
});

test("Welche Module fehlen noch:", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("https://heonline.hs-esslingen.de/");
  await page.getByRole("button", { name: "Login" }).nth(1).click();
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(process.env.loginname!.toString());
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Password").fill(process.env.loginpassword!.toString());
  await page.getByLabel("Password").press("Enter");

  const termsVisibleeng = await page
    .getByText("I accept the terms of use")
    .isVisible();
  if (termsVisibleeng) {
    await page.getByText("I accept the terms of use").click();
    await page.getByRole("button", { name: "Submit" }).click();
  } else if (await page.getByText("Ich akzeptiere die").isVisible()) {
    await page.getByText("Ich akzeptiere die").click();
    await page.getByRole("button", { name: "Senden" }).click();
  } else {
  }
  await page.waitForTimeout(3000);
  const visible = await page
    .getByRole("link", { name: "Mein Studium   - Studierende" })
    .isVisible();
  if (visible) {
    await page
      .getByRole("link", { name: "Mein Studium   - Studierende" })
      .click();
  } else {
    await page.getByRole("link", { name: "My Degree Programme   -" }).click();
  }

  await page.waitForSelector(".cm-curriculum-headline");

  let Abschnitte = await page.locator(".curriculum-element-card").all();
  let AbschnitteAnzahl = await Abschnitte.length;
  let AlleNichtBestandenen: string[] = [];
  for (var index = 0; index < AbschnitteAnzahl - 1; index++) {
    if (
      (await Abschnitte[index].evaluate(async (Element) => {
        return getComputedStyle(Element).getPropertyValue("background-color");
      })) === "rgb(255, 255, 255)"
    ) {
      await Abschnitte[index].click();
      await page.waitForTimeout(5000);
      await page.waitForSelector(".curriculum-card-deck");
      await page.evaluate(() =>
        document
          .getElementsByClassName("cdk-virtual-scroll-viewport")[0]
          .scrollBy(0, document.body.scrollHeight)
      );
      await page.waitForTimeout(1000);
      let Module = await page
        .locator(".mat-mdc-card.mdc-card.curriculum-element-card")
        .all();
      let ModulAnzahl = Module.length;
      for (var modulindex = 0; modulindex < ModulAnzahl; modulindex++) {
        if (
          (await Module[modulindex].evaluate(async (Element) => {
            return getComputedStyle(Element).getPropertyValue(
              "background-color"
            );
          })) === "rgb(255, 255, 255)"
        ) {
          AlleNichtBestandenen.push(
            await Module[modulindex]
              .locator(".curriculum-element-name")
              .first()
              .innerText()
          );
        }
      }
      await page.goBack();
      await page.waitForTimeout(5000);
      await page.waitForSelector(".cm-curriculum-headline");
    }
  }
  console.log(AlleNichtBestandenen);

  const endTime = Date.now();

  console.log("Zeit vergangen: " + (endTime - startTime - 8000) + "ms"); //8000 teil warten von 8000ms an Stellen;
});
