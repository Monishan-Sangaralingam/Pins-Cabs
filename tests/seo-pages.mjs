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
 const xml=await readFile('out/sitemap.xml','utf8');
 const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
 assert.equal(urls.length,19);assert.equal(new Set(urls).size,19);
 const page=await browser.newPage();
 const titles=new Set();const descriptions=new Set();
 for(const url of urls){
  const pathname=new URL(url).pathname;
  await page.goto(origin+pathname);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',url);
  const title=await page.title();assert(!titles.has(title),'Duplicate title: '+title);titles.add(title);
  const desc=await page.locator('meta[name=description]').getAttribute('content');assert(desc&&!descriptions.has(desc),'Duplicate/missing description: '+pathname);descriptions.add(desc);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',url);
  const html=await readFile(path.join(root,pathname,'index.html'),'utf8');assert(html.includes('<h1'),'Missing static content');
  for(const width of [390,1280]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow: '+pathname+' at '+width);}
 }
 await page.goto(origin+'/services/');
 const serviceLinks=await page.locator('nav[aria-label="All transport services"] a').evaluateAll(links=>links.map(link=>link.pathname));
 assert.equal(new Set(serviceLinks).size,9);
 for(const service of ['airport','long-trip','lorry']){
  const slug={airport:'airport-transfer','long-trip':'bus-hire',lorry:'lorry-transport'}[service];
  await page.goto(origin+'/'+slug+'/');
  const href=await page.getByRole('link',{name:'Plan this journey',exact:true}).getAttribute('href');
  assert(href.includes('service='+service));
  await page.goto(origin+href.replace('/plan-ride?','/plan-ride/?'));
  const label={airport:'Airport transfer','long-trip':'Bus hire',lorry:'Lorry transport'}[service];
  await expect(page.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true');
 }
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/airport-transfer/');await page.waitForTimeout(600);await page.screenshot({path:'../qa-baseline/seo-airport-mobile.png',fullPage:true});await page.screenshot({path:'../qa-baseline/seo-airport-viewport.png'});
 console.log('PASS: 19 static pages, unique titles/descriptions, canonical/social URLs, nine service links, mobile/desktop overflow, and airport/bus/lorry booking preselection.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
