import AxeBuilder from '@axe-core/playwright';
import { expect, test } from "@playwright/test";
import { InsurancePage } from "../pages/insurancePage";
import { APIEndpoints } from "../pages/APIEndpoints";

// Test 1: Verify yearly insurance premium calculation
// Steps:
// 1. Navigate to the insurance page
// 2. Fill in the insurance form with valid data
// 3. Calculate the yearly price
// Expected result: The yearly premium should be 1260

test("Buy insurance: calculate yearly price", async ({ page }) => {
  const insurancePage = new InsurancePage(page);
  await insurancePage.goto();
  
  await insurancePage.fillForm({
    name: "Linnea",
    surname: "Andersson",
    address: "Årevägen 123",
    size: "50",
    adults: "2",
    kids: "2",
    coverage: "50%"
  });

  await insurancePage.calculatePrice();
  await insurancePage.verifyYearlyPrice("1260");
});

// Test 2: Verify monthly insurance premium calculation
// Steps:
// 1. Navigate to the insurance page
// 2. Fill in the insurance form with valid data
// 3. Calculate the monthly price
// Expected result: The monthly premium should be 105

test("Buy insurance: calculate monthly price", async ({ page }) => {
  const insurancePage = new InsurancePage(page);
  await insurancePage.goto();
  
  await insurancePage.fillForm({
    name: "Linnea",
    surname: "Andersson",
    address: "Årevägen 123",
    size: "50",
    adults: "2",
    kids: "2",
    coverage: "50%"
  });

  await insurancePage.calculatePrice();
  await insurancePage.verifyMonthlyPrice("105");
});

// Test 3: Fetch product list via API and validate a product's details
// Steps:
// 1. Fetch the product list and check for a 200 OK response
// 2. Ensure the list contains products
// 3. Find the product "Toy Train" and ensure it exists
// 4. Fetch price details for "Toy Train" and validate name, price, and VAT

test("API: Fetch product list and validate a product's details", async ({ request }) => {
  const productListResponse = await request.get(APIEndpoints.productList);
  expect(productListResponse.ok()).toBeTruthy();
  
  const productList = await productListResponse.json();
  expect(Array.isArray(productList.products)).toBeTruthy();
  expect(productList.products.length).toBeGreaterThan(0);
  
  const toyTrainProduct = productList.products.find((product) => product.name === "Toy Train");
  expect(toyTrainProduct).toBeDefined();
  
  const productPriceResponse = await request.get(`${APIEndpoints.productPrice}/${toyTrainProduct.id}`);
  expect(productPriceResponse.ok()).toBeTruthy();
  
  const productPrice = await productPriceResponse.json();
  expect(productPrice.name).toBe("Toy Train");
  expect(productPrice.price).toBe(399);
  expect(productPrice.vat).toBe(79.8);
});

// Test 4: Ensure insurance page has no accessibility issues
// Steps:
// 1. Navigate to the insurance page
// 2. Run accessibility scan using AxeBuilder
// Expected result: No accessibility violations should be reported

test("Accessibility: Ensure insurance page has no accessibility issues", async ({ page }) => {
  const insurancePage = new InsurancePage(page);
  await insurancePage.goto();
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  await expect(accessibilityScanResults.violations).toEqual([]);
});

// Test 5: Ensure invalid input disables the calculate button
// Steps:
// 1. Navigate to the insurance page
// 2. Fill in the form with invalid data
// Expected result: The "Calculate" button should be disabled

test("Make sure invalid data equals disabled calculate button", async ({ page }) => {
  const insurancePage = new InsurancePage(page);
  await insurancePage.goto();
  
  await insurancePage.fillForm({
    name: "123456",
    surname: "123456",
    address: " ",
    size: "b",
    adults: "",
    kids: "i",
    coverage: "50%"
  });
  
  await expect(insurancePage.calculateButton).toBeDisabled();
});