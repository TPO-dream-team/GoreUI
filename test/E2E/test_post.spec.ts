//Tests: PU-01, PU-02, PU-03, PU-09, PU-10, PU-11, PU-12
import { test, expect } from '../fixtures';

test('test new post: PU-01, PU-02, PU-03, PU-09, PU-10, PU-11, PU-12', async ({ page, dbClient, backendUrl}) => {
    const envUrl = process.env.VITE_AUTH_API_BASEURL || 'http://localhost:5000';

  await page.route(`${envUrl}/**`, (route) => {
    const newUrl = route.request().url().replace(envUrl, backendUrl);
    route.continue({ url: newUrl });
  });

  await page.goto('/');

   // Register
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByLabel('Username').fill('testuser1');
  await page.getByLabel('Password', { exact: true }).fill('testuser1');
  await page.getByLabel('Confirm password').fill('testuser1');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Login
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('#loginUsername').fill('testuser1');
  await page.locator('#loginPassword').fill('testuser1');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await page.getByRole('button', { name: 'Posts' }).click();
  await page.getByRole('button', { name: 'Post' }).click();
  await page.getByRole('textbox', { name: 'My amazing weekend...' }).click();
  await page.getByRole('textbox', { name: 'My amazing weekend...' }).fill('Moj prvi testpost');
  await page.getByRole('textbox', { name: 'How are you feeling?' }).click();
  await page.getByRole('textbox', { name: 'How are you feeling?' }).fill('Vredu se počutim 123');
  await page.getByRole('button', { name: 'Post now' }).click();
  await page.getByRole('link', { name: 'View 0 Comments' }).click();
  await page.getByRole('textbox', { name: 'Write a comment...' }).click();
  await page.getByRole('textbox', { name: 'Write a comment...' }).fill('Moj prvi komentar');
  await page.locator('footer').getByRole('button').click();
  await page.getByRole('textbox', { name: 'Write a comment...' }).click();
  await page.locator('header').getByRole('button').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
});