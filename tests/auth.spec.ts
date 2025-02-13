import test, { expect } from "@playwright/test";

const TEST_EMAIL = "a@gmail.com"
const TEST_PASSWORD = "12345_fF"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

test.describe("Auth", () => {
  test("should navigate to log in page", async ({ page }) => {
    const loginButton = page.getByTestId("route-log-in");
    await loginButton.click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByTestId("form-log-in")).toBeVisible();
  });
  test("should navigate to sign up page", async ({ page }) => {
    const signupButton = page.getByTestId("route-sign-up");
    await signupButton.click();
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.getByTestId("form-sign-up")).toBeVisible();
  });
  test("shouldn't be corrupted after page shifts", async ({ page }) => {
    //route to login page
    const loginLink = page.getByTestId("route-log-in");
    await loginLink.click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByTestId("form-log-in")).toBeVisible();

    //route to signup page through "Don't have an account" link
    const toSignUpButton = page.getByTestId("route-signup-login-form");
    await toSignUpButton.click();
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.getByTestId("form-sign-up")).toBeVisible();

    //route back to login page through "Already have an account" link
    const toLogInButton = page.getByTestId("route-login-signup-form");
    await toLogInButton.click();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByTestId("form-log-in")).toBeVisible();

    //fill credentials
    const email = page.getByTestId("login-email");
    const password = page.getByTestId("login-password");
    await email.fill(TEST_EMAIL);
    await password.fill(TEST_PASSWORD);

    //Log in
    const loginButton = page.getByTestId("login-button");
    await loginButton.click();
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByTestId("sidebar")).toBeVisible();
  });
});
