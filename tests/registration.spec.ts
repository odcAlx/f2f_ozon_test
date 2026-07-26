import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';

test.describe('Регистрация (T1–T4)', () => {

  const password = 'Пароль';
  const name = 'Саша';
  const surname = 'Одинцов';

  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {

    registerPage = new RegisterPage(page);
    await registerPage.navigate('/register');

  });

  test('T1. Успешная регистрация', async ({ page }) => {

    const email = `test_${Date.now()}@mail.ru`;
    await registerPage.register(name, surname, email, password);
    await expect(page).toHaveURL(/.*login/);

  });

  test('T2. Регистрация на уже существующий Email', async ({ page }) => {

    const occupiedEmail = `test_${Date.now()}@mail.ru`;
    await registerPage.register('Первый', surname, occupiedEmail, password);
    await expect(page).toHaveURL(/.*login/);

    await registerPage.navigate('/register');
    await registerPage.register('Второй', surname, occupiedEmail, password);
    await expect(page).toHaveURL(/register/);
    await expect(page.getByText('User with this email already exists')).toBeVisible();

  });


  test.describe('T3. Пустые поля', () => {

    const cases: [string, string, string, string, string][] = [

      ['Пустое Name', '', surname, `test_${Date.now()}@mail.ru`, password],
      ['Пустое Surname', name, '', `test_${Date.now()}@mail.ru`, password],
      ['Пустой Email', name, surname, '', password],
      ['Пустой Password', name, surname, `test_${Date.now()}@mail.ru`, ''],

    ];

    for (const [desc, name, surname, email, password] of cases) {

      test(`Ошибка при: ${desc}`, async ({ page }) => {

        const registerPage = new RegisterPage(page);
        await registerPage.navigate('/register');
        await registerPage.register(name, surname, email, password);
        await expect(page).toHaveURL(/register/);

      });

    }
  });

  test.describe('T4. Невалидные данные', () => {
    const invalidCases: [string, string, string, string, string][] = [

      ['Имя = цифра', '123', surname, `test_${Date.now()}@mail.ru`, password],
      ['Имя = спецсимвол', '#', surname, `test_${Date.now()}@mail.ru`, password],
      ['Фамилия = цифра', name, '123', `test_${Date.now()}@mail.ru`, password],
      ['Фамилия = спецсимвол', name, '#', `test_${Date.now()}@mail.ru`, password],
      ['Email без домена', name, surname, `test_${Date.now()}@`, password],
      ['Email с неполным доменом', name, surname, `test_${Date.now()}@m`, password],
      ['Пароль = пробел', name, surname, `test_${Date.now()}@mail.ru`, ' '],

    ];

    for (const [desc, name, surname, email, password] of invalidCases) {

      test(`Ошибка при: ${desc}`, async ({ page }) => {

        const registerPage = new RegisterPage(page);
        await registerPage.navigate('/register');
        await registerPage.register(name, surname, email, password);


        await expect(page).toHaveURL('/register/');
        

      });
      
      
    };
    
    
  });

});












