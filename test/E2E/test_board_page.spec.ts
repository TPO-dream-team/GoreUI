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
  await page.getByRole('button', { name: 'Registration' }).click();
  await page.getByLabel('Username').fill('testuser1');
  await page.getByLabel('Password', { exact: true }).fill('testuser1');
  await page.getByLabel('Confirm password').fill('testuser1');
  await page.getByRole('button', { name: 'Register' }).click();

  // Login
  await page.getByRole('button', { name: 'Login' }).click();
  // Now targeting the specific login fields
  await page.locator('#loginUsername').fill('testuser1');
  await page.locator('#loginPassword').fill('testuser1');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  // Navigation & Action
  await page.getByRole('button', { name: 'Tours' }).click();
  await page.getByRole('button', { name: 'New tour' }).click();
  await page.getByRole('button', { name: 'Skrlatica 2740 m' }).click();
  
  // Fill Form
  await page.getByRole('button', { name: 'Select a date' }).click();
  await page.getByLabel('Choose the Year').selectOption('2031');
  await page.getByRole('button', { name: 'Wednesday, May 21st,' }).click();
  await page.getByRole('button', { name: 'May 21st, 2031', exact: true }).click()

  await page.getByRole('spinbutton', { name: 'Duration (hours)' }).click();
  await page.getByRole('spinbutton', { name: 'Duration (hours)' }).fill('4');
  await page.getByRole('spinbutton', { name: 'Difficulty (1-5)' }).click();
  await page.getByRole('spinbutton', { name: 'Difficulty (1-5)' }).fill('4');
  await page.getByRole('textbox', { name: 'Description' }).fill('First tour');
  await page.getByRole('button', { name: 'Publish tour' }).click();

  // Commenting
  await page.getByRole('button', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Write a comment...' }).fill('My first comment');
  await page.getByRole('button', { name: 'Post' }).click();

  // Optional: Add an assertion to verify success
  await expect(page.getByText('My first comment')).toBeVisible();
});
