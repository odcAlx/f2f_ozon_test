import { test, expect } from '@playwright/test';
import { TransferPage } from '../pages/transferPage';
import { TransactionsPage } from '../pages/transactionsPage';
import { RegisterPage } from '../pages/registerPage';
import { LoginPage } from '../pages/loginPage';

test.describe('Переводы (T10–T13, T25)', () => {

  let registerPage: RegisterPage;
  let loginPage: LoginPage;
  let transferPage: TransferPage;
  let transactionsPage: TransactionsPage;

  test.beforeEach(async ({ page }) => {

    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    transferPage = new TransferPage(page);
    transactionsPage = new TransactionsPage(page);
  
    const email = `user_${Date.now()}@mail.ru`;
    
  
    await registerPage.navigate('/register');
    await registerPage.register('Саша', 'Одинцов', email, 'Пароль');
  
    await expect(page).toHaveURL(/.*login/);
  
  
    await loginPage.login(email, 'Пароль');
    
  
    await expect(page.getByPlaceholder('+7 999 123-45-67')).toBeVisible();
  
  
    await expect(page.locator('header').getByText(/Balance:/)).toBeVisible();

  });

  test('T10. Успешный перевод', async ({ page }) => {

    await transactionsPage.navigate('/transactions');
    await transactionsPage.addBalance('100');

    await transferPage.navigate('/');
    await transferPage.transfer('+7 999 123-45-67', '10', 'Тест');
    await expect(page.getByText('Transfer completed successfully')).toBeVisible();
    
  });

  test.describe('T11. Пустые поля', () => {

    const emptyCases: [string, string, string, string][] = [

      ['Пустой номер', '', '10', 'Тест'],
      ['Пустая сумма', '+7 999 123-45-67', '', 'Тест'],
      ['Пустое назначение', '+7 999 123-45-67', '10', ''],

    ];

    for (const [desc, phone, amount, purpose] of emptyCases) {

      test(`Ошибка при: ${desc}`, async ({ page }) => {
        await transferPage.navigate('/');
        await transferPage.transfer(phone, amount, purpose);
        await expect(page).toHaveURL('/');

      });
    }

  });

  test.describe('T12. Невалидные данные', () => {

    const invalidCases: [string, string, string, string][] = [
      ['Номер без +', '79991234567', '10', 'Тест'],
      ['Короткий номер', '+712345678', '10', 'Тест'],
      ['Длинный номер', '+7999123456789012', '10', 'Тест'],
      ['Номер с буквой', '+7999123456a', '10', 'Тест'],
      ['Сумма 0', '+7 999 123-45-67', '0', 'Тестt'],
      ['Отрицательная сумма', '+7 999 123-45-67', '-10', 'Тест'],
      ['Сумма > баланса', '+7 999 123-45-67', '200', 'Тест'],

    ];

    for (const [desc, phone, amount, purpose] of invalidCases) {

      test(`Ошибка при: ${desc}`, async ({ page }) => {
        await transferPage.navigate('/');
        await transferPage.transfer(phone, amount, purpose);


        await expect(page.locator('.success-text')).not.toBeVisible();
      });
    }
  });

  test('T13. Валидация знаков после запятой при переводе', async ({ page }) => {


    await transferPage.navigate('/');
    await transferPage.transfer('+7 999 123-45-67', '0.001', 'Тест');
    await expect(page).toHaveURL('/');
    
  });

  test('T25. Проверка точности вычислений (0.99 - 0.98 = 0.01)', async ({ page }) => {


    await transactionsPage.navigate('/transactions');
    await transactionsPage.addBalance('0.99');

    await transferPage.navigate('/');
    await transferPage.transfer('+7 999 123-45-67', '0.98', 'Test');
    await expect(page.getByText('Transfer completed successfully')).toBeVisible();

    const balanceText = await transferPage.getBalanceText();

    expect(balanceText).toBe('0.01');
  });
});
















