import { BasePage } from './basePage';

export class TransferPage extends BasePage {

  private readonly phoneInput = this.page.getByPlaceholder('+7 999 123-45-67');
  private readonly amountInput = this.page.getByPlaceholder('0.00');
  private readonly purposeInput = this.page.getByPlaceholder('e.g. debt repayment');
  private readonly sendButton = this.page.getByRole('button', { name: 'Send' });
  private readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });

  async transfer(phone: string, amount: string, purpose: string) {

    await this.phoneInput.fill(phone);
    await this.amountInput.fill(amount);
    await this.purposeInput.fill(purpose);
    await this.sendButton.click();

  }

  async cancel() {

    await this.cancelButton.click();

  }

  async getBalanceText(): Promise<string> {

    return this.page.getByText(/Balance:/).innerText();

  }
}