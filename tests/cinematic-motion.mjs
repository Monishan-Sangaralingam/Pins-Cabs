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
 const { writeFile } = await import('node:fs/promises');
 const record=process.argv.includes('--record');
 const xml=await readFile('out/sitemap.xml','utf8');
 const paths=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 const baseline={};
 const page=await browser.newPage({javaScriptEnabled:false,reducedMotion:'reduce'});
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:900});
  for(const pathname of paths){
   await page.goto(origin+pathname);
   baseline[width+pathname]=await page.locator('body').evaluate(body=>({
    text:body.innerText,
    links:[...body.querySelectorAll('a')].map(a=>a.getAttribute('href')),
    geometry:[...body.querySelectorAll('.header-inner,main>*,h1,h2,.hero-slogan,.hero-actions,.service-card,.vehicle-card,.footer-top')].map(el=>{const r=el.getBoundingClientRect();return [el.className,Math.round(r.x*10)/10,Math.round(r.y*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10]})
   }));
  }
 }
 await page.close();
 if(record){await writeFile('qa/motion-baseline.json',JSON.stringify(baseline,null,2));console.log('Recorded 19-route content, links and geometry at mobile/desktop sizes.');}
 else {
  assert.deepEqual(baseline,JSON.parse(await readFile('qa/motion-baseline.json','utf8')),'Content or resting layout changed');
  console.log('PASS: identical content, links and resting geometry on all 19 routes at mobile and desktop sizes.');
  const live=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];live.on('pageerror',error=>errors.push(error.message));
  await live.goto(origin+'/');
  assert.equal(await live.locator('.hero-slogan > em').evaluate(el=>getComputedStyle(el).animationName),'cinema-title');
  assert.equal(await live.locator('.header-inner > .brand-logo').evaluate(el=>getComputedStyle(el).animationName),'cinema-header');
  await live.locator('.hero-image').evaluate(img=>img.decode());await live.waitForTimeout(2000);
  await live.screenshot({path:'qa/cinematic-home-desktop.png'});
  await live.evaluate(()=>window.scrollTo({top:300,behavior:'instant'}));await live.waitForTimeout(100);
  assert.match(await live.locator('.hero > picture').getAttribute('style'),/translate3d/);
  await live.locator('.services-section').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await expect.poll(()=>live.locator('.service-card').evaluateAll(els=>els.some(el=>el.getAnimations().some(a=>a instanceof Animation)))).toBe(true);
  await live.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>live.locator('.service-card').evaluateAll(els=>els.reduce((sum,el)=>sum+el.getAnimations().length,0))).toBe(0);
  assert.equal(await live.locator('.hero > picture').evaluate(el=>getComputedStyle(el).transform),'none');
  await live.locator('button[aria-label="Back to top"]').click();
  await expect.poll(()=>live.evaluate(()=>window.scrollY)).toBe(0);
  await live.emulateMedia({reducedMotion:'no-preference'});
  await live.setViewportSize({width:390,height:844});await live.goto(origin+'/');await live.waitForTimeout(1600);
  await live.screenshot({path:'qa/cinematic-home-mobile.png'});
  await live.getByRole('button',{name:'Open menu',exact:true}).click();
  await expect(live.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
  await live.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Services',exact:false}).click();
  await expect(live).toHaveURL(/services/);
  assert.equal(await live.locator('.subpage-hero h1').evaluate(el=>getComputedStyle(el).animationName),'cinema-title');
  await live.waitForTimeout(1100);await live.screenshot({path:'qa/cinematic-services-mobile.png'});
  await live.goto(origin+'/#how-it-works');
  await expect(live.locator('#how-it-works h2')).toBeVisible();
  assert.equal(await live.locator('#how-it-works .how-intro').evaluate(el=>getComputedStyle(el).opacity),'1');
  await live.emulateMedia({reducedMotion:'reduce'});await live.goto(origin+'/');
  for(const selector of ['.hero-image','.hero-slogan > em','.header-inner > .brand-logo']) assert.equal(await live.locator(selector).evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.deepEqual(errors,[]);await live.close();
  console.log('PASS: header/hero direction, scroll reveals, desktop camera, live reduced-motion switching, immediate back-to-top, mobile navigation, subpage entrance, anchor access and no browser errors.');
 }
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
