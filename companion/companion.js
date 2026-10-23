(function () {
  const copy = {
    en: {open:'Open Byte the Kitty — explore Bibash’s profile',heading:'Ask about Bibash',intro:'Explore my background, projects, and technical experience using your favorite AI.',close:'Close',back:'← Topics',about:'Get to Know Me',projects:'Remarkable Projects',strengths:'My Strengths',skills:'Technical Skills',recruiter:'Recruiter Review',custom:'Ask Anything',connect:'Connect With Me',language:'Response language',question:'Your question or instruction',placeholder:'Add your instruction here. For example: Explain Bibash’s experience with Java performance optimization.',preview:'Preview Prompt',copy:'Copy Prompt',copied:'Copied!',failed:'Could not copy. Select and copy the prompt below manually.',usage:'1. Choose a topic. 2. Copy the prepared prompt. 3. Paste it into ChatGPT, Claude, Gemini, or another AI.',local:'Prepared locally from this self-published portfolio. Your question stays in your browser until you copy and share it.',detail:'Review the embedded profile and grounded instructions, then copy this prompt into your preferred AI.',empty:'Add a question before copying.',prompt:'Prepared prompt',contact:'Find Bibash on these published professional profiles.'},
    ja: {open:'Byte the Kittyを開く — ビバシュのプロフィールを見る',heading:'ビバシュについて知る',intro:'お使いのAIを使って、私の経歴やプロジェクト、技術経験を詳しく確認できます。',close:'閉じる',back:'← トピック一覧',about:'私について',projects:'注目プロジェクト',strengths:'私の強み',skills:'技術スキル',recruiter:'採用担当者向け',custom:'自由に質問',connect:'お問い合わせ',language:'回答言語',question:'質問・指示',placeholder:'質問や指示を入力してください。例：Javaの性能改善に関する実務経験を詳しく教えてください。',preview:'プロンプトを確認',copy:'プロンプトをコピー',copied:'コピーしました',failed:'コピーできませんでした。下のプロンプトを選択して、手動でコピーしてください。',usage:'1. 知りたい内容を選択　2. プロンプトをコピー　3. ChatGPTなどのAIに貼り付けて質問',local:'本人が公開したプロフィールを基に、ブラウザー内で作成します。質問はコピーして共有するまで外部に送信されません。',detail:'プロフィールと正確性に関する指示を確認し、お使いのAIにコピーしてご利用ください。',empty:'コピーする前に質問を入力してください。',prompt:'作成したプロンプト',contact:'公開済みの仕事用プロフィールからご連絡ください。'}
  };
  const t = k => copy[siteLocale][k];
  const trigger = document.createElement('button');
  trigger.id = 'byte-trigger'; trigger.type = 'button';trigger.setAttribute('aria-haspopup','dialog'); trigger.setAttribute('aria-controls','byte-dialog');trigger.setAttribute('aria-expanded','false');
  // Original compact silhouette, no image dependencies or emoji rendering.
  trigger.innerHTML = '<svg viewBox="0 0 72 72" aria-hidden="true"><path class="byte-tail" d="M47 55 Q68 59 63 38" fill="none" stroke="#182c3e" stroke-width="7" stroke-linecap="round"/><path d="M17 38 14 12 30 23 Q36 20 42 23 L57 12 54 38 Q57 49 48 53 L51 62 H21 L24 53 Q15 49 17 38Z" fill="#08121e" stroke="#365069" stroke-width="2"/><g class="byte-eyes" fill="#65d9ee"><rect x="23" y="33" width="7" height="5" rx="2"/><rect x="42" y="33" width="7" height="5" rx="2"/></g><path d="m33 42 3 2 3-2" fill="none" stroke="#819bad" stroke-width="2"/></svg><span class="byte-name" aria-hidden="true">Byte</span>';
  const dialog = document.createElement('dialog');dialog.id='byte-dialog';dialog.setAttribute('aria-labelledby','byte-heading');
  // All markup here is fixed. Custom input and profile text are only assigned through textContent/value.
  dialog.innerHTML = '<header class="byte-header"><h2 id="byte-heading"></h2><button type="button" class="byte-close"></button></header><p class="byte-intro"></p><div class="byte-menu"></div><section class="byte-detail" hidden><button type="button" class="byte-back"></button><h3 class="byte-purpose" tabindex="-1"></h3><p class="byte-description"></p><div class="byte-contact" hidden></div><div class="byte-generator"><label class="byte-language-label" for="byte-language"></label><select id="byte-language"><option value="en">English</option><option value="ja">日本語</option></select><div class="byte-custom" hidden><label for="byte-question"></label><textarea id="byte-question" rows="4"></textarea></div><details class="byte-preview"><summary></summary><label class="sr-only" for="byte-prompt"></label><textarea id="byte-prompt" rows="12" readonly></textarea></details><button type="button" class="btn byte-copy"></button></div></section><p class="byte-status" role="status" aria-live="polite"></p><p class="byte-usage"></p><p class="byte-local"></p>';
  document.body.append(trigger,dialog);
  const el = selector => dialog.querySelector(selector);
  const menu = el('.byte-menu'), detail = el('.byte-detail'), response = el('#byte-language'), question = el('#byte-question'), prompt = el('#byte-prompt');
  let topic = null, responseOverridden = false, returnFocus;
  function refreshPrompt() { if (topic && topic !== 'connect') prompt.value = buildPrompt(topic,response.value,question.value,PROFILE); el('.byte-status').textContent=''; }
  function selectTopic(value) {
    topic=value;menu.hidden=true;detail.hidden=false;
    el('.byte-purpose').textContent=t(topic);el('.byte-contact').hidden=topic!=='connect';el('.byte-generator').hidden=topic==='connect';el('.byte-custom').hidden=topic!=='custom';el('.byte-preview').open=false;
    el('.byte-description').textContent=t(topic==='connect'?'contact':'detail');refreshPrompt();el('.byte-purpose').focus();
  }
  for (const value of ['about','projects','strengths','skills','recruiter','custom','connect']) {
    const button=document.createElement('button');button.type='button';button.dataset.topic=value;button.addEventListener('click',()=>selectTopic(value));menu.append(button);
  }
  for (const [name,url] of Object.entries(PROFILE.en.links)) {
    const a=document.createElement('a');a.href=url;a.textContent=name+' ↗';a.target='_blank';a.rel='noopener noreferrer';el('.byte-contact').append(a);
  }
  function localize() {
    trigger.setAttribute('aria-label',t('open'));el('#byte-heading').textContent=t('heading');el('.byte-close').textContent=t('close');el('.byte-intro').textContent=t('intro');el('.byte-back').textContent=t('back');el('.byte-language-label').textContent=t('language');el('.byte-custom label').textContent=t('question');question.placeholder=t('placeholder');el('.byte-preview summary').textContent=t('preview');el('.byte-preview label').textContent=t('prompt');el('.byte-copy').textContent=t('copy');el('.byte-usage').textContent=t('usage');el('.byte-local').textContent=t('local');
    menu.querySelectorAll('button').forEach(b=>b.textContent=t(b.dataset.topic));
    if (!responseOverridden) response.value=siteLocale;
    if (topic) { el('.byte-purpose').textContent=t(topic);el('.byte-description').textContent=t(topic==='connect'?'contact':'detail');refreshPrompt(); }
  }
  trigger.addEventListener('click',()=>{returnFocus=document.activeElement;dialog.showModal();trigger.setAttribute('aria-expanded','true');el('.byte-close').focus();});
  el('.byte-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');returnFocus?.focus();});
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab') return;
    const stops=[...dialog.querySelectorAll('button,a[href],select,textarea,summary')].filter(node=>!node.disabled&&node.getClientRects().length);
    const first=stops[0],last=stops[stops.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  el('.byte-back').addEventListener('click',()=>{const previous=topic;topic=null;menu.hidden=false;detail.hidden=true;el('.byte-status').textContent='';menu.querySelector('[data-topic="'+previous+'"]').focus();});
  response.addEventListener('change',()=>{responseOverridden=true;refreshPrompt();});question.addEventListener('input',refreshPrompt);
  el('.byte-copy').addEventListener('click',async()=>{
    if(topic==='custom'&&!question.value.trim()){el('.byte-status').textContent=t('empty');question.focus();return;}
    refreshPrompt();
    try { await navigator.clipboard.writeText(prompt.value);el('.byte-status').textContent=t('copied'); }
    catch (_) { el('.byte-preview').open=true;prompt.focus();prompt.select();el('.byte-status').textContent=t('failed'); }
  });
  document.addEventListener('localechange',localize);localize();
})();
