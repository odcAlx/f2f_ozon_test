import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profilePage';
import { RegisterPage } from '../pages/registerPage';
import { LoginPage } from '../pages/loginPage';

test('T16. Отображение информации в профиле', async ({ page }) => {

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

  const profilePage = new ProfilePage(page);
  await profilePage.navigate('/profile');


  const nameProfile = await profilePage.getName();
  const surnameProfile = await profilePage.getSurname();
  const emailProfile = await profilePage.getEmail();

  expect(nameProfile).not.toBe('');
  expect(surnameProfile).not.toBe('');
  expect(emailProfile).not.toBe('');
  
});



