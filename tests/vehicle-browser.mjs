import { chromium, expect } from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
const page=await browser.newPage();
await page.goto('http://localhost:3000/vehicles');
const count=page.getByLabel('Passengers (excluding driver)');
await expect(page.locator('.vehicle-card')).toHaveCount(4);
await count.fill('16');await expect(page.locator('.vehicle-card')).toHaveCount(3);
await expect(page.locator('.vehicle-card h3')).toHaveText(['29 Seater Bus','35 Seater Bus','55 Seater Bus']);
await count.fill('30');await expect(page.locator('.vehicle-card')).toHaveCount(2);
await count.fill('1');await page.getByLabel('Journey type').selectOption('lorry');
await expect(page.locator('.vehicle-card h3')).toHaveText(['KAMA 1–3T Mini Truck','Enclosed Goods Lorry']);
await expect(page.locator('.vehicle-card img').first()).toHaveJSProperty('naturalWidth',1200);
await page.setViewportSize({width:390,height:844});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw Error('Mobile overflow');
await page.locator('.vehicle-card').first().getByRole('link').click();
await expect(page.locator('.desktop-trip-summary')).toContainText('KAMA 1–3T Mini Truck');
await page.getByRole('button',{name:'City ride',exact:true}).click();
await expect(page.locator('.desktop-trip-summary')).toContainText('Not selected');
console.log('Browser fleet filtering, KAMA asset, selection propagation/reset and mobile overflow checks passed.');
} finally {await browser.close();}
