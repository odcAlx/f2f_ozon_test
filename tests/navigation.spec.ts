import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import { LoginPage } from '../pages/loginPage';

test('T9. Проверка навигации в header', async ({ page }) => {
  
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const password = 'Пароль';
  const name = 'Саша';
  const surname = 'Одинцов';
  const email = `user_${Date.now()}@mail.ru`;

  await registerPage.navigate('/register');
  await registerPage.register(name, surname, email, password);
  await page.waitForURL(/.*login/);

  await loginPage.navigate('/login');
  await loginPage.login(email, password);
  await page.waitForURL('/');

  await page.goto('/transactions');

  await page.getByRole('link', { name: 'Main' }).click();
  await expect(page).toHaveURL('/');

  await page.getByRole('link', { name: 'Transactions' }).click();
  await expect(page).toHaveURL('/transactions');

  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL('/profile');

  await page.getByRole('heading', { name: 'F2F Bank' }).click(); 
  await expect(page).toHaveURL('/');

  await page.locator('svg').locator('..').click();
  await expect(page).toHaveURL(/.*login/);



});









