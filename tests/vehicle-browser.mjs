import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
const root=path.resolve('out');
const server=createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
  const body=await readFile(file);
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.xml':'application/xml','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.txt':'text/plain'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(body);
 } catch {res.writeHead(404).end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.goto(origin+'/vehicles/');
 await expect(page.locator('.vehicle-card')).toHaveCount(13);
 await expect(page.locator('.fleet-filters')).toHaveCount(0);
 await expect(page.locator('.vehicle-card h3')).toContainText(['Suzuki Alto','Suzuki Wagon R','Toyota Aqua','Suzuki Every','Non-AC Van','KDH Van · 9 Seater','KDH High Roof · 14 Seater','29 Seater Bus','35 Seater Bus','55 Seater Bus','Luxury Wedding Car','KAMA 1–3T Mini Truck','Enclosed Goods Lorry']);
 await page.goto(origin+'/plan-ride/');
 await page.getByLabel('Passengers',{exact:true}).fill('30');
 await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Vehicles',exact:true}).click();
 await expect(page.locator('.vehicle-card')).toHaveCount(13);
 await page.locator('.vehicle-card').first().getByRole('link',{name:'Plan your ride'}).click();
 await expect(page.getByLabel('Passengers',{exact:true})).toHaveValue('30');
 await page.goto(origin+'/');
 await expect(page.locator('.vehicle-card')).toHaveCount(13);
 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+'/vehicles/');await expect(page.locator('.vehicle-card')).toHaveCount(13);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile overflow');
 console.log('PASS: full 13-vehicle catalog on homepage and Vehicles page, unaffected by planner state; planning links preserve passenger count; mobile layout fits.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
