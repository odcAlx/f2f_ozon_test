import { BasePage } from './basePage';

export class TransactionsPage extends BasePage {

  private readonly addBalanceButton = this.page.getByRole('button', { name: 'Add balance' });
  private readonly amountInput = this.page.getByPlaceholder('Enter sum');
  private readonly confirmAddButton = this.page.locator('.confirm-btn');
  private readonly cancelAddButton = this.page.getByRole('button', { name: 'Cancel' });
  private readonly transactionsTable = this.page.locator('table');

  async openAddBalanceModal() {

    await this.addBalanceButton.click();

  }

  async addBalance(amount: string) {

    await this.openAddBalanceModal();
    await this.amountInput.fill(amount);
    await this.confirmAddButton.click();

  }

  async cancelAddBalance() {

    await this.openAddBalanceModal();
    await this.cancelAddButton.click();

  }

  async isModalClosed(): Promise<boolean> {

    return this.page.locator('dialog').isHidden();

  }

  async getLastTransactionType(): Promise<string> {

    const rows = this.transactionsTable.locator('tr');
    const lastRow = rows.last();
    const typeCell = lastRow.locator('td').nth(2);
    return typeCell.innerText();

  }
}
