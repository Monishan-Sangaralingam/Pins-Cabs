import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true });
 const page = await browser.newPage();
 const requests = [];
 await page.route('https://photon.komoot.io/**', async route => {
  const url = new URL(route.request().url()); requests.push(url);
  const q = url.searchParams.get('q');
  if(q === 'network') return route.fulfill({status:503,body:'Unavailable'});
  if(q === 'empty') return route.fulfill({json:{features:[]}});
  if(q === 'slow') await new Promise(resolve => setTimeout(resolve, 2000));
  await route.fulfill({json:{features:[{geometry:{coordinates:[80.2168,6.026]},properties:{name:q,city:'Galle',country:'Sri Lanka',countrycode:'LK'}}]}});
 });
 await page.route('https://nominatim.openstreetmap.org/**', async route => {
  const url = new URL(route.request().url()); requests.push(url);
  if(url.searchParams.get('q') === 'network') return route.fulfill({status:503,body:'Unavailable'});
  if(url.searchParams.get('q') === 'empty') return route.fulfill({json:[]});
  const place = {name:url.searchParams.get('q') || 'Wakwella Road',display_name:`${url.searchParams.get('q') || 'Wakwella Road'}, Galle, Sri Lanka`,lat:'6.026',lon:'80.2168'};
  await route.fulfill({json:url.pathname.includes('reverse') ? place : [place]});
 });
 await page.route('https://tile.openstreetmap.org/**', route => route.abort());
 await page.goto('http://localhost:3000');
 await page.getByRole('button',{name:'Pickup location',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 for(const width of [320,360,375,390,393,412,430,768,1280]){
  await page.setViewportSize({width,height:844});
  assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`Dialog overflow at ${width}`);
 }
 await page.setViewportSize({width:390,height:844});
 const input=page.getByLabel('Search pickup location',{exact:true});
 await input.fill('Ga'); await page.waitForTimeout(600); assert.equal(requests.length,0); await expect(page.getByRole('button',{name:'Search',exact:true})).toBeDisabled();
 for(const name of ['Galle','Colombo','Matara','Negombo','Kandy','Bandaranaike International Airport','Galle Railway Station']){
  await input.fill(name); await expect(page.locator('.location-result')).toHaveCount(1);
  await expect(page.locator('.location-result b')).toHaveText(name.toLowerCase());
 }
 assert(requests.filter(u=>u.hostname==='photon.komoot.io').every(u=>u.searchParams.get('countrycode')==='LK'&&u.searchParams.get('limit')==='5'));
 // Rapid typing makes one request; old in-flight responses cannot replace the new query.
 const startCount = requests.length;
 await input.fill('Wel'); await input.fill('Welig'); await input.fill('Weligama');
 await expect(page.locator('.location-result b')).toHaveText('weligama');
 assert.equal(requests.length, startCount + 1);
 await input.fill('slow'); await expect.poll(()=>requests.some(u=>u.searchParams.get('q')==='slow')).toBe(true);
 await input.fill('Matara'); await expect(page.locator('.location-result b')).toHaveText('matara');
 await page.waitForTimeout(2200); await expect(page.locator('.location-result b')).toHaveText('matara');
 assert(!requests.some(u=>u.hostname==='nominatim.openstreetmap.org' && u.pathname.includes('search')));
 await input.fill('Galle'); const count=requests.length;await page.getByRole('button',{name:'Search',exact:true}).click();await expect(page.locator('.location-result')).toHaveCount(1);assert.equal(requests.length,count,'Cached search should not request again');
 await page.locator('.location-result').click();await expect(page.locator('.leaflet-container')).toBeVisible();await page.getByRole('button',{name:'Confirm pickup',exact:true}).click();
 await expect(dialog).toHaveCount(0);
 await page.getByRole('button',{name:'Destination',exact:true}).click();
 await page.getByLabel('Search destination location',{exact:true}).fill('empty');await page.getByRole('button',{name:'Search',exact:true}).click();await expect(page.getByText('No locations found.',{exact:false})).toBeVisible();
 await page.getByLabel('Search destination location',{exact:true}).fill('network');await page.getByRole('button',{name:'Search',exact:true}).click();await expect(page.getByRole('button',{name:'Try again',exact:true})).toBeVisible();
 for(const [code,message] of [[1,'Location permission was denied.'],[2,"We couldn't detect your current location."],[3,'Location detection took too long.']]){
  await page.evaluate(code=>{navigator.geolocation.getCurrentPosition=(_,fail)=>fail({code});},code);
  await page.getByRole('button',{name:'Use my current location'}).click();await expect(page.getByText(message,{exact:false})).toBeVisible();
 }
 await page.evaluate(()=>{navigator.geolocation.getCurrentPosition=success=>success({coords:{latitude:6.04,longitude:80.22}});});
 await page.getByRole('button',{name:'Use my current location'}).click();await expect(page.getByRole('button',{name:'Confirm destination',exact:true})).toBeEnabled({timeout:15000});
 await page.locator('.leaflet-container').focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('button',{name:'Confirm destination',exact:true})).toBeEnabled({timeout:15000});
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();await expect(page.getByRole('button',{name:'Confirm destination',exact:true})).toBeEnabled({timeout:15000});
 await page.screenshot({path:'qa/location-mobile.png'});
 await page.getByRole('button',{name:'Confirm destination',exact:true}).click();
 await page.getByRole('button',{name:'Show pickup & destination map'}).click();await expect(page.locator('.location-marker-P')).toHaveCount(1);await expect(page.locator('.location-marker-D')).toHaveCount(1);
 await page.getByRole('button',{name:'Find my ride'}).click();await expect(page).toHaveURL(/plan-ride/);await expect(page.getByRole('button',{name:'Clear pickup location'})).toBeVisible();
 const before=await page.locator('.location-field-trigger').allTextContents();await page.getByRole('button',{name:'Swap pickup and destination'}).click();assert.deepEqual(await page.locator('.location-field-trigger').allTextContents(),before.reverse());
 await page.getByRole('button',{name:'Clear destination',exact:true}).click();await expect(page.getByRole('button',{name:'Show pickup & destination map'})).toHaveCount(0);
 await page.getByRole('button',{name:'Destination',exact:true}).click();await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(page.getByRole('button',{name:'Destination',exact:true})).toBeFocused();
 await browser.close();console.log('PASS: responsive widths, seven search terms, autocomplete/debounce/cancellation, explicit search, cache, empty/network results, all GPS states, map pan/zoom/confirmation, markers, navigation, swap, clear, Escape/focus.');
})().catch(error=>{console.error(error);process.exit(1)});

