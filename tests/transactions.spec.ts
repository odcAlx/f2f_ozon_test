import { test, expect } from '@playwright/test';
import { TransactionsPage } from '../pages/transactionsPage';
import { RegisterPage } from '../pages/registerPage';
import { LoginPage } from '../pages/loginPage';

test.describe('Транзакции и баланс (T17–T24)', () => {

  const password = 'Пароль';


  let registerPage: RegisterPage;
  let loginPage: LoginPage;
  let transactionsPage: TransactionsPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);

    const email = `user_${Date.now()}@mail.ru`;
    await registerPage.navigate('/register');
    await registerPage.register('User', 'Test', email, password);
    await page.waitForURL(/.*login/);

    await loginPage.navigate('/login');
    await loginPage.login(email, password);
    await page.waitForURL('/');



  });

  test('T17. Успешное зачисление', async ({ page }) => {

    await transactionsPage.navigate('/transactions');
    await transactionsPage.addBalance('50');

    const balance = await page.getByText(/Balance:/);

    await expect(balance).toContainText('50');

  });

  test('T18. Пустые поля в форме зачисления', async ({ page }) => {

    await transactionsPage.navigate('/transactions');
    await transactionsPage.openAddBalanceModal();

    await page.locator('.confirm-btn').click();

    await expect(page.locator('.modal')).toBeVisible();

  });

  test.describe('T19. Валидация пополнения', () => {


    test('Нулевое значение', async ({ page }) => {
      await transactionsPage.navigate('/transactions');
      await transactionsPage.openAddBalanceModal();
      await page.getByPlaceholder('Enter sum').fill('0');
      await page.locator('.confirm-btn').click();
      await expect(page.locator('.modal')).toBeVisible();

    });

    test('Отрицательное значение', async ({ page }) => {

      await transactionsPage.navigate('/transactions');
      await transactionsPage.openAddBalanceModal();
      await page.getByPlaceholder('Enter sum').fill('-10');
      await page.locator('.confirm-btn').click();
      await expect(page.locator('.modal')).toBeVisible();


    });
  });

  test('T20. Валидация знаков после запятой при пополнении', async ({ page }) => {


    await transactionsPage.navigate('/transactions');
    await transactionsPage.openAddBalanceModal();
    await page.getByPlaceholder('Enter sum').fill('0.001');
    await page.locator('.confirm-btn').click();
     await expect(page.locator('.modal')).toBeVisible();

  });
  
  test.describe('T21. Десятичные разделители', () => {

    test.use({ locale: 'ru-RU' });
  
    const separators: [string, string][] = [

      ['Точка', '0.5'],
      ['Запятая', '0,5'],

    ];
  
    for (const [desc, amount] of separators) {

      test(`Пополнение с разделителем: ${desc}`, async ({ page }) => {

        await transactionsPage.navigate('/transactions');
        
        const balanceBeforeText = await page.locator('header').getByText(/Balance:/).innerText();
        const balanceBefore = parseFloat(balanceBeforeText.replace('Balance:', '').trim());
        const expectedValue = balanceBefore + 0.5;
  
        await transactionsPage.openAddBalanceModal();
        const input = page.getByPlaceholder('Enter sum');
  

        if (amount === '0,5') {
          await input.pressSequentially('0,5', { delay: 100 });
        } else {
          await input.fill(amount);
        }
  
        await page.locator('.modal').getByRole('button', { name: 'Add' }).click();
  
        const balanceLocator = page.locator('header').getByText(/Balance:/);

        await expect(balanceLocator).toContainText(expectedValue.toFixed(1), { timeout: 10000 });



      });

    }
  });

  test('T22. Кнопка Cancel в поп-ап окне пополнения', async ({ page }) => {

    await transactionsPage.navigate('/transactions');
    await transactionsPage.openAddBalanceModal();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('dialog')).toBeHidden();

  });

  test('T23. Появление строки в списке после зачисления', async ({ page }) => {

    await transactionsPage.navigate('/transactions');
    const initialRows = await page.locator('table tr').count();
    await transactionsPage.addBalance('10');
    await page.waitForTimeout(500);
    const newRows = await page.locator('table tr').count();
    expect(newRows).toBeGreaterThan(initialRows);
    const type = await transactionsPage.getLastTransactionType();
    expect(type).toBe('completed');
  });

test('T24. Отображение больших чисел', async ({ page }) => {
  await transactionsPage.navigate('/transactions');
  
  await transactionsPage.openAddBalanceModal();
  await page.getByPlaceholder('Enter sum').fill('1e+21');
  await page.locator('.modal').getByRole('button', { name: 'Add' }).click();


  await expect(page.locator('.modal')).toBeHidden();
  await page.goto('/transactions');

  const finalBalance = await page.locator('header').getByText(/Balance:/).innerText();

  expect(finalBalance).not.toMatch(/e\+/);
});

});















