import { BasePage } from './basePage';

export class LoginPage extends BasePage {

  private readonly emailInput = this.page.getByPlaceholder('Type your email');
  private readonly passwordInput = this.page.getByPlaceholder('Type your password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly registerLink = this.page.getByText('Register page');

  async login(email: string, password: string) {

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

  }

  async goToRegister() {

    await this.registerLink.click();

  }
}

