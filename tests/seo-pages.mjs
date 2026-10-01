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
  const response = await page.goto(origin+pathname);
  assert.equal(response.status(),200);
  assert.equal(new URL(url).origin,'https://www.pinscabs.com');
  assert(!new URL(url).search && pathname.endsWith('/'));
  for (const selector of ['title','meta[name=description]','link[rel=canonical]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','meta[property="og:image"]','meta[name="twitter:card"]']) await expect(page.locator(selector)).toHaveCount(1);
  assert(!await page.locator('meta[name=robots]').evaluateAll(nodes=>nodes.some(n=>/noindex|nofollow/.test(n.content))));
  assert.equal(await page.locator('script[src*="googletagmanager.com"]').count(),0);
  for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) { const data=JSON.parse(json); assert.equal(data['@context'],'https://schema.org'); }
  const assets=await page.locator('img,link[rel=icon],link[rel=apple-touch-icon],meta[property="og:image"],meta[name="twitter:image"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')||n.getAttribute('href')||n.getAttribute('content')));
  for(const asset of assets){const assetPath=new URL(asset,origin).pathname; await readFile(path.join(root,assetPath));}
  await expect(page.locator('img:not([alt])')).toHaveCount(0);
  for(const href of await page.locator('a[href^="/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')))){const target=new URL(href,origin).pathname;await readFile(path.join(root,target,'index.html'));}
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',url);
  const title=await page.title();assert(!titles.has(title),'Duplicate title: '+title);titles.add(title);
  const desc=await page.locator('meta[name=description]').getAttribute('content');assert(desc&&!descriptions.has(desc),'Duplicate/missing description: '+pathname);descriptions.add(desc);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',url);
  const html=await readFile(path.join(root,pathname,'index.html'),'utf8');assert(html.includes('<h1'),'Missing static content');
  const staticHead=await page.evaluate(html=>{const doc=new DOMParser().parseFromString(html,'text/html');return {canonical:doc.querySelector('link[rel=canonical]')?.getAttribute('href'),title:doc.title,description:doc.querySelector('meta[name=description]')?.getAttribute('content')};},html);
  assert.equal(staticHead.canonical,url);assert.equal(staticHead.title,title);assert.equal(staticHead.description,desc);
  for(const width of [390,1280]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow: '+pathname+' at '+width);}
 }
 const robots=await page.request.get(origin+'/robots.txt');assert.equal(robots.status(),200);assert((await robots.text()).includes('Sitemap: https://www.pinscabs.com/sitemap.xml'));
 const sitemapResponse=await page.request.get(origin+'/sitemap.xml');assert.equal(sitemapResponse.status(),200);assert(sitemapResponse.headers()['content-type'].includes('xml'));
 assert(await page.evaluate(xml=>!new DOMParser().parseFromString(xml,'application/xml').querySelector('parsererror'),xml));
 await page.goto(origin+'/');
 const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];assert.equal(graph.length,2);assert.equal(graph[1].provider['@id'],graph[0]['@id']);assert.equal(graph[0].telephone,'+94728000400');
 await expect(page.locator('h1')).toHaveText('Taxi Service in Wattala & Colombo');
 await expect(page.locator('.hero-slogan')).toHaveText('Ride smarter.Arrive better.');
 await page.setViewportSize({width:390,height:844});await page.locator('.hero-image').evaluate(img=>img.decode());await page.waitForTimeout(1100);await page.screenshot({path:'qa/seo-home-mobile.png'});
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'Open menu',exact:true})).toBeFocused();
 assert((await page.locator('a[href^="tel:"]').first().getAttribute('href'))==='tel:+94728000400');
 const missing=await page.request.get(origin+'/missing-seo-test/');assert.equal(missing.status(),404);
 assert((await readFile('out/404.html','utf8')).includes('noindex'));
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
 await page.route('https://photon.komoot.io/**',route=>{const q=new URL(route.request().url()).searchParams.get('q');return route.fulfill({json:{features:[{geometry:{coordinates:q.toLowerCase()==='wattala'?[79.9,6.98]:[79.87,6.93]},properties:{name:q,country:'Sri Lanka',countrycode:'LK'}}]}});});
 await page.route('https://tile.openstreetmap.org/**',route=>route.abort());
 await page.goto(origin+'/plan-ride/');
 for(const [kind,name] of [['pickup','Wattala'],['destination','Colombo']]){
  await page.getByRole('button',{name:kind==='pickup'?'Pickup location':'Destination',exact:true}).click();
  await page.getByLabel('Search '+kind+' location',{exact:true}).fill(name);
  await page.locator('.location-result').first().click();
  await page.getByRole('button',{name:'Confirm '+kind,exact:true}).click();
 }
 await page.getByLabel('Pickup date',{exact:true}).fill('2030-01-01');await page.getByLabel('Pickup time',{exact:true}).fill('10:00');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.waitForTimeout(600);
 await page.getByRole('button',{name:'Request a suitable vehicle',exact:true}).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await page.getByRole('button',{name:'Request a suitable vehicle',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Your name',{exact:true}).fill('SEO Test');await page.getByLabel('Phone number',{exact:true}).fill('+94770000000');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 const whatsapp=new URL(await page.getByRole('link',{name:'Continue to WhatsApp'}).getAttribute('href'));
 assert.equal(whatsapp.hostname,'wa.me');assert.equal(whatsapp.pathname,'/94728000400');assert(whatsapp.searchParams.get('text').includes('SEO Test'));assert(whatsapp.searchParams.get('text').toLowerCase().includes('wattala'));
 console.log('PASS: complete mobile enquiry flow and verified WhatsApp handoff URL (no message sent).');
 console.log('PASS: 19 static pages, unique titles/descriptions, canonical/social URLs, nine service links, mobile/desktop overflow, and airport/bus/lorry booking preselection.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
