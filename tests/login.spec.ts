import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { RegisterPage } from '../pages/registerPage';

test.describe('Авторизация (T5–T8, T14)', () => {

  const password = 'Пароль';
  const name = 'Саша';
  const surname = 'Одинцов';

  let loginPage: LoginPage;
  let registerPage: RegisterPage;


  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);

  });

  test('T5. Успешная авторизация', async ({ page }) => {

    const email = `test_${Date.now()}@mail.ru`;
    await registerPage.navigate('/register');
    await registerPage.register('name', 'surname', email, 'password');
    await expect(page).toHaveURL(/.*login/);

    await loginPage.navigate('/login');
    await loginPage.login(email, 'password');
    await expect(page).toHaveURL('/');


  });

  test('T6. Доступ к защищённым страницам без авторизации', async ({ page }) => {

    await page.goto('/profile');
    await expect(page).toHaveURL(/.*login/);
    await page.goto('/transactions');
    await expect(page).toHaveURL(/.*login/);

  });

  test('T7. Авторизация с неверным паролем', async ({ page }) => {

    const email = `test_${Date.now()}@mail.ru`;
    await registerPage.navigate('/register');
    await registerPage.register('name', 'surname', email, password);

    await loginPage.navigate('/login');
    await loginPage.login(email, 'wrong');
    await expect(page).toHaveURL(/.*login/);

  });

  test.describe('T8. Пустые поля', () => {

    const emptyCases: [string, string, string][] = [

      ['Пустой Email', '', 'password'],
      ['Пустой Password', `test_${Date.now()}@mail.ru`, ''],

    ];

    for (const [desc, email, password] of emptyCases) {

      test(`Ошибка при: ${desc}`, async ({ page }) => {

        await loginPage.navigate('/login');
        await loginPage.login(email, password);
        await expect(page).toHaveURL(/.*login/);

        
      });
    }
  });


  test('T14. Проверка соответствия баланса при смене аккаунта', async ({ page }) => {

    const userA = { name: 'UserA', email: `a_${Date.now()}@mail.ru`, pass: password };
    const userB = { name: 'UserB', email: `b_${Date.now()+1}@mail.ru`, pass: password };

    await registerPage.navigate('/register');
    await registerPage.register(userA.name, surname, userA.email, userA.pass);
    await expect(page).toHaveURL(/.*login/);
    await registerPage.navigate('/register');
    await registerPage.register(userB.name, surname, userB.email, userB.pass);
    await expect(page).toHaveURL(/.*login/);

    await loginPage.navigate('/login');
    await loginPage.login(userA.email, userA.pass);
    await expect(page).toHaveURL('/');

    await page.goto('/transactions');
    await page.getByRole('button', { name: 'Add balance' }).click();
    await page.getByPlaceholder('Enter sum').fill('100');

    const dialog = page.getByRole('dialog');
    await page.locator('.confirm-btn').click();
    await expect(dialog).toBeHidden();

    await expect(page.getByText(/Balance:/)).toHaveText(/100/);

    await page.locator('svg').click();
    await loginPage.navigate('/login');
    await loginPage.login(userB.email, userB.pass);
    await expect(page).toHaveURL('/');

    const balanceB = page.locator('header').getByText(/Balance:/);
    await expect(balanceB).toHaveText(/Balance: 100/, { timeout: 500 });

 

  });
});







