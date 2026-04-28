//Tests: PU-01, PU-02, PU-05, PU-06, PU-07, PU-08
import { test, expect } from '../fixtures';

test('test board page: PU-01, PU-02, PU-05, PU-06, PU-07, PU-08', async ({ page, dbClient, backendUrl }) => {
  const envUrl = process.env.VITE_AUTH_API_BASEURL || 'http://localhost:5000';

  await page.route(`${envUrl}/**`, (route) => {
    const newUrl = route.request().url().replace(envUrl, backendUrl);
    route.continue({ url: newUrl });
  });

  await page.goto('/');

  // Register
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('testuser1');
  await page.getByRole('textbox', { name: 'Password Confirm password' }).fill('testuser1');
  await page.locator('#passwordInput').nth(1).fill('testuser1');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Login
  const usernameInput = page.locator('#usernameInput');
  await usernameInput.waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(2000);
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('testuser1');
  await page.waitForTimeout(1000);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('testuser1');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigation & Action
  await page.getByRole('button', { name: 'Tours' }).click();
  await page.getByRole('button', { name: 'Create new tour' }).click();
  await page.getByRole('button', { name: 'Skrlatica 2740 m' }).click();
  
  // Fill Form
  await page.getByRole('textbox', { name: 'Day of the tour' }).fill('2033-10-21');
  await page.getByRole('spinbutton', { name: 'Time (hours)' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Difficulty (1-5)' }).fill('4');
  await page.getByRole('textbox', { name: 'Description' }).fill('First tour');
  await page.getByRole('button', { name: 'Create a tour' }).click();

  // Commenting
  await page.getByRole('button', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Write a comment...' }).fill('My first comment');
  await page.getByRole('button', { name: 'Post' }).click();

  // Optional: Add an assertion to verify success
  await expect(page.getByText('My first comment')).toBeVisible();
});
