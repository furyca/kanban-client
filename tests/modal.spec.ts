import test, { expect } from "@playwright/test";

const TEST_EMAIL = "a@gmail.com";
const TEST_PASSWORD = "12345_fF";
const TEST_PROJECT_TITLE = "Test Title";
const TEST_PROJECT_DESC = "Test Description";
const TEST_PROJECT_STATUS_0 = "Test Status 1";
const TEST_PROJECT_STATUS_1 = "Test Status 2";
const TEST_PROJECT_STATUS_2 = "Test Status 3";

const TEST_TASK_TITLE = "Test Title";
const TEST_TASK_DESC = "Test Description";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  //fill credentials
  const email = page.getByTestId("login-email");
  const password = page.getByTestId("login-password");
  await email.fill(TEST_EMAIL);
  await password.fill(TEST_PASSWORD);
  //route to login page
  const loginLink = page.getByTestId("route-log-in");
  await loginLink.click();
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByTestId("form-log-in")).toBeVisible();
  //Log in
  const loginButton = page.getByTestId("login-button");
  await loginButton.click();
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByTestId("sidebar")).toBeVisible();
});

test.describe("Project Modals", () => {
  test("should create a new project", async ({ page }) => {
    //Open modal
    await page.getByTestId("open-create-project-modal").click();
    await expect(page.getByTestId("create-project-modal")).toBeVisible();

    //Get project count
    const projectCount = await page.getByTestId("sidebar-project").count();

    //get fields
    const titleField = page.getByTestId("create-project-title");
    const descField = page.getByTestId("create-project-desc");
    const status0 = page.getByTestId("create-project-status0");
    const addStatusButton = page.getByTestId("add-status-button");
    await addStatusButton.click();
    await addStatusButton.click();
    const status1 = page.getByTestId("create-project-status1");
    const status2 = page.getByTestId("create-project-status2");

    //clear and fill fields
    await titleField.clear();
    await titleField.fill(TEST_PROJECT_TITLE);
    await descField.clear();
    await descField.fill(TEST_PROJECT_DESC);
    await status0.clear();
    await status0.fill(TEST_PROJECT_STATUS_0);
    await status1.clear();
    await status1.fill(TEST_PROJECT_STATUS_1);
    await status2.clear();
    await status2.fill(TEST_PROJECT_STATUS_2);

    //confirm action
    const confirm = page.getByTestId("create-project-confirm");
    await confirm.click();

    //close modal
    await expect(page.getByTestId("create-project-modal")).toBeHidden();

    //check if the new project added
    const childrenList = page.locator("[data-testid='sidebar-projects'] > [data-testid='sidebar-project']");
    await expect(childrenList).toHaveCount(projectCount + 1);
  });

  test("should delete a project", async ({ page }) => {
    //Open modal
    await page.getByTestId("open-delete-project-modal-0").click();
    await expect(page.getByTestId("delete-project-modal")).toBeVisible();

    //Get project count
    const projectCount = await page.getByTestId("sidebar-project").count();

    //confirm action
    const confirm = page.getByTestId("delete-project-confirm");
    await confirm.click();

    //close modal
    await expect(page.getByTestId("delete-project-modal")).toBeHidden();

    //check if the project deleted
    const childrenList = page.locator("[data-testid='sidebar-projects'] > [data-testid='sidebar-project']");
    await expect(childrenList).toHaveCount(projectCount - 1);
  });

  test("should update a project", async ({ page }) => {
    //open modal
    await page.getByTestId("open-update-project-modal-0").click();
    await expect(page.getByTestId("update-project-modal")).toBeVisible();

    //get fields
    const titleField = page.getByTestId("update-project-title");
    const descField = page.getByTestId("update-project-desc");
    const addStatusButton = page.getByTestId("add-status-button");
    const removeStatusButton = page.getByTestId("remove-status-button-0");
    //add two status then delete the first one
    await addStatusButton.click();
    await addStatusButton.click();
    await removeStatusButton.click();
    const status0 = page.getByTestId("update-project-status-0");
    const status1 = page.getByTestId("update-project-status-1");

    //clear and fill fields
    await titleField.clear();
    await titleField.fill(TEST_PROJECT_TITLE);
    await descField.clear();
    await descField.fill(TEST_PROJECT_DESC);
    await status0.clear();
    await status0.fill(TEST_PROJECT_STATUS_0);
    await status1.clear();
    await status1.fill(TEST_PROJECT_STATUS_1);

    //confirm action
    const confirm = page.getByTestId("update-project-confirm");
    await confirm.click();

    //close modal
    await expect(page.getByTestId("update-project-modal")).toBeHidden();
  });
});

test.describe("Task Modals", () => {
  test("should create a new task", async ({ page }) => {
    //select project
    await page.getByTestId("select-project-0").click();
    await expect(page.getByTestId("task-container-0")).toBeVisible();

    //get task count
    const taskCount = await page.locator("[data-testid='task-container-0'] > [data-testid='task']").count();

    //open modal
    await page.getByTestId("open-create-task-modal-0").click();
    await expect(page.getByTestId("create-task-modal")).toBeVisible();

    //get fields
    const titleField = page.getByTestId("create-task-title");
    const descField = page.getByTestId("create-task-desc");

    //fill the fields
    await titleField.fill(TEST_TASK_TITLE);
    await descField.fill(TEST_TASK_DESC);

    //confirm
    const confirm = page.getByTestId("confirm-create-task");
    await confirm.click();

    //close modal
    await expect(page.getByTestId("create-task-modal")).toBeHidden();

    //check new task count
    const childrenList = page.locator("[data-testid='task-container-0'] > [data-testid='task']");
    await expect(childrenList).toHaveCount(taskCount + 1);
  });

  test("should delete a task", async ({ page }) => {
    //Select project
    await page.getByTestId("select-project-0").click();
    await expect(page.getByTestId("task-container-0")).toBeVisible();

    //Get task count
    const taskCount = await page.locator("[data-testid='task-container-0'] > [data-testid='task']").count();

    //select task
    await page.getByTestId("open-delete-task-modal-0").click();
    await expect(page.getByTestId("delete-task-modal")).toBeVisible();

    //confirm action
    const confirm = page.getByTestId("delete-task-confirm");
    await confirm.click();

    //close modal
    await expect(page.getByTestId("delete-task-modal")).toBeHidden();

    //check if the project deleted
    const childrenList = page.locator("[data-testid='task-container-0'] > [data-testid='task']");
    await expect(childrenList).toHaveCount(taskCount - 1);
  });

  test("should update a task", async ({ page }) => {
    //Select project
    await page.getByTestId("select-project-0").click();
    await expect(page.getByTestId("task-container-0")).toBeVisible();

    //select task
    await page.getByTestId("open-update-task-modal-0").click();
    await expect(page.getByTestId("update-task-modal")).toBeVisible();

    //get fields
    const titleField = page.getByTestId("update-task-title");
    const descField = page.getByTestId("update-task-desc");

    //clear and fill fields
    await titleField.clear();
    await titleField.fill("TEST_TASK_TITLE");
    await descField.clear();
    await descField.fill("TEST_TASK_DESC");

    //confirm action
    const confirm = page.getByTestId("update-task-confirm");
    await confirm.click();

    //close modal
    await expect(page.getByTestId("update-task-modal")).toBeHidden();
  });
});
