const puppeteer = require('puppeteer');
const { app } = require('../../src/app');
const pool = require('../../src/config/database');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('E2E Tests - Inventory System', () => {
  let browser;
  let page;
  let server;
  const PORT = 3000;
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    server = await new Promise((resolve) => {
      const s = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        resolve(s);
      });
    });

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  }, 30000);

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
    await pool.end();
  });

  beforeEach(async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  });

  test('should load the main page correctly', async () => {
    const headerText = await page.$eval('header h1', el => el.textContent);
    expect(headerText).toContain('Sistema de Inventario');

    const categoryForm = await page.$('#category-form');
    const productForm = await page.$('#product-form');
    
    expect(categoryForm).not.toBeNull();
    expect(productForm).not.toBeNull();
  }, 15000);

  test('should create a new category', async () => {
    const categoryName = 'Test Category ' + Date.now();
    
    await page.type('#category-name', categoryName);
    await page.click('#category-btn');
    
    await page.waitForSelector('.notification.success.show', { timeout: 5000 });
    await delay(1000);
    
    const listText = await page.$eval('#categories-list', el => el.textContent);
    expect(listText).toContain(categoryName);
  }, 15000);

  test('should create a new product', async () => {
    const productName = 'Test Product ' + Date.now();
    
    await page.type('#product-name', productName);
    await page.type('#product-price', '99.99');
    await page.$eval('#product-stock', el => el.value = '');
    await page.type('#product-stock', '25');
    
    await page.click('#product-btn');
    
    await page.waitForSelector('.notification.success.show', { timeout: 5000 });
    await delay(1000);
    
    const tableText = await page.$eval('#products-list', el => el.textContent);
    expect(tableText).toContain(productName);
  }, 15000);

  test('should complete full flow: create category, create product, view in list', async () => {
    const timestamp = Date.now();
    const categoryName = 'Electronics ' + timestamp;
    const productName = 'Laptop ' + timestamp;

    await page.type('#category-name', categoryName);
    await page.click('#category-btn');
    await page.waitForSelector('.notification.success.show', { timeout: 5000 });
    await delay(1500);

    await page.type('#product-name', productName);
    await page.type('#product-price', '1299.99');
    await page.$eval('#product-stock', el => el.value = '');
    await page.type('#product-stock', '10');
    
    await delay(500);
    await page.select('#product-category', await page.$$eval('#product-category option', (options, catName) => {
      const opt = options.find(o => o.textContent.includes(catName));
      return opt ? opt.value : '';
    }, categoryName));

    await page.click('#product-btn');
    await page.waitForSelector('.notification.success.show', { timeout: 5000 });
    await delay(1000);

    const tableText = await page.$eval('#products-list', el => el.textContent);
    expect(tableText).toContain(productName);
    expect(tableText).toContain(categoryName);
  }, 30000);

  test('should delete a product', async () => {
    const productName = 'ToDelete ' + Date.now();

    await page.type('#product-name', productName);
    await page.type('#product-price', '50');
    await page.$eval('#product-stock', el => el.value = '');
    await page.type('#product-stock', '5');
    await page.click('#product-btn');
    
    await page.waitForSelector('.notification.success.show', { timeout: 5000 });
    await delay(1000);

    let tableText = await page.$eval('#products-list', el => el.textContent);
    expect(tableText).toContain(productName);

    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    const rows = await page.$$('#products-list tr');
    for (const row of rows) {
      const text = await row.evaluate(el => el.textContent);
      if (text.includes(productName)) {
        const deleteBtn = await row.$('.btn-delete');
        await deleteBtn.click();
        break;
      }
    }

    await page.waitForSelector('.notification.success.show', { timeout: 5000 });
    await delay(1000);

    tableText = await page.$eval('#products-list', el => el.textContent);
    expect(tableText).not.toContain(productName);
  }, 20000);
});