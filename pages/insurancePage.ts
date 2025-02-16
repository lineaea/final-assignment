import { Page, Locator, expect } from "@playwright/test";

export class InsurancePage {
    public page: Page;
    public nameInput: Locator;
    public surnameInput: Locator;
    public addressInput: Locator;
    public sizeInput: Locator;
    public adultsInput: Locator;
    public kidsInput: Locator;
    public coverageSelect: Locator;
    public calculateButton: Locator;
    public yearlyPrice: Locator;
    public monthlyPrice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator("#inputName");
        this.surnameInput = page.locator("#inputSurname");
        this.addressInput = page.locator("#inputAddress");
        this.sizeInput = page.locator("#inputSize");
        this.adultsInput = page.locator("#inputAdults");
        this.kidsInput = page.locator("#inputKids");
        this.coverageSelect = page.locator("#inputCoverage");
        this.calculateButton = page.locator("#calcPriceBtn");
        this.yearlyPrice = page.locator("#yearly");
        this.monthlyPrice = page.locator("#monthly");
    }

    async goto(): Promise<void> {
        await this.page.goto("https://hoff.is/insurance");
    }

    async fillForm(data: {
        name: string;
        surname: string;
        address: string;
        size: string;
        adults: string;
        kids: string;
        coverage: string;
    }): Promise<void> {
        await this.nameInput.fill(data.name);
        await this.surnameInput.fill(data.surname);
        await this.addressInput.fill(data.address);
        await this.sizeInput.fill(data.size);
        await this.adultsInput.fill(data.adults);
        await this.kidsInput.fill(data.kids);
        await this.coverageSelect.selectOption(data.coverage);
    }

    async calculatePrice(): Promise<void> {
        await this.calculateButton.click();
    }

    async verifyYearlyPrice(expectedPrice: string): Promise<void> {
        await expect(this.yearlyPrice).toHaveText(expectedPrice);
    }

    async verifyMonthlyPrice(expectedPrice: string): Promise<void> {
        await expect(this.monthlyPrice).toHaveText(expectedPrice);
    }
}
