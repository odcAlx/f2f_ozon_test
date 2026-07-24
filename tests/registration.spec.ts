import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';

test.describe('Регистрация нового пользователя', () => {
  
  let registerPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegistrationPage(page);
    await registerPage.navigate('/register');
  });

  test.afterEach(async ({ page }) => {
    // await page.goto('/logout');
    console.log(1);
  });

  test.afterAll(async () => {
    console.log(2);

  });


  test('Успешная регистрация', async ({ page }) => {
    
    const uniqueEmail = `test_${Date.now()}@mail.ru`;//дата для уникальности юзеров, чтобы тест не падал без обновления БД
    
    await registerPage.register('Саша', 'Одинцов', uniqueEmail, '1234');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Регистрация с пустым Email', async ({ page }) => {

    await registerPage.register('Саша', 'Одинцов', '', '1234');
    await expect(page).toHaveURL('/register');
  });


});