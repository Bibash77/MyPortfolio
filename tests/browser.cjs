/* npm install --no-save playwright, or use an existing ancestor installation. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base=process.env.PORTFOLIO_URL||'http://127.0.0.1:8080';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 let assertions=0;const check=x=>{assert.ok(x);assertions++};const errors=[];
 const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 // Do not depend on Google fonts, favicon services, or technology icon CDNs for tests.
 await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
 for(const locale of ['en','ja']){
  await page.goto(base+'/'+locale+'/');await page.waitForSelector('#byte-trigger');
  check(await page.locator('html').getAttribute('lang')===locale);
  check((await page.locator('meta[name=description]').getAttribute('content')).includes(locale==='ja'?'ポートフォリオ':'Engineer'));
  check(await page.locator('.project-card').count()===18);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [375,768,1280,1920]){
   await page.setViewportSize({width,height:900});
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(await page.locator('nav').isVisible());
   await page.screenshot({path:`output/playwright/${locale}-${width}.png`});
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const term of ['Java','Spring Boot','AWS','Redis','バックエンド','マイクロサービス','官公庁','性能改善']){
   await page.locator('#projectSearch').fill(term);
   check(await page.locator('.project-card:not(.hidden)').count()>0);
   check(Number(await page.locator('#projectCount').innerText())===await page.locator('.project-card:not(.hidden)').count());
  }
  await page.locator('#projectSearch').fill('');
  await page.locator('[data-filter=poc]').click();const count=await page.locator('.project-card:not(.hidden)').count();
  await page.locator('[data-locale="'+(locale==='en'?'ja':'en')+'"]').click();check(await page.locator('.project-card:not(.hidden)').count()===count);
  await page.locator('[data-locale="'+locale+'"]').click();await page.locator('[data-filter=all]').click();
  await page.locator('#byte-trigger').click();check(await page.locator('dialog').evaluate(d=>d.open));check(await page.locator('.byte-close').evaluate(b=>b===document.activeElement));
  for(let i=0;i<12;i++){await page.keyboard.press('Tab');check(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));}
  for(const topic of ['about','projects','strengths','skills','recruiter','custom','connect']){
   await page.locator('[data-topic='+topic+']').click();
   if(topic==='connect'){
    check(await page.locator('.byte-contact a').count()===2);check((await page.locator('.byte-contact a').first().getAttribute('href')).includes('github.com'));
   }else{
    if(topic==='custom'){
     const input='<img src=x onerror=alert(1)> / 日本語\nExplain Java performance.';
     await page.locator('#byte-question').fill(input);await page.locator('#byte-question').press('/');
     check((await page.locator('#byte-question').inputValue()).endsWith('/'));
     check(await page.locator('#byte-question').evaluate(x=>x===document.activeElement));
    }
    await page.locator('.byte-preview summary').click();let text=await page.locator('#byte-prompt').inputValue();check(text.length>1000);
    await page.locator('#byte-language').selectOption(locale==='en'?'ja':'en');check((await page.locator('#byte-prompt').inputValue()).includes(locale==='en'?'回答言語\n日本語':'RESPONSE LANGUAGE\nEnglish'));
    await page.locator('.byte-copy').click();await page.waitForFunction(()=>document.querySelector('.byte-status').textContent.length>0);
    check((await page.locator('.byte-status').innerText())===(locale==='ja'?'コピーしました':'Copied!'));
    check((await page.evaluate(()=>navigator.clipboard.readText())).includes('Bibash Bogati'));
    await page.locator('#byte-language').selectOption(locale);
   }
   await page.locator('.byte-back').click();
  }
  await page.keyboard.press('Escape');check(!await page.locator('dialog').evaluate(d=>d.open));check(await page.locator('#byte-trigger').evaluate(b=>b===document.activeElement));
  await page.locator('#byte-trigger').click();await page.locator('[data-topic=custom]').click();await page.locator('#byte-question').fill('My exact question\n<test>');
  await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>Promise.reject(new Error('denied'))}));
  await page.locator('.byte-copy').click();await page.waitForFunction(()=>document.querySelector('.byte-preview').open);
  check((await page.locator('.byte-status').innerText()).includes(locale==='ja'?'手動':'manually'));check(await page.locator('#byte-prompt').evaluate(x=>x.selectionEnd===x.value.length));
  await page.setViewportSize({width:375,height:700});await page.screenshot({path:`output/playwright/${locale}-companion-mobile.png`});
  check(await page.locator('dialog').evaluate(d=>{let r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}));
  await page.locator('.byte-close').click();check(!await page.locator('dialog').evaluate(d=>d.open));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const section of ['experience','skills','projects','delivery']){await page.locator('nav a[href="#'+section+'"]').click();await page.waitForTimeout(100);check(await page.locator('#'+section+' h2').evaluate(h=>{const r=h.getBoundingClientRect();return r.top>=document.querySelector('.topbar').getBoundingClientRect().bottom&&r.top<innerHeight}));await page.screenshot({path:`output/playwright/${locale}-${section}-mobile.png`});}
  await page.reload();check(await page.locator('html').getAttribute('lang')===locale);
 }
 await context.close();
 // Auto-selection on static hosts, saved preference, unavailable storage, explicit URL conflicts.
 for(const [country,locale,stored,path,want] of [['JP','en-US',null,'/','ja'],['US','ja-JP',null,'/','en'],['JP','en-US','en','/','en'],['US','en-US','ja','/','ja'],['','ja-JP',null,'/','ja'],['','en-US',null,'/','en'],['JP','en-US','en','/ja/','ja'],['US','ja-JP','ja','/en/','en']]){
  const c=await browser.newContext({locale});const p=await c.newPage();
  if(stored)await c.addInitScript(value=>localStorage.setItem('portfolio.locale',value),stored);
  // Simulate only the hosting rewrite by serving the generated country-specific document at root.
  if(country)await p.route(base+'/',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(country==='JP'?'geo-ja.html':'geo-en.html','utf8')}));
  await p.goto(base+path);await p.waitForSelector('#byte-trigger');check(await p.locator('html').getAttribute('lang')===want);await c.close();
 }
 const c=await browser.newContext({reducedMotion:'reduce',locale:'en-US'});const p=await c.newPage();await c.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});await p.goto(base+'/ja/');await p.waitForSelector('#byte-trigger');
 check(await p.locator('.byte-eyes').evaluate(x=>getComputedStyle(x).animationName)==='none');await p.locator('[data-locale=en]').click();check(await p.locator('html').getAttribute('lang')==='en');await c.close();
 check(errors.length===0);await browser.close();console.log(`${assertions} browser assertions passed; no page errors. Screenshots: output/playwright/`);
})().catch(e=>{console.error(e);process.exit(1)});
