(() => {
  const KEY = 'salamJourney_v1';
  const countries = [
    {id:'indonesia', name:'إندونيسيا', en:'INDONESIA', color:'#429c9a', answers:['اندونيسيا','إندونيسيا','indonesia']},
    {id:'syria', name:'سوريا', en:'SYRIA', color:'#7d9e4a', answers:['سوريا','سورية','syria']},
    {id:'sudan', name:'السودان', en:'SUDAN', color:'#ec8564', answers:['السودان','سودان','sudan']},
    {id:'yemen', name:'اليمن', en:'YEMEN', color:'#4ab9c1', answers:['اليمن','يمن','yemen']},
    {id:'philippines', name:'الفلبين', en:'PHILIPPINES', color:'#f4a88c', answers:['الفلبين','فلبين','الفلبين','philippines','the philippines']},
    {id:'jordan', name:'الأردن', en:'JORDAN', color:'#429c9a', answers:['الاردن','الأردن','اردن','jordan']},
    {id:'mali', name:'مالي', en:'MALI', color:'#7d9e4a', answers:['مالي','مالى','mali']},
    {id:'india', name:'الهند', en:'INDIA', color:'#ec8564', answers:['الهند','هند','india']},
    {id:'france', name:'فرنسا', en:'FRANCE', color:'#4ab9c1', answers:['فرنسا','فرنسي','france']},
    {id:'bangladesh', name:'بنغلاديش', en:'BANGLADESH', color:'#f4a88c', answers:['بنغلاديش','بنقلاديش','بنجلاديش','بنغلادش','bangladesh']},
    {id:'nepal', name:'نيبال', en:'NEPAL', color:'#7d9e4a', answers:['نيبال','نِيبال','nepal']},
    {id:'nigeria', name:'نيجيريا', en:'NIGERIA', color:'#429c9a', answers:['نيجيريا','نيجريا','nigeria']},
    {id:'pakistan', name:'باكستان', en:'PAKISTAN', color:'#ec8564', answers:['باكستان','باكستان','pakistan']}
  ];
  const riddles = [
    {q:'يجتمع عندي النيلان الأزرق والأبيض، وأشتهر بأرض النيلين، فمن أنا؟', a:['السودان','سودان','sudan']},
    {q:'أشتهر بالألوان والتوابل، وتزين أرضي عجائب تاج أبيض، فمن أنا؟', a:['الهند','هند','india']},
    {q:'في أرضي أقدم الأسواق، وتفوح من أزقتي رائحة الياسمين، فمن أنا؟', a:['سوريا','سورية','syria']},
    {q:'أنا أرخبيل تتناثر جزري في المحيط، وتشتهر أرضي بالبراكين والغابات، وتعيش فيها تنانين لا توجد في مكان آخر، فمن أنا؟', a:['اندونيسيا','إندونيسيا','indonesia']},
    {q:'أنا بلد اشتهر بالقهوة والبخور، وفي مدينة تاريخية تبدو مبانيها كأنها ناطحات سحاب قديمة، فمن أنا؟', a:['اليمن','يمن','yemen']},
    {q:'أنا بلد اشتهر بالعطور والكروسان، واحتضن متحف اللوفر، فمن أنا؟', a:['فرنسا','france']},
    {q:'تنتشر الأنهار في أرضي، وأحمل لقبًا يرتبط بالخضرة والحياة، فمن أنا؟', a:['بنغلاديش','بنقلاديش','بنجلاديش','bangladesh']},
    {q:'كلمة من أربعة أحرف تختصر فكرة هذا الملتقى، وتجمع القلوب مهما اختلفت الثقافات. ما هي؟', a:['سلام','salam','salaam'], tag:'لغز الملتقى', label:'اكتب الكلمة'}
  ];
  const defaults = {name:'', screen:'welcome', quizIndex:0, quizAnswers:[], collected:[], quizComplete:false, complete:false};
  let state = load();
  let dialogStickerId = null;
  let dialogMode = 'undo';
  const $ = (selector) => document.querySelector(selector);
  const normalize = value => value.toLocaleLowerCase('ar').normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/[ى]/g,'ي').replace(/\s+/g,' ').trim();
  function load(){try{const stored=JSON.parse(localStorage.getItem(KEY)||'null');return stored&&typeof stored==='object'?{...defaults,...stored}: {...defaults};}catch{return {...defaults};}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('تعذر حفظ التقدم. يمكنك متابعة الرحلة في هذه الجلسة.');}}
  function show(screen){if(screen==='quiz'||screen==='collection')screen='journey';state.screen=screen;save();document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.dataset.screen===screen));window.scrollTo({top:0,behavior:'smooth'});if(screen==='journey'){renderQuiz();renderCollection();}if(screen==='intro')$('#hello-name').textContent=state.name?`يا ${state.name}`:'';if(screen==='complete')$('#complete-name').textContent=state.name;}
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600);}
  function renderCountries(){const ribbon=$('#intro-countries');ribbon.innerHTML=countries.map(c=>`<div class="country-chip" style="--chip:${c.color}"><b>${c.name}</b><span>${c.en}</span></div>`).join('');}
  function renderQuiz(){let index=Math.min(state.quizIndex,riddles.length-1);let r=riddles[index];$('#quiz-count').textContent=`${index<7?'اللغز '+(index+1):'لغز الملتقى'} من 8`;$(`#quiz-percent`).textContent=`${Math.round((index/riddles.length)*100)}٪`;$(`#quiz-progress`).style.width=`${Math.round((index/riddles.length)*100)}%`;$('#puzzle-number').textContent=String(index+1).padStart(2,'0');$('#puzzle-tag').textContent=r.tag||'لغز دولة';$('#puzzle-question').textContent=r.q;$('#answer-label').textContent=r.label||'اكتب اسم الدولة';$('#answer-input').placeholder=r.label?'كلمة من أربع حروف':'إجابتك هنا';$('#answer-input').value='';$('#answer-feedback').textContent='';$('#answer-feedback').className='answer-feedback';$('#skip-question').style.display=index===riddles.length-1?'none':'';}
  function nextRiddle(){state.quizIndex++;if(state.quizIndex>=riddles.length){state.quizIndex=riddles.length-1;state.quizComplete=true;save();renderCollection();$('#collection-zone').scrollIntoView({behavior:'smooth',block:'start'});toast('انتهيت من الألغاز. حان وقت جمع الملصقات!');}else{save();renderQuiz();$('#answer-input').focus({preventScroll:true});}}
  function renderCollection(){const count=state.collected.length;$('#sticker-count').textContent=count;$('#nav-sticker-count').textContent=`${count}/13`;$('#sticker-progress').style.width=`${count/13*100}%`;$('#passport-name').textContent=state.name||'ضيفنا';$('#collection-hint').textContent=count===13?'اكتملت الملصقات! شكرًا لأنك شاركت معنا.':'كلما زرت ركنًا، أضف ملصقه إلى جوازك.';$('#sticker-grid').innerHTML=countries.map(c=>{const collected=state.collected.includes(c.id);return `<button class="sticker-card ${collected?'collected':''}" data-country="${c.id}" aria-label="${collected?'إزالة':'جمع'} ملصق ${c.name}"><div class="sticker-image"><img src="assets/stickers/${c.id}.png" alt="ملصق ${c.name}" loading="lazy"><span class="collected-mark" aria-hidden="true">✓</span></div><div class="sticker-caption"><b>${c.name}</b><span>${c.en}</span></div></button>`;}).join('');$('#sticker-grid').querySelectorAll('.sticker-card').forEach(card=>card.addEventListener('click',()=>toggleSticker(card.dataset.country)));}
  function openStickerDialog(id,mode){const c=countries.find(x=>x.id===id);if(!c)return;dialogStickerId=id;dialogMode=mode;$('#dialog-image').src=`assets/stickers/${id}.png`;$('#dialog-image').alt=`ملصق ${c.name}`;$('#dialog-title').textContent=c.name;$('#dialog-eyebrow').textContent=mode==='undo'?'أُضيف الملصق إلى جوازك':'هذا الملصق موجود في جوازك';$('#dialog-description').textContent=mode==='undo'?'إذا ضغطت بالخطأ، يمكنك التراجع قبل متابعة الرحلة.':'يمكنك إزالة الملصق من جوازك إذا أُضيف بالخطأ.';$('#undo-sticker').textContent=mode==='undo'?'تراجع عن الإضافة':'إزالة الملصق';$('#sticker-dialog').showModal();}
  function toggleSticker(id){const c=countries.find(x=>x.id===id);if(!c)return;const index=state.collected.indexOf(id);if(index>=0){openStickerDialog(id,'remove');return;}state.collected.push(id);save();renderCollection();openStickerDialog(id,'undo');}
  function undoSticker(){if(!dialogStickerId)return;const index=state.collected.indexOf(dialogStickerId);if(index>=0)state.collected.splice(index,1);state.complete=false;save();$('#sticker-dialog').close();renderCollection();toast('تم التراجع عن الملصق. يمكنك إضافته لاحقًا.');}
  function continueJourney(){if($('#sticker-dialog').open)$('#sticker-dialog').close();if(state.collected.length===13){state.complete=true;save();show('complete');}}
  $('#name-form').addEventListener('submit',e=>{e.preventDefault();let name=$('#visitor-name').value.trim().replace(/\s+/g,' ');if(name.length<2){$('#name-error').textContent='اكتب اسمًا من حرفين على الأقل.';return;}state.name=name;state.screen='intro';save();show('intro');});
  $('#answer-form').addEventListener('submit',e=>{e.preventDefault();const answer=normalize($('#answer-input').value);const current=riddles[state.quizIndex];const correct=current.a.some(a=>normalize(a)===answer);const feedback=$('#answer-feedback');if(!answer){feedback.textContent='اكتب إجابتك أولًا.';feedback.className='answer-feedback error';return;}state.quizAnswers[state.quizIndex]={answer,correct};save();if(correct){feedback.textContent=state.quizIndex===7?'إجابة صحيحة. السلام هو ما يجمع حكاياتنا.':'إجابة صحيحة. أحسنت، حكاية جديدة انكشفت!';feedback.className='answer-feedback';$('#check-answer').disabled=true;setTimeout(()=>{$('#check-answer').disabled=false;nextRiddle();},800);}else{feedback.textContent='ليست هذه الدولة. جرّب مرة أخرى، أو تجاوز اللغز للعودة إليه لاحقًا.';feedback.className='answer-feedback error';}});
  $('#skip-question').addEventListener('click',()=>{state.quizAnswers[state.quizIndex]={skipped:true};nextRiddle();});
  document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;switch(action){case'start-quiz':show('journey');$('#quiz-zone').scrollIntoView({behavior:'smooth',block:'start'});break;case'go-collection':$('#collection-zone').scrollIntoView({behavior:'smooth',block:'start'});break;case'finish-quiz':$('#quiz-zone').scrollIntoView({behavior:'smooth',block:'start'});break;case'change-name':{const name=prompt('اكتب الاسم الذي تريد ظهوره في جوازك:',state.name||'');if(name&&name.trim().length>=2){state.name=name.trim().replace(/\s+/g,' ');save();renderCollection();toast('تم تحديث الاسم.');}break;}case'close-dialog':$('#sticker-dialog').close();break;case'undo-sticker':undoSticker();break;case'sticker-continue':continueJourney();break;case'view-stickers':show('journey');$('#collection-zone').scrollIntoView({behavior:'smooth',block:'start'});break;case'restart':if(confirm('إعادة بدء الرحلة ستحذف الاسم والألغاز والملصقات المحفوظة على هذا الجهاز. هل تريد المتابعة؟')){try{localStorage.removeItem(KEY)}catch{}state={...defaults};$('#visitor-name').value='';show('welcome');}break;}});
  $('#sticker-dialog').addEventListener('click',e=>{if(e.target===$('#sticker-dialog'))$('#sticker-dialog').close();});
  renderCountries();
  if(state.screen==='quiz'||state.screen==='collection')state.screen='journey';
  if(state.name&&state.complete){show('complete');}
  else if(state.name&&state.screen!=='welcome'){show(state.screen);}
  else {show('welcome');}
})();
