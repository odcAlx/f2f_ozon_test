import { BasePage } from './basePage';

export class RegisterPage extends BasePage {

  private readonly nameInput = this.page.getByPlaceholder('Type your name');
  private readonly surnameInput = this.page.getByPlaceholder('Type your surname');
  private readonly emailInput = this.page.getByPlaceholder('Type your email');
  private readonly passwordInput = this.page.getByPlaceholder('Type your message...');
  private readonly registerButton = this.page.getByRole('button', { name: ' Register ' });

  async register(name: string, surname: string, email: string, password: string) {

    await this.nameInput.fill(name);
    await this.surnameInput.fill(surname);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();

  }
}

