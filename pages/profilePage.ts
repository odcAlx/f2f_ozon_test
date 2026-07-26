import { BasePage } from './basePage';

export class ProfilePage extends BasePage {

  private readonly nameField = this.page.locator('p', { hasText: 'Name:' }).first();
  private readonly surnameField = this.page.locator('p', { hasText: 'Surname:' }).first();
  private readonly emailField = this.page.locator('p', { hasText: 'Email:' }).first();

  async getName(): Promise<string> {

    const full = await this.nameField.innerText();
    return full.replace('Name:', '').trim();

  }

  async getSurname(): Promise<string> {

    const full = await this.surnameField.innerText();
    return full.replace('Surname:', '').trim();

  }

  async getEmail(): Promise<string> {

    const full = await this.emailField.innerText();
    return full.replace('Email:', '').trim();
    
  }
}
