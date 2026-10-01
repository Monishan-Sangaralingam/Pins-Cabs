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
 const page=await browser.newPage();let requests=0;
 await page.route('https://www.googletagmanager.com/**',route=>{requests++;return route.fulfill({contentType:'application/javascript',body:'/* Stub: no tracking requests leave this test. */'});});
 await page.goto(origin+'/?private=do-not-track#private');
 await expect.poll(()=>page.evaluate(()=>window.dataLayer?.filter(entry=>entry[0]==='event'&&entry[1]==='page_view').length)).toBe(1);
 assert.equal(requests,1);
 await expect(page.locator('meta[name=google-site-verification]')).toHaveAttribute('content','seo-test-token');
 await page.locator('.hero-actions a').last().click();
 await expect.poll(()=>page.evaluate(()=>window.dataLayer.filter(entry=>entry[0]==='event'&&entry[1]==='page_view').length)).toBe(2);
 const calls=await page.evaluate(()=>window.dataLayer.map(entry=>Array.from(entry)));
 assert.equal(calls.filter(entry=>entry[0]==='config').length,1);
 assert.equal(calls.find(entry=>entry[0]==='config')[2].send_page_view,false);
 assert(!JSON.stringify(calls).includes('do-not-track'));
 const views=calls.filter(entry=>entry[0]==='event');
 assert.equal(views[0][2].page_location,'https://www.pinscabs.com/');
 assert.equal(views[1][2].page_location,'https://www.pinscabs.com/vehicles/');
 assert(views.every(entry=>entry[2].page_referrer===''));
 assert.equal(requests,1);
 console.log('PASS: optional GA initializes once, records one view per navigation, strips query/hash/referrer, and Search Console token renders once. Network stubbed.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
