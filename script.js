(function(){
  "use strict";

  /* ===================== SERVICE WORKER ===================== */
  const LS_SW = 'dash_sw_asked';
  if('serviceWorker' in navigator && !localStorage.getItem(LS_SW)){
    const banner = document.createElement('div');
    banner.id = 'swPrompt';
    banner.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:99999;'
      + 'background:#1a1a2e;border:1px solid rgba(255,255,255,.15);'
      + 'border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:12px;'
      + 'font-size:12px;box-shadow:0 4px 24px rgba(0,0,0,.5);max-width:360px;width:90%;'
      + 'backdrop-filter:blur(12px);color:#fff;';
    banner.innerHTML = `
      <span style="font-size:20px;">📥</span>
      <span style="flex:1;line-height:1.4;">Vuoi usare questa dashboard <b>anche offline</b>? Salveremo le risorse in cache.</span>
      <button id="swYes" style="background:#3db4f2;color:#000;border:none;border-radius:6px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">Sì, salva</button>
      <button id="swNo" style="background:none;border:none;color:#fff;opacity:.5;cursor:pointer;font-size:18px;line-height:1;padding:0 2px;" title="No grazie">✕</button>`;
    document.body.appendChild(banner);
    function dismiss(install){
      localStorage.setItem(LS_SW, install ? 'yes' : 'no');
      banner.remove();
      if(install) navigator.serviceWorker.register('/sw.js').catch(()=>{});
    }
    document.getElementById('swYes').addEventListener('click', () => dismiss(true));
    document.getElementById('swNo').addEventListener('click',  () => dismiss(false));
  } else if('serviceWorker' in navigator && localStorage.getItem(LS_SW) === 'yes'){
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }

  /* ===================== CONFIG ===================== */
  // No worker needed - using free public APIs or BYOK

  /* ===================== STORAGE ===================== */
  const LS_LAYOUT = 'dash_layout_v1';
  const LS_NOTES  = 'dash_notes_v1_';
  const LS_EVENTS = 'dash_events_v1';
  const LS_CITY   = 'dash_city_v1';
  const LS_TODO   = 'dash_todo_v1_';
  const LS_BM     = 'dash_bookmarks_v1';
  const LS_GH     = 'dash_github_v1';
  const LS_LANG   = 'dash_lang_v1';

  /* ===================== I18N ===================== */
  const I18N = {
    en: {
      'search': 'Search the web · try !yt !gh !w',
      'add-widget-btn': '+ Add widget',
      'add-widget': '• ADD WIDGET',
      'close': 'Close',
      'settings': '• SETTINGS',
      'lang': 'Language',
      'lang-desc': 'Interface in Italian or English',
      'complex': 'Complex layout',
      'complex-desc': 'Free resize & drag widgets anywhere on a 12-column grid',
      'byok': 'BYOK AI',
      'byok-desc': 'API key, provider and model configuration for Chat BYOK',
      'configure': 'Configure',
      'reset': 'Reset',
      'reset-desc': 'Restore default widgets and arrangement',
      'clear': 'Clear',
      'clear-desc': 'Erase notes, todos, events, bookmarks',
      'customize': 'Customize',
      'no-widgets': 'No widgets yet — click "+ Add widget" to get started.',
      'widget-title': {
        clock:'CLOCK', weather:'WEATHER', calendar:'CALENDAR', quote:'QUOTE',
        notes:'NOTES', crypto:'CRYPTO', map:'MAP', todo:'TODO', timer:'TIMER',
        bookmarks:'BOOKMARKS', news:'NEWS', chatsimple:'CHAT', chatbyok:'CHAT BYOK',
        github:'GITHUB', worldclock:'WORLD CLOCK',
        anilistrecent:'AL RECENT', anilistnotif:'AL NOTIFS', anilisttracker:'AL TRACKER'
      },
      'widget-desc': {
        clock:'Live digital clock',
        weather:'Open-Meteo forecast, search any city',
        calendar:'Month view with saved events',
        quote:'Random quote via QuoteSlate',
        notes:'Quick scratchpad, auto-saved',
        crypto:'Live prices via CoinGecko',
        map:'Dark-theme map with your location',
        todo:'Checklist, auto-saved',
        timer:'Pomodoro 25/5 cycles',
        bookmarks:'Quick link grid, editable',
        news:'Top stories from Hacker News',
        chatsimple:'Free AI chat (no key), supports images/files',
        chatbyok:'Bring your own key (OpenAI, Anthropic, NVIDIA NIM, Groq, etc.)',
        github:'GitHub user profile stats',
        worldclock:'Multiple timezones at a glance',
        anilistrecent:'Recently aired anime via AniList',
        anilistnotif:'Your AniList notifications',
        anilisttracker:'Update your anime list directly'
      },
      // customize modal titles
      'cust-bookmarks-title': 'CUSTOMIZE BOOKMARKS',
      'cust-bookmarks-sub': 'Add, remove or reorder your quick links',
      'cust-weather-title': 'CUSTOMIZE WEATHER',
      'cust-weather-sub': 'Default city shown when the widget loads',
      'cust-crypto-title': 'CUSTOMIZE CRYPTO',
      'cust-crypto-sub': 'Choose the coins shown and their ticker symbols',
      'cust-news-title': 'CUSTOMIZE NEWS',
      'cust-news-sub': 'Choose which source to fetch stories from',
      'cust-github-title': 'CUSTOMIZE GITHUB',
      'cust-github-sub': 'Default GitHub username shown when the widget loads',
      'cust-worldclock-title': 'CUSTOMIZE WORLD CLOCK',
      'cust-worldclock-sub': 'Pick the cities and timezones shown in the grid',
      'cust-notes-title': 'CUSTOMIZE NOTES',
      'cust-notes-sub': 'Set the default placeholder text',
      'cust-todo-title': 'CUSTOMIZE TODO',
      'cust-todo-sub': 'Set the default placeholder text',
      // field labels
      'lbl-name': 'Name',
      'lbl-url': 'URL',
      'lbl-city': 'City',
      'lbl-tz': 'Timezone',
      'lbl-coin-id': 'CoinGecko id',
      'lbl-sym': 'Symbol',
      'lbl-source': 'Source',
      'lbl-username': 'Username',
      'lbl-placeholder': 'Placeholder',
      'lbl-default-city': 'Default city',
      'add-link': '+ Add link',
      'add-zone': '+ Add timezone',
      'add-coin': '+ Add coin',
      'save': 'Save',
      'cancel': 'Cancel'
    },
    it: {
      'search': 'Cerca nel web · prova !yt !gh !w',
      'add-widget-btn': '+ Aggiungi widget',
      'add-widget': '• AGGIUNGI WIDGET',
      'close': 'Chiudi',
      'settings': '• IMPOSTAZIONI',
      'lang': 'Lingua',
      'lang-desc': 'Interfaccia in italiano o inglese',
      'complex': 'Layout complesso',
      'complex-desc': 'Ridimensiona e trascina liberamente i widget su una griglia a 12 colonne',
      'byok': 'BYOK AI',
      'byok-desc': 'API key, provider e modello per Chat BYOK',
      'configure': 'Configura',
      'reset': 'Reset',
      'reset-desc': 'Ripristina i widget predefiniti',
      'clear': 'Cancella',
      'clear-desc': 'Elimina note, todo, eventi, segnalibri',
      'customize': 'Personalizza',
      'no-widgets': 'Nessun widget — clicca "+ Aggiungi widget" per iniziare.',
      'widget-title': {
        clock:'OROLOGIO', weather:'METEO', calendar:'CALENDARIO', quote:'CITAZIONE',
        notes:'NOTE', crypto:'CRIPTO', map:'MAPPA', todo:'TODO', timer:'TIMER',
        bookmarks:'SEGNALIBRI', news:'NOTIZIE', chatsimple:'CHAT', chatbyok:'CHAT BYOK',
        github:'GITHUB', worldclock:'OROLOGIO MONDIALE',
        anilistrecent:'AL RECENTI', anilistnotif:'AL NOTIFICHE', anilisttracker:'AL TRACKER'
      },
      'widget-desc': {
        clock:'Orologio digitale in tempo reale',
        weather:'Previsioni Open-Meteo, cerca qualsiasi città',
        calendar:'Vista mensile con eventi salvati',
        quote:'Citazione casuale da QuoteSlate',
        notes:'Blocco note rapido, salvataggio automatico',
        crypto:'Prezzi live da CoinGecko',
        map:'Mappa dark con la tua posizione',
        todo:'Checklist, salvataggio automatico',
        timer:'Cicli Pomodoro 25/5',
        bookmarks:'Griglia link rapidi, modificabile',
        news:'Top stories da Hacker News',
        chatsimple:'Chat AI gratuita (senza chiave), supporta immagini/file',
        chatbyok:'Porta la tua chiave (OpenAI, Anthropic, NVIDIA NIM, Groq, ecc.)',
        github:'Statistiche profilo GitHub',
        worldclock:'Più fusi orari a colpo d\'occhio',
        anilistrecent:'Anime usciti di recente via AniList',
        anilistnotif:'Le tue notifiche AniList',
        anilisttracker:'Aggiorna la tua lista anime direttamente'
      },
      'cust-bookmarks-title': 'PERSONALIZZA SEGNALIBRI',
      'cust-bookmarks-sub': 'Aggiungi, rimuovi o riordina i tuoi link rapidi',
      'cust-weather-title': 'PERSONALIZZA METEO',
      'cust-weather-sub': 'Città predefinita mostrata all\'apertura del widget',
      'cust-crypto-title': 'PERSONALIZZA CRIPTO',
      'cust-crypto-sub': 'Scegli le criptovalute mostrate e i loro ticker',
      'cust-news-title': 'PERSONALIZZA NOTIZIE',
      'cust-news-sub': 'Scegli da quale fonte leggere le notizie',
      'cust-github-title': 'PERSONALIZZA GITHUB',
      'cust-github-sub': 'Username GitHub predefinito mostrato all\'apertura del widget',
      'cust-worldclock-title': 'PERSONALIZZA OROLOGIO MONDIALE',
      'cust-worldclock-sub': 'Scegli le città e i fusi orari da mostrare',
      'cust-notes-title': 'PERSONALIZZA NOTE',
      'cust-notes-sub': 'Imposta il testo del placeholder predefinito',
      'cust-todo-title': 'PERSONALIZZA TODO',
      'cust-todo-sub': 'Imposta il testo del placeholder predefinito',
      'lbl-name': 'Nome',
      'lbl-url': 'URL',
      'lbl-city': 'Città',
      'lbl-tz': 'Fuso orario',
      'lbl-coin-id': 'id CoinGecko',
      'lbl-sym': 'Simbolo',
      'lbl-source': 'Fonte',
      'lbl-username': 'Username',
      'lbl-placeholder': 'Placeholder',
      'lbl-default-city': 'Città predefinita',
      'add-link': '+ Aggiungi link',
      'add-zone': '+ Aggiungi fuso',
      'add-coin': '+ Aggiungi cripto',
      'save': 'Salva',
      'cancel': 'Annulla'
    }
  };

  let currentLang = localStorage.getItem(LS_LANG) || 'en';
  function t(key){
    const dict = I18N[currentLang] || I18N.en;
    return dict[key] ?? I18N.en[key] ?? key;
  }
  function applyI18n(){
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      el.placeholder = t(key);
    });
    // re-render widget choice list if modal is closed (so the next time it opens it's localized)
    const langSel = document.getElementById('langSelect');
    if(langSel) langSel.value = currentLang;
  }

  function escapeHtml(s){
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":"'"}[c]));
  }

  function loadLayout(){
    try{
      const raw = localStorage.getItem(LS_LAYOUT);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return [
      { id: uid(), type:'clock',   size:'1x1' },
      { id: uid(), type:'weather', size:'2x1' },
      { id: uid(), type:'map',     size:'2x2' },
      { id: uid(), type:'quote',   size:'1x2' },
      { id: uid(), type:'crypto',  size:'1x1' },
      { id: uid(), type:'calendar',size:'2x2' },
      { id: uid(), type:'notes',   size:'1x2' }
    ];
  }
  function saveLayout(){ localStorage.setItem(LS_LAYOUT, JSON.stringify(layout)); }
  function uid(){ return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  /* ===================== WIDGET CONFIG STORAGE ===================== */
  function configKey(type, id){ return 'dash_cfg_' + type + '_' + id; }
  function loadCfg(type, id, defaults){
    try{ return JSON.parse(localStorage.getItem(configKey(type, id)) || 'null') || defaults; }
    catch(e){ return defaults; }
  }
  function saveCfg(type, id, data){ localStorage.setItem(configKey(type, id), JSON.stringify(data)); }

  /* ===================== CUSTOMIZER MODAL ===================== */
  const custBackdrop = document.getElementById('custBackdrop');
  const custModal = document.getElementById('custModal');
  let currentCustWidget = null;

  function openCustomizer(w){
    currentCustWidget = w;
    const def = DEFS[w.type];
    if(!def) return;

    let html = '';
    switch(w.type){
      case 'bookmarks': html = renderBookmarksCustomizer(w); break;
      case 'weather': html = renderWeatherCustomizer(w); break;
      case 'crypto': html = renderCryptoCustomizer(w); break;
      case 'news': html = renderNewsCustomizer(w); break;
      case 'github': html = renderGithubCustomizer(w); break;
      case 'worldclock': html = renderWorldClockCustomizer(w); break;
      case 'notes': html = renderNotesCustomizer(w); break;
      case 'todo': html = renderTodoCustomizer(w); break;
    }
    if(!html) return;
    custModal.innerHTML = html;
    custBackdrop.classList.add('open');
    document.querySelectorAll('.leaflet-container').forEach(m => m.style.zIndex = '-1');
    bindCustomizerEvents(w);
  }

  function closeCustomizer(){
    custBackdrop.classList.remove('open');
    document.querySelectorAll('.leaflet-container').forEach(m => m.style.zIndex = '');
    document.querySelectorAll('.map-container').forEach(c => {
      if(c._leaflet_map) setTimeout(() => c._leaflet_map.invalidateSize(), 100);
    });
    currentCustWidget = null;
  }

  function bindCustomizerEvents(w){
    const type = w.type;
    custModal.querySelectorAll('.cust-add').forEach(btn => btn.addEventListener('click', () => addCustomItem(type)));
    custModal.querySelectorAll('.cust-actions .cust-save').forEach(btn => btn.addEventListener('click', () => saveCustomizer(type)));
    custModal.querySelectorAll('.cust-actions .cust-cancel').forEach(btn => btn.addEventListener('click', closeCustomizer));
    // drag to reorder for bookmarks
    if(type === 'bookmarks'){
      enableDragReorder(custModal.querySelector('.cust-list'), (items) => {
        saveCfg('bookmarks', w.id, items);
        // re-render the list with new order
        const newHtml = renderBookmarksCustomizer(w);
        custModal.innerHTML = newHtml;
        bindCustomizerEvents(w);
      });
    }
    if(type === 'worldclock'){
      enableDragReorder(custModal.querySelector('.cust-list'), (items) => {
        saveCfg('worldclock', w.id, items);
        const newHtml = renderWorldClockCustomizer(w);
        custModal.innerHTML = newHtml;
        bindCustomizerEvents(w);
      });
    }
    if(type === 'crypto'){
      enableDragReorder(custModal.querySelector('.cust-list'), (items) => {
        saveCfg('crypto', w.id, items);
        const newHtml = renderCryptoCustomizer(w);
        custModal.innerHTML = newHtml;
        bindCustomizerEvents(w);
      });
    }
    // delete buttons for list-based customizers
    if(['bookmarks','worldclock','crypto'].includes(type)){
      custModal.querySelectorAll('.cust-del').forEach(btn => {
        btn.addEventListener('click', () => {
          const list = custModal.querySelector('.cust-list');
          const items = Array.from(list.querySelectorAll('.cust-item')).map(el => {
            if(type === 'bookmarks'){
              return { name: el.querySelector('.cust-name').value, url: el.querySelector('.cust-url').value };
            } else if(type === 'worldclock'){
              return { city: el.querySelector('.cust-city-input').value, tz: el.querySelector('.cust-tz-select').value };
            } else if(type === 'crypto'){
              return { id: el.querySelector('.cust-coin-id').value, sym: el.querySelector('.cust-coin-sym').value };
            }
          });
          saveCfg(type, currentCustWidget.id, items);
          const newHtml = (type === 'bookmarks' ? renderBookmarksCustomizer(w) :
                          type === 'worldclock' ? renderWorldClockCustomizer(w) :
                          renderCryptoCustomizer(w));
          custModal.innerHTML = newHtml;
          bindCustomizerEvents(w);
        });
      });
    }
  }

  function enableDragReorder(listEl, onReorder){
    if(!listEl) return;
    let dragged = null;
    listEl.querySelectorAll('.cust-item').forEach(item => {
      item.draggable = true;
      item.addEventListener('dragstart', e => {
        dragged = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        dragged = null;
        listEl.querySelectorAll('.cust-item').forEach(i => i.classList.remove('drop-target'));
      });
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if(dragged && dragged !== item){
          item.classList.add('drop-target');
          const rect = item.getBoundingClientRect();
          if(e.clientY < rect.top + rect.height / 2){
            listEl.insertBefore(dragged, item);
          } else {
            listEl.insertBefore(dragged, item.nextSibling);
          }
        }
      });
      item.addEventListener('dragleave', () => item.classList.remove('drop-target'));
      item.addEventListener('drop', e => {
        e.preventDefault();
        item.classList.remove('drop-target');
        const items = Array.from(listEl.querySelectorAll('.cust-item')).map(el => {
          if(currentCustWidget && currentCustWidget.type === 'bookmarks'){
            return { name: el.querySelector('.cust-name').value, url: el.querySelector('.cust-url').value };
          } else if(currentCustWidget && currentCustWidget.type === 'worldclock'){
            return { city: el.querySelector('.cust-city-input').value, tz: el.querySelector('.cust-tz-select').value };
          } else if(currentCustWidget && currentCustWidget.type === 'crypto'){
            return { id: el.querySelector('.cust-coin-id').value, sym: el.querySelector('.cust-coin-sym').value };
          }
        });
        onReorder(items);
      });
    });
  }

  // --- BOOKMARKS ---
  function renderBookmarksCustomizer(w){
    const cfg = loadCfg('bookmarks', w.id, [
      { name:'GitHub',  url:'https://github.com' },
      { name:'YouTube', url:'https://youtube.com' },
      { name:'Reddit',  url:'https://reddit.com' },
      { name:'Hacker News', url:'https://news.ycombinator.com' },
      { name:'Wikipedia', url:'https://wikipedia.org' },
      { name:'MDN',     url:'https://developer.mozilla.org' }
    ]);
    let itemsHtml = '';
    if(cfg.length){
      itemsHtml = cfg.map((it, i) => `
        <div class="cust-item" draggable="true" data-i="${i}">
          <span class="cust-handle">⋮⋮</span>
          <div class="cust-fields">
            <input type="text" class="cust-name" value="${escapeHtml(it.name)}" placeholder="${t('lbl-name')}">
            <input type="text" class="cust-url" value="${escapeHtml(it.url)}" placeholder="${t('lbl-url')}">
          </div>
          <button class="cust-del" title="Delete" data-i="${i}">✕</button>
        </div>`).join('');
    } else {
      itemsHtml = '<div class="cust-list-empty">' + t('cust-bookmarks-sub') + '</div>';
    }
    return `
      <h2>${t('cust-bookmarks-title')}</h2>
      <div class="cust-sub">${t('cust-bookmarks-sub')}</div>
      <div class="cust-list">${itemsHtml}</div>
      <button class="cust-add">${t('add-link')}</button>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  function addCustomItem(type){
    if(type !== 'bookmarks') return;
    const list = custModal.querySelector('.cust-list');
    const empty = list.querySelector('.cust-list-empty');
    if(empty) empty.remove();
    const idx = list.querySelectorAll('.cust-item').length;
    const div = document.createElement('div');
    div.className = 'cust-item';
    div.draggable = true;
    div.dataset.i = idx;
    div.innerHTML = `
      <span class="cust-handle">⋮⋮</span>
      <div class="cust-fields">
        <input type="text" class="cust-name" placeholder="${t('lbl-name')}">
        <input type="text" class="cust-url" placeholder="${t('lbl-url')}" value="https://">
      </div>
      <button class="cust-del" title="Delete" data-i="${idx}">✕</button>`;
    list.appendChild(div);
    // re-bind
    bindCustomizerEvents(currentCustWidget);
  }

  function saveCustomizer(type){
    if(type === 'weather'){
      const city = custModal.querySelector('#custWeatherCity').value.trim();
      saveCfg('weather', currentCustWidget.id, { city, lat: 0, lon: 0 });
      closeCustomizer();
      const widgetEl = document.querySelector(`[data-id="${currentCustWidget.id}"]`);
      if(widgetEl){
        const body = widgetEl.querySelector('.widget-body');
        if(body){
          body.innerHTML = '';
          DEFS[type].build(body, currentCustWidget);
        }
      }
      return;
    }
    if(type === 'news'){
      const source = custModal.querySelector('#custNewsSource').value;
      saveCfg('news', currentCustWidget.id, { source });
      closeCustomizer();
      const widgetEl = document.querySelector(`[data-id="${currentCustWidget.id}"]`);
      if(widgetEl){
        const body = widgetEl.querySelector('.widget-body');
        if(body){
          body.innerHTML = '';
          DEFS[type].build(body, currentCustWidget);
        }
      }
      return;
    }
    if(type === 'github'){
      const username = custModal.querySelector('#custGhUser').value.trim();
      saveCfg('github', currentCustWidget.id, { username });
      closeCustomizer();
      const widgetEl = document.querySelector(`[data-id="${currentCustWidget.id}"]`);
      if(widgetEl){
        const body = widgetEl.querySelector('.widget-body');
        if(body){
          body.innerHTML = '';
          DEFS[type].build(body, currentCustWidget);
        }
      }
      return;
    }
    if(type === 'notes'){
      const placeholder = custModal.querySelector('#custNotesPlaceholder').value.trim() || 'Type a quick note…';
      saveCfg('notes', currentCustWidget.id, { placeholder });
      closeCustomizer();
      const widgetEl = document.querySelector(`[data-id="${currentCustWidget.id}"]`);
      if(widgetEl){
        const body = widgetEl.querySelector('.widget-body');
        if(body){
          body.innerHTML = '';
          DEFS[type].build(body, currentCustWidget);
        }
      }
      return;
    }
    if(type === 'todo'){
      const placeholder = custModal.querySelector('#custTodoPlaceholder').value.trim() || 'Add task…';
      saveCfg('todo', currentCustWidget.id, { placeholder });
      closeCustomizer();
      const widgetEl = document.querySelector(`[data-id="${currentCustWidget.id}"]`);
      if(widgetEl){
        const body = widgetEl.querySelector('.widget-body');
        if(body){
          body.innerHTML = '';
          DEFS[type].build(body, currentCustWidget);
        }
      }
      return;
    }

    const list = custModal.querySelector('.cust-list');
    if(!list) return;
    const items = Array.from(list.querySelectorAll('.cust-item')).map(el => {
      if(type === 'bookmarks'){
        return { name: el.querySelector('.cust-name').value.trim() || 'Link', url: el.querySelector('.cust-url').value.trim() || 'https://' };
      } else if(type === 'worldclock'){
        return { city: el.querySelector('.cust-city-input').value.trim() || 'City', tz: el.querySelector('.cust-tz-select').value || 'UTC' };
      } else if(type === 'crypto'){
        return { id: el.querySelector('.cust-coin-id').value.trim() || 'bitcoin', sym: el.querySelector('.cust-coin-sym').value.trim() || 'BTC' };
      }
    }).filter(it => it.name || it.url || it.city || it.id);
    saveCfg(type, currentCustWidget.id, items);
    closeCustomizer();
    // re-render the widget body
    const widgetEl = document.querySelector(`[data-id="${currentCustWidget.id}"]`);
    if(widgetEl){
      const body = widgetEl.querySelector('.widget-body');
      if(body){
        body.innerHTML = '';
        DEFS[type].build(body, currentCustWidget);
      }
    }
  }

  // --- WEATHER ---
  function renderWeatherCustomizer(w){
    const cfg = loadCfg('weather', w.id, { city: '', lat: 0, lon: 0 });
    return `
      <h2>${t('cust-weather-title')}</h2>
      <div class="cust-sub">${t('cust-weather-sub')}</div>
      <div class="cust-field">
        <label>${t('lbl-default-city')}</label>
        <input type="text" id="custWeatherCity" value="${escapeHtml(cfg.city || '')}" placeholder="e.g. London, UK">
      </div>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  // --- CRYPTO ---
  function renderCryptoCustomizer(w){
    const cfg = loadCfg('crypto', w.id, [
      { id:'bitcoin', sym:'BTC' },
      { id:'ethereum', sym:'ETH' },
      { id:'solana', sym:'SOL' }
    ]);
    let itemsHtml = cfg.map((it, i) => `
      <div class="cust-item" draggable="true" data-i="${i}">
        <span class="cust-handle">⋮⋮</span>
        <div class="cust-fields" style="grid-template-columns: 1fr 60px;">
          <input type="text" class="cust-coin-id" value="${escapeHtml(it.id)}" placeholder="${t('lbl-coin-id')}">
          <input type="text" class="cust-coin-sym" value="${escapeHtml(it.sym)}" placeholder="${t('lbl-sym')}">
        </div>
        <button class="cust-del" title="Delete" data-i="${i}">✕</button>
      </div>`).join('');
    return `
      <h2>${t('cust-crypto-title')}</h2>
      <div class="cust-sub">${t('cust-crypto-sub')}</div>
      <div class="cust-list">${itemsHtml}</div>
      <button class="cust-add">${t('add-coin')}</button>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  // --- NEWS ---
  const NEWS_SOURCES = [
    { id:'hackernews', name:'Hacker News', desc:'Tech & startup stories' },
    { id:'reddit', name:'Reddit r/programming', desc:'Programming discussions' },
    { id:'lobsters', name:'Lobste.rs', desc:'Computing focused' }
  ];
  function renderNewsCustomizer(w){
    const cfg = loadCfg('news', w.id, { source: 'hackernews' });
    const options = NEWS_SOURCES.map(s => `<option value="${s.id}" ${cfg.source===s.id?'selected':''}>${s.name} — ${s.desc}</option>`).join('');
    return `
      <h2>${t('cust-news-title')}</h2>
      <div class="cust-sub">${t('cust-news-sub')}</div>
      <div class="cust-field">
        <label>${t('lbl-source')}</label>
        <select id="custNewsSource">${options}</select>
      </div>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  // --- GITHUB ---
  function renderGithubCustomizer(w){
    const cfg = loadCfg('github', w.id, { username: '' });
    return `
      <h2>${t('cust-github-title')}</h2>
      <div class="cust-sub">${t('cust-github-sub')}</div>
      <div class="cust-field">
        <label>${t('lbl-username')}</label>
        <input type="text" id="custGhUser" value="${escapeHtml(cfg.username || '')}" placeholder="e.g. torvalds">
      </div>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  // --- WORLD CLOCK ---
  const COMMON_TIMEZONES = [
    'America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
    'America/Anchorage','Pacific/Honolulu',
    'Europe/London','Europe/Paris','Europe/Berlin','Europe/Rome','Europe/Moscow',
    'Asia/Dubai','Asia/Karachi','Asia/Kolkata','Asia/Bangkok','Asia/Singapore','Asia/Hong_Kong','Asia/Tokyo','Asia/Seoul','Asia/Shanghai',
    'Australia/Sydney','Australia/Melbourne','Australia/Perth','Pacific/Auckland',
    'UTC'
  ];
  function renderWorldClockCustomizer(w){
    const cfg = loadCfg('worldclock', w.id, [
      { city:'NYC', tz:'America/New_York' },
      { city:'LON', tz:'Europe/London' },
      { city:'TYO', tz:'Asia/Tokyo' },
      { city:'SYD', tz:'Australia/Sydney' }
    ]);
    const tzOptions = COMMON_TIMEZONES.map(tz => `<option value="${tz}">${tz}</option>`).join('');
    let itemsHtml = cfg.map((it, i) => `
      <div class="cust-item" draggable="true" data-i="${i}">
        <span class="cust-handle">⋮⋮</span>
        <div class="cust-fields" style="grid-template-columns: 80px 1fr;">
          <input type="text" class="cust-city-input" value="${escapeHtml(it.city)}" placeholder="${t('lbl-city')}">
          <select class="cust-tz-select">${tzOptions}</select>
        </div>
        <button class="cust-del" title="Delete" data-i="${i}">✕</button>
      </div>`).join('');
    // set selected timezone
    setTimeout(() => {
      custModal.querySelectorAll('.cust-tz-select').forEach((sel, i) => {
        if(cfg[i]) sel.value = cfg[i].tz;
      });
    }, 0);
    return `
      <h2>${t('cust-worldclock-title')}</h2>
      <div class="cust-sub">${t('cust-worldclock-sub')}</div>
      <div class="cust-list">${itemsHtml}</div>
      <button class="cust-add">${t('add-zone')}</button>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  // --- NOTES ---
  function renderNotesCustomizer(w){
    const cfg = loadCfg('notes', w.id, { placeholder: 'Type a quick note…' });
    return `
      <h2>${t('cust-notes-title')}</h2>
      <div class="cust-sub">${t('cust-notes-sub')}</div>
      <div class="cust-field">
        <label>${t('lbl-placeholder')}</label>
        <input type="text" id="custNotesPlaceholder" value="${escapeHtml(cfg.placeholder)}" placeholder="e.g. Scratchpad…">
      </div>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  // --- TODO ---
  function renderTodoCustomizer(w){
    const cfg = loadCfg('todo', w.id, { placeholder: 'Add task…' });
    return `
      <h2>${t('cust-todo-title')}</h2>
      <div class="cust-sub">${t('cust-todo-sub')}</div>
      <div class="cust-field">
        <label>${t('lbl-placeholder')}</label>
        <input type="text" id="custTodoPlaceholder" value="${escapeHtml(cfg.placeholder)}" placeholder="e.g. New task…">
      </div>
      <div class="cust-actions">
        <button class="cust-cancel">${t('cancel')}</button>
        <button class="cust-save">${t('save')}</button>
      </div>`;
  }

  /* ===================== CLOSE CUSTOMIZER ON BACKDROP CLICK ===================== */
  custBackdrop.addEventListener('click', e => {
    if(e.target === custBackdrop) closeCustomizer();
  });

  let layout = loadLayout();

  /* ===================== WIDGET REGISTRY ===================== */
  const DEFS = {
    clock:      { icon:'◷', size:'1x1', build: buildClock },
    weather:    { icon:'☁', size:'2x1', build: buildWeather, customizable: true },
    calendar:   { icon:'▦', size:'2x2', build: buildCalendar },
    quote:      { icon:'❝', size:'1x2', build: buildQuote },
    notes:      { icon:'✎', size:'1x2', build: buildNotes, customizable: true },
    crypto:     { icon:'₿', size:'1x1', build: buildCrypto, customizable: true },
    map:        { icon:'◉', size:'2x2', build: buildMap },
    todo:       { icon:'☑', size:'1x2', build: buildTodo, customizable: true },
    timer:      { icon:'◐', size:'1x1', build: buildTimer },
    bookmarks:  { icon:'☆', size:'1x2', build: buildBookmarks, customizable: true },
    news:       { icon:'◴', size:'2x1', build: buildNews, customizable: true },
    chatsimple: { icon:'◌', size:'1x2', build: buildChatSimple },
    chatbyok:   { icon:'🔑', size:'1x2', build: buildChatBYOK },
    github:     { icon:'◔', size:'1x2', build: buildGithub, customizable: true },
    worldclock: { icon:'◑', size:'2x1', build: buildWorldClock, customizable: true },
    anilistrecent:  { icon:'▶', size:'2x2', build: buildAniListRecent },
    anilistnotif:   { icon:'◎', size:'1x2', build: buildAniListNotif },
    anilisttracker: { icon:'✓', size:'2x2', build: buildAniListTracker }
  };
  function widgetTitle(key){ return (I18N[currentLang]['widget-title'] && I18N[currentLang]['widget-title'][key]) || I18N.en['widget-title'][key] || key.toUpperCase(); }
  function widgetDesc(key){ return (I18N[currentLang]['widget-desc'] && I18N[currentLang]['widget-desc'][key]) || I18N.en['widget-desc'][key] || ''; }

  const SIZES = ['1x1','2x1','1x2','2x2'];

  /* ===================== RENDER GRID ===================== */
  const gridEl = document.getElementById('grid');

  function renderGrid(){
    gridEl.innerHTML = '';
    layout.forEach(w => {
      const def = DEFS[w.type];
      if(!def) return;
      const el = document.createElement('div');
      el.className = 'widget w-' + w.size;
      el.dataset.id = w.id;

      const header = document.createElement('div');
      header.className = 'widget-header';
      header.draggable = true;
      const title = widgetTitle(w.type);
      const customizeBtn = def.customizable ? `<button class="icon-btn widget-cust-btn" title="${t('customize')}">⚙</button>` : '';
      header.innerHTML = `
        <span class="eyebrow"><span class="dot">•</span>${title}</span>
        <span class="widget-controls">
          ${customizeBtn}
          <button class="icon-btn resize-btn" title="Resize (cycle)">⤢</button>
          <button class="icon-btn remove-btn" title="Remove">✕</button>
        </span>`;
      el.appendChild(header);

      // customize button handler
      if(def.customizable){
        header.querySelector('.widget-cust-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          openCustomizer(w);
        });
      }

      const body = document.createElement('div');
      body.className = 'widget-body';
      el.appendChild(body);

      // resize handles (complex mode)
      ['nw','n','ne','e','se','s','sw','w'].forEach(dir => {
        const h = document.createElement('div');
        h.className = 'resize-handle ' + dir;
        el.appendChild(h);
      });

      gridEl.appendChild(el);

      // drag & drop reordering with visual ghost
      header.addEventListener('dragstart', e=>{
        e.dataTransfer.setData('text/plain', w.id);
        e.dataTransfer.effectAllowed = 'move';
        el.classList.add('dragging');
        // create drag ghost
        const ghost = el.cloneNode(true);
        ghost.classList.add('drag-ghost');
        ghost.style.position = 'absolute';
        ghost.style.top = '-9999px';
        ghost.style.width = el.offsetWidth + 'px';
        ghost.style.height = el.offsetHeight + 'px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => ghost.remove(), 0);
      });
      header.addEventListener('dragend', ()=> {
        el.classList.remove('dragging');
        document.querySelectorAll('.widget.drop-target').forEach(w => w.classList.remove('drop-target'));
      });
      el.addEventListener('dragover', e=>{ e.preventDefault(); e.dataTransfer.dropEffect = 'move'; el.classList.add('drop-target'); });
      el.addEventListener('dragleave', ()=> el.classList.remove('drop-target'));
      el.addEventListener('drop', e=>{
        e.preventDefault();
        el.classList.remove('drop-target');
        const sourceId = e.dataTransfer.getData('text/plain');
        if(sourceId === w.id) return;
        const from = layout.findIndex(x=>x.id===sourceId);
        const to = layout.findIndex(x=>x.id===w.id);
        if(from<0||to<0) return;
        const [moved] = layout.splice(from,1);
        layout.splice(to,0,moved);
        saveLayout();
        renderGrid();
      });

      header.querySelector('.remove-btn').addEventListener('click', ()=>{
        layout = layout.filter(x=>x.id!==w.id);
        saveLayout();
        renderGrid();
      });

      header.querySelector('.resize-btn').addEventListener('click', ()=>{
        const idx = SIZES.indexOf(w.size);
        w.size = SIZES[(idx + 1) % SIZES.length];
        saveLayout();
        renderGrid();
      });

      // Complex mode: free resize via handles
      el.querySelectorAll('.resize-handle').forEach(h => {
        h.addEventListener('mousedown', startResize);
      });
      function startResize(e){
        if(!document.body.classList.contains('complex-mode')) return;
        e.preventDefault();
        const dir = e.target.className.split(' ')[1];
        const startX = e.clientX, startY = e.clientY;
        const startCol = parseInt(w.size.split('x')[0]);
        const startRow = parseInt(w.size.split('x')[1]);
        el.classList.add('resizing');

        function onMove(ev){
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          const cellW = gridEl.offsetWidth / 12;
          const cellH = 80;
          let cols = startCol, rows = startRow;
          if(dir.includes('e')) cols = Math.max(1, Math.min(12, startCol + Math.round(dx / cellW)));
          if(dir.includes('w')) cols = Math.max(1, Math.min(12, startCol - Math.round(dx / cellW)));
          if(dir.includes('s')) rows = Math.max(1, Math.min(12, startRow + Math.round(dy / cellH)));
          if(dir.includes('n')) rows = Math.max(1, Math.min(12, startRow - Math.round(dy / cellH)));
          w.size = cols + 'x' + rows;
          el.className = 'widget w-' + w.size + ' resizing';
        }
        function onUp(){
          el.classList.remove('resizing');
          saveLayout();
          renderGrid();
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }

      def.build(body, w);
    });

    if(layout.length===0){
      gridEl.innerHTML = '<div class="empty-state" style="grid-column:1/-1; padding:60px 0;">' + t('no-widgets') + '</div>';
    }
  }

  /* ===================== CLOCK ===================== */
  function buildClock(body){
    const time = document.createElement('div'); time.className='clock-time';
    const date = document.createElement('div'); date.className='clock-date';
    body.appendChild(time); body.appendChild(date);
    function tick(){
      const now = new Date();
      time.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
      date.textContent = now.toLocaleDateString([], {weekday:'long', year:'numeric', month:'long', day:'numeric'}).toUpperCase();
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ===================== WEATHER ===================== */
  const WMO = {
    0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
    45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',
    61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Heavy freezing rain',
    71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',
    80:'Light showers',81:'Showers',82:'Violent showers',
    85:'Snow showers',86:'Heavy snow showers',
    95:'Thunderstorm',96:'Thunderstorm w/ hail',99:'Severe thunderstorm w/ hail'
  };

  const WMO_ICON = {
    0:'☀️',1:'🌤️',2:'⛅',3:'☁️',
    45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',
    61:'🌧️',63:'🌧️',65:'🌧️',66:'🌨️',67:'🌨️',
    71:'🌨️',73:'❄️',75:'❄️',77:'🌨️',
    80:'🌦️',81:'🌧️',82:'⛈️',
    85:'🌨️',86:'🌨️',
    95:'⛈️',96:'⛈️',99:'⛈️'
  };

  function buildWeather(body, w){
    const row = document.createElement('div'); row.className='weather-city-row';
    row.innerHTML = `<input type="text" placeholder="Search city…" id="ci-${w.id}"><button id="cb-${w.id}">Go</button>`;
    const main = document.createElement('div'); main.className='weather-main';
    main.innerHTML = `<div class="weather-temp">--°</div><div class="weather-cond">Loading…</div>`;
    const loc = document.createElement('div'); loc.className='weather-loc'; loc.textContent='Locating…';
    const sub = document.createElement('div'); sub.className='weather-sub';
    const forecast = document.createElement('div'); forecast.className='weather-forecast';

    body.appendChild(row); body.appendChild(main); body.appendChild(loc); body.appendChild(sub); body.appendChild(forecast);

    const input = row.querySelector('input');
    const btn = row.querySelector('button');

    async function fetchWeather(lat, lon, label){
      try{
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
          + `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`
          + `&hourly=temperature_2m,weather_code&temperature_unit=celsius&forecast_days=1`;
        const r = await fetch(url);
        const d = await r.json();
        const c = d.current;
        main.innerHTML = `<div class="weather-temp">${Math.round(c.temperature_2m)}°</div><div class="weather-cond">${WMO[c.weather_code]||'—'}</div>`;
        loc.textContent = label.toUpperCase();
        sub.innerHTML = `<span>💧 ${c.relative_humidity_2m}%</span><span>💨 ${Math.round(c.wind_speed_10m)} km/h</span>`;
        localStorage.setItem(LS_CITY, JSON.stringify({lat, lon, label}));

        // hourly forecast: next 7 hours
        const hours = d.hourly?.time || [];
        const temps = d.hourly?.temperature_2m || [];
        const codes = d.hourly?.weather_code || [];
        const now = new Date();
        const slots = [];
        for(let i = 0; i < hours.length && slots.length < 7; i++){
          const h = new Date(hours[i]);
          if(h <= now) continue;
          slots.push({ h, t: Math.round(temps[i]), wc: codes[i] });
        }
        forecast.innerHTML = slots.map(s => {
          const hr = s.h.getHours();
          const lbl = hr === 12 ? '12pm' : hr === 0 ? '12am' : hr < 12 ? hr+'am' : (hr-12)+'pm';
          return `<div class="wf-slot"><div class="wf-time">${lbl}</div><div class="wf-icon">${WMO_ICON[s.wc]||'—'}</div><div class="wf-temp">${s.t}°</div></div>`;
        }).join('');
      }catch(e){
        main.innerHTML = `<div class="weather-cond">Couldn't load weather</div>`;
      }
    }

    async function searchCity(name){
      try{
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`);
        const d = await r.json();
        if(d.results && d.results.length){
          const g = d.results[0];
          const label = g.name + (g.country_code ? ', '+g.country_code : '');
          fetchWeather(g.latitude, g.longitude, label);
        } else {
          loc.textContent = 'City not found';
        }
      }catch(e){ loc.textContent = 'Search failed'; }
    }

    btn.addEventListener('click', ()=>{ if(input.value.trim()) searchCity(input.value.trim()); });
    input.addEventListener('keydown', e=>{ if(e.key==='Enter' && input.value.trim()) searchCity(input.value.trim()); });

    // init: saved city > widget config default > geolocation > default
    const saved = JSON.parse(localStorage.getItem(LS_CITY) || 'null');
    const cfg = loadCfg('weather', w.id, { city: '', lat: 0, lon: 0 });
    if(saved){
      fetchWeather(saved.lat, saved.lon, saved.label);
    } else if(cfg.city){
      searchCity(cfg.city);
    } else if(window.__dashGeo){
      fetchWeather(window.__dashGeo.lat, window.__dashGeo.lon, 'Your location');
    } else if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your location'),
        () => searchCity('London')
      );
    } else {
      searchCity('London');
    }
  }

  /* ===================== MAP ===================== */
  function buildMap(body, w){
    const container = document.createElement('div');
    container.className = 'map-container';
    body.appendChild(container);

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: true
    }).setView([40, 0], 2);

    // store ref for modal z-index management
    container._leaflet_map = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OSM © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: '',
      html: '<div class="user-marker"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    function locate(lat, lon, label){
      map.setView([lat, lon], 13);
      L.marker([lat, lon], { icon: markerIcon }).addTo(map)
        .bindPopup(label || 'You are here');
    }

    const saved = JSON.parse(localStorage.getItem(LS_CITY) || 'null');
    if(saved){
      locate(saved.lat, saved.lon, saved.label);
    } else if(window.__dashGeo){
      locate(window.__dashGeo.lat, window.__dashGeo.lon, 'Your location');
    } else if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos => locate(pos.coords.latitude, pos.coords.longitude, 'Your location'),
        () => {} // keep default view
      );
    }

    // invalidate size after layout settles
    setTimeout(() => map.invalidateSize(), 200);
  }

  /* ===================== CALENDAR (iOS-style) ===================== */
  function buildCalendar(body, w){
    let view = new Date();
    const head = document.createElement('div'); head.className='cal-head';
    const grid = document.createElement('div'); grid.className='cal-grid';
    body.appendChild(head); body.appendChild(grid);

    function events(){ try{ return JSON.parse(localStorage.getItem(LS_EVENTS)||'{}'); }catch(e){ return {}; } }
    function saveEvents(ev){ localStorage.setItem(LS_EVENTS, JSON.stringify(ev)); }

    function render(){
      const y = view.getFullYear(), m = view.getMonth();
      const today = new Date();
      head.innerHTML = `<button class="cal-nav" data-dir="-1">‹</button><span>${view.toLocaleDateString([], {month:'long', year:'numeric'}).toUpperCase()}</span><button class="cal-nav" data-dir="1">›</button>`;
      head.querySelectorAll('.cal-nav').forEach(b=> b.addEventListener('click', ()=>{
        view = new Date(y, m + parseInt(b.dataset.dir), 1);
        render();
      }));

      grid.innerHTML = '';
      ['S','M','T','W','T','F','S'].forEach(d=>{
        const el = document.createElement('div'); el.className='cal-dow'; el.textContent=d; grid.appendChild(el);
      });

      const firstDay = new Date(y, m, 1).getDay();
      const daysInMonth = new Date(y, m+1, 0).getDate();
      const todayStr = today.toDateString();
      const ev = events();

      for(let i=0;i<firstDay;i++){
        const e = document.createElement('div'); e.className='cal-day empty'; grid.appendChild(e);
      }
      for(let d=1; d<=daysInMonth; d++){
        const dateObj = new Date(y,m,d);
        const key = dateObj.toISOString().slice(0,10);
        const cell = document.createElement('div');
        cell.className = 'cal-day' + (dateObj.toDateString()===todayStr ? ' today' : '');
        const num = document.createElement('div'); num.className='cal-day-num'; num.textContent=d;
        cell.appendChild(num);
        if(ev[key]){
          const label = document.createElement('div'); label.className='cal-ev-label';
          label.textContent = ev[key].length > 8 ? ev[key].slice(0,7)+'…' : ev[key];
          cell.appendChild(label);
          cell.title = ev[key];
        }
        cell.addEventListener('click', ()=>{
          const existing = ev[key] || '';
          const text = prompt(`Event for ${dateObj.toDateString()}:`, existing);
          if(text === null) return;
          const evNow = events();
          if(text.trim()==='') delete evNow[key]; else evNow[key] = text.trim();
          saveEvents(evNow);
          render();
        });
        grid.appendChild(cell);
      }

      // scroll to today if current month
      if(y === today.getFullYear() && m === today.getMonth()){
        const todayEl = grid.querySelector('.today');
        if(todayEl) setTimeout(() => todayEl.scrollIntoView({ block:'center', behavior:'smooth' }), 50);
      }
    }
    render();
  }

  /* ===================== QUOTE ===================== */
  function buildQuote(body){
    const text = document.createElement('div'); text.className='quote-text'; text.textContent='Loading…';
    const author = document.createElement('div'); author.className='quote-author';
    body.appendChild(text); body.appendChild(author);

    async function fetchQuote(){
      text.textContent = 'Loading…'; author.textContent='';
      try{
        const r = await fetch('https://api.quoteslate.vercel.app/api/quotes/random');
        const d = await r.json();
        text.textContent = '"' + d.quote + '"';
        author.textContent = '— ' + (d.author || 'Unknown');
      }catch(e){
        text.textContent = 'Could not load a quote right now.';
      }
    }
    fetchQuote();
    const btn = document.createElement('button');
    btn.className='icon-btn'; btn.style.alignSelf='flex-start'; btn.style.marginTop='10px';
    btn.textContent='↻ new quote';
    btn.style.fontFamily='var(--mono)'; btn.style.fontSize='10px'; btn.style.color='var(--text-faint)';
    btn.addEventListener('click', fetchQuote);
    body.appendChild(btn);
  }

  /* ===================== NOTES ===================== */
  function buildNotes(body, w){
    const cfg = loadCfg('notes', w.id, { placeholder: 'Type a quick note…' });
    const key = LS_NOTES + w.id;
    const area = document.createElement('textarea');
    area.className='notes-area';
    area.placeholder = cfg.placeholder;
    area.value = localStorage.getItem(key) || '';
    let t;
    area.addEventListener('input', ()=>{
      clearTimeout(t);
      t = setTimeout(()=> localStorage.setItem(key, area.value), 300);
    });
    body.appendChild(area);
  }

  /* ===================== CRYPTO ===================== */
  function buildCrypto(body, w){
    const list = document.createElement('div'); list.style.marginTop='auto';
    body.appendChild(list);
    const cfg = loadCfg('crypto', w.id, [
      {id:'bitcoin', sym:'BTC'}, {id:'ethereum', sym:'ETH'}, {id:'solana', sym:'SOL'}
    ]);
    const coins = cfg;
    async function fetchPrices(){
      try{
        const ids = coins.map(c=>c.id).join(',');
        const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        const d = await r.json();
        list.innerHTML = coins.map(c=>{
          const p = d[c.id];
          if(!p) return '';
          const change = p.usd_24h_change || 0;
          const cls = change>=0 ? 'crypto-up' : 'crypto-down';
          return `<div class="crypto-row"><span class="crypto-sym">${c.sym}</span><span class="crypto-price">$${p.usd.toLocaleString(undefined,{maximumFractionDigits: p.usd<10?4:2})} <span class="${cls}">${change>=0?'+':''}${change.toFixed(1)}%</span></span></div>`;
        }).join('');
      }catch(e){
        list.innerHTML = '<div class="empty-state">Could not load prices</div>';
      }
    }
    fetchPrices();
    setInterval(fetchPrices, 60000);
  }

  /* ===================== TODO ===================== */
  function buildTodo(body, w){
    const cfg = loadCfg('todo', w.id, { placeholder: 'Add task…' });
    const key = LS_TODO + w.id;
    const inputRow = document.createElement('div'); inputRow.className='todo-input-row';
    inputRow.innerHTML = `<input type="text" placeholder="${cfg.placeholder}"><button>Add</button>`;
    const list = document.createElement('div'); list.className='todo-list';
    body.appendChild(inputRow); body.appendChild(list);

    function load(){ try{ return JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){ return []; } }
    function save(items){ localStorage.setItem(key, JSON.stringify(items)); }

    function render(){
      const items = load();
      if(items.length === 0){
        list.innerHTML = '<div class="empty-state">No tasks yet</div>';
        return;
      }
      list.innerHTML = items.map((it, i) => `
        <div class="todo-item ${it.done?'done':''}" data-i="${i}">
          <input type="checkbox" ${it.done?'checked':''}>
          <span class="todo-text">${escapeHtml(it.text)}</span>
          <button class="todo-del" title="Delete">✕</button>
        </div>
      `).join('');
      list.querySelectorAll('.todo-item').forEach(row => {
        const i = parseInt(row.dataset.i);
        row.querySelector('input').addEventListener('change', () => {
          const items = load();
          items[i].done = !items[i].done;
          save(items); render();
        });
        row.querySelector('.todo-del').addEventListener('click', () => {
          const items = load();
          items.splice(i, 1);
          save(items); render();
        });
      });
    }

    function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    const input = inputRow.querySelector('input');
    const addBtn = inputRow.querySelector('button');
    function add(){
      const v = input.value.trim();
      if(!v) return;
      const items = load();
      items.push({ text: v, done: false });
      save(items);
      input.value = '';
      render();
    }
    addBtn.addEventListener('click', add);
    input.addEventListener('keydown', e => { if(e.key==='Enter') add(); });

    render();
  }

  /* ===================== TIMER (POMODORO) ===================== */
  function buildTimer(body){
    let mode = 'work'; // 'work' | 'break'
    let remaining = 25 * 60;
    let running = false;
    let interval = null;

    const modeEl = document.createElement('div'); modeEl.className = 'timer-mode work';
    const display = document.createElement('div'); display.className = 'timer-display';
    const ctrls = document.createElement('div'); ctrls.className = 'timer-controls';
    ctrls.innerHTML = `
      <button class="primary" data-act="start">Start</button>
      <button data-act="reset">Reset</button>
      <button data-act="switch">Switch</button>
    `;
    body.appendChild(modeEl); body.appendChild(display); body.appendChild(ctrls);

    function fmt(s){
      const m = Math.floor(s/60), r = s%60;
      return String(m).padStart(2,'0') + ':' + String(r).padStart(2,'0');
    }
    function paint(){
      display.textContent = fmt(remaining);
      modeEl.textContent = mode === 'work' ? '◉ WORK' : '◌ BREAK';
      modeEl.className = 'timer-mode ' + mode;
      ctrls.querySelector('[data-act="start"]').textContent = running ? 'Pause' : (remaining === (mode==='work'?25*60:5*60) ? 'Start' : 'Resume');
    }
    function tick(){
      if(remaining > 0){ remaining--; paint(); }
      else {
        clearInterval(interval); running = false;
        try { new AudioContext().resume(); } catch(e){}
        // simple beep via oscillator
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = 880; g.gain.value = 0.1;
          o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 200);
        } catch(e){}
        mode = mode === 'work' ? 'break' : 'work';
        remaining = mode === 'work' ? 25*60 : 5*60;
        paint();
      }
    }
    ctrls.addEventListener('click', e => {
      const a = e.target.dataset.act;
      if(a === 'start'){
        if(running){ clearInterval(interval); running = false; }
        else { interval = setInterval(tick, 1000); running = true; }
        paint();
      } else if(a === 'reset'){
        clearInterval(interval); running = false;
        remaining = mode === 'work' ? 25*60 : 5*60;
        paint();
      } else if(a === 'switch'){
        clearInterval(interval); running = false;
        mode = mode === 'work' ? 'break' : 'work';
        remaining = mode === 'work' ? 25*60 : 5*60;
        paint();
      }
    });
    paint();
  }

  /* ===================== BOOKMARKS ===================== */
  function buildBookmarks(body, w){
    const grid = document.createElement('div'); grid.className = 'bookmarks-grid';
    body.appendChild(grid);

    function load(){
      const cfg = loadCfg('bookmarks', w.id, [
        { name:'GitHub',  url:'https://github.com' },
        { name:'YouTube', url:'https://youtube.com' },
        { name:'Reddit',  url:'https://reddit.com' },
        { name:'Hacker News', url:'https://news.ycombinator.com' },
        { name:'Wikipedia', url:'https://wikipedia.org' },
        { name:'MDN',     url:'https://developer.mozilla.org' }
      ]);
      return cfg;
    }

    function favicon(url){
      try { return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(new URL(url).hostname) + '&sz=32'; }
      catch(e){ return ''; }
    }

    function render(){
      const items = load();
      grid.innerHTML = items.map(it => `
        <a class="bookmark-item" href="${it.url}" target="_blank" rel="noopener">
          <span class="bm-icon"><img src="${favicon(it.url)}" alt="" width="12" height="12" style="border-radius:2px;" onerror="this.style.display='none'"></span>
          <span class="bm-name">${escapeHtml(it.name)}</span>
        </a>
      `).join('');
    }

    render();
  }

/* ===================== NEWS (Hacker News) ===================== */
  function buildNews(body, w){
    const cfg = loadCfg('news', w.id, { source: 'hackernews' });
    const list = document.createElement('div'); list.className = 'news-list';
    list.innerHTML = '<div class="empty-state">Loading…</div>';
    body.appendChild(list);

    async function fetchNews(){
      try {
        let url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
        if(cfg.source === 'reddit'){
          url = 'https://www.reddit.com/r/programming/hot.json?limit=20';
        } else if(cfg.source === 'lobsters'){
          url = 'https://lobste.rs/hottest.json';
        }
        
        if(cfg.source === 'reddit'){
          const r = await fetch(url);
          const d = await r.json();
          const top = d.data?.children?.slice(0, 8) || [];
          const stories = top.map(c => c.data);
          list.innerHTML = stories.filter(Boolean).map(s => `
            <a class="news-item" href="https://reddit.com${s.permalink}" target="_blank" rel="noopener">
              <div class="news-title">${escapeHtml(s.title)}</div>
              <div class="news-meta">
                <span>▲ ${s.score}</span>
                <span>by u/${s.author}</span>
                <span>💬 ${s.num_comments || 0}</span>
              </div>
            </a>
          `).join('');
        } else if(cfg.source === 'lobsters'){
          const r = await fetch(url);
          const d = await r.json();
          const top = d.slice(0, 8);
          list.innerHTML = top.map(s => `
            <a class="news-item" href="${s.url || 'https://lobste.rs/s/'+s.short_id}" target="_blank" rel="noopener">
              <div class="news-title">${escapeHtml(s.title)}</div>
              <div class="news-meta">
                <span>▲ ${s.score}</span>
                <span>by ${s.user}</span>
                <span>💬 ${s.comment_count || 0}</span>
              </div>
            </a>
          `).join('');
        } else {
          // hackernews
          const idsRes = await fetch(url);
          const ids = await idsRes.json();
          const top = ids.slice(0, 8);
          const stories = await Promise.all(top.map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
          ));
          list.innerHTML = stories.filter(Boolean).map(s => `
            <a class="news-item" href="${s.url || 'https://news.ycombinator.com/item?id='+s.id}" target="_blank" rel="noopener">
              <div class="news-title">${escapeHtml(s.title)}</div>
              <div class="news-meta">
                <span>▲ ${s.score}</span>
                <span>by ${s.by}</span>
                <span>💬 ${s.descendants || 0}</span>
              </div>
            </a>
          `).join('');
        }
} catch(e) {
        list.innerHTML = '<div class="empty-state">Could not load news</div>';
      }
    }
    function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":"'"}[c])); }
    fetchNews();
    setInterval(fetchNews, 5 * 60 * 1000);
  }

  /* ===================== CHAT SIMPLE (Free, no API key) ===================== */
  function buildChatSimple(body, w){
    const messages = document.createElement('div'); messages.className = 'chat-messages';
    const attachRow = document.createElement('div'); attachRow.className = 'chat-attach-row';
    attachRow.innerHTML = `
      <label class="attach-btn" title="Attach image/file">
        <input type="file" accept="image/*,.pdf,.txt,.md,.js,.ts,.json,.py,.html,.css" style="display:none;">
        📎
      </label>
      <span class="attach-preview"></span>
    `;
    const inputRow = document.createElement('div'); inputRow.className = 'chat-input-row';
    inputRow.innerHTML = `<input type="text" placeholder="Ask anything (free, no key needed)…"><button>Send</button>`;
    body.appendChild(messages); body.appendChild(attachRow); body.appendChild(inputRow);

    const history = [{ role:'system', content:'You are a helpful assistant in a personal dashboard. Be concise.' }];
    let busy = false;
    let attachedFile = null;

    function add(role, content, isHtml=false){
      const el = document.createElement('div');
      el.className = 'chat-msg ' + role;
      if(isHtml) el.innerHTML = content; else el.textContent = content;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function renderImagePreview(file){
      const preview = attachRow.querySelector('.attach-preview');
      if(file.type.startsWith('image/')){
        const url = URL.createObjectURL(file);
        preview.innerHTML = `<img src="${url}" style="max-height:40px;border-radius:4px;margin-right:6px;"> ${file.name} <button class="attach-remove">✕</button>`;
        preview.querySelector('.attach-remove').onclick = () => { attachedFile = null; preview.innerHTML = ''; };
      } else {
        preview.innerHTML = `📄 ${file.name} <button class="attach-remove">✕</button>`;
        preview.querySelector('.attach-remove').onclick = () => { attachedFile = null; preview.innerHTML = ''; };
      }
    }

    add('ai', 'Hi! I use a free public API (no key needed). Attach images or files with 📎.');

    // File attach
    const fileInput = attachRow.querySelector('input[type=file]');
    attachRow.querySelector('.attach-btn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
      if(e.target.files[0]){
        attachedFile = e.target.files[0];
        renderImagePreview(attachedFile);
      }
    });

    async function send(text){
      if(busy && !text.trim() && !attachedFile) return;
      busy = true;
      const userText = text.trim();
      if(userText) add('user', userText);
      if(attachedFile){
        if(attachedFile.type.startsWith('image/')){
          add('user', `<img src="${URL.createObjectURL(attachedFile)}" style="max-width:100%;border-radius:8px;">`, true);
        } else {
          add('user', `📎 Attached: ${attachedFile.name} (${(attachedFile.size/1024).toFixed(1)} KB)`);
        }
      }
      history.push({ role:'user', content: userText || '[attachment]' });

      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.textContent = 'Thinking…';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;

      const sendBtn = inputRow.querySelector('button');
      sendBtn.disabled = true;

      try {
        // Use free public API - Hugging Face Inference API (no key for some models)
        // Using a simple approach: we'll use a free tier or fallback
        const payload = {
          model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
          messages: history,
          temperature: 0.7,
          max_tokens: 1024,
          stream: false
        };

        // Try Hugging Face free inference (rate limited)
        let reply = '';
        try {
          const r = await fetch('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if(r.ok){
            const d = await r.json();
            reply = d[0]?.generated_text || d.generated_text || '(no response)';
          } else {
            throw new Error('HF API error: ' + r.status);
          }
        } catch(e) {
          // Fallback: simple echo or use another free endpoint
          reply = 'Free API temporarily unavailable. Try Chat BYOK widget for reliable access with your own keys.';
        }

        typing.remove();
        add('ai', reply);
        history.push({ role:'assistant', content: reply });
        attachedFile = null;
        attachRow.querySelector('.attach-preview').innerHTML = '';
      } catch(e){
        typing.remove();
        add('error', 'Error: ' + e.message);
      }
      busy = false;
      sendBtn.disabled = false;
    }

    const input = inputRow.querySelector('input');
    const sendBtn = inputRow.querySelector('button');
    sendBtn.addEventListener('click', () => { send(input.value); input.value=''; });
    input.addEventListener('keydown', e => { if(e.key==='Enter'){ send(input.value); input.value=''; } });
  }

  /* ===================== CHAT BYOK (Bring Your Own Key) ===================== */
  function buildChatBYOK(body, w){
    body.classList.add('chat-byok-body');

    const messages = document.createElement('div'); messages.className='chat-messages';

    const toolbar = document.createElement('div'); toolbar.className='chat-byok-toolbar';
    toolbar.innerHTML = `
      <label class="attach-btn" title="Attach image/file">
        <input type="file" accept="image/*,.pdf,.txt,.md,.js,.ts,.json,.py,.html,.css" style="display:none;">
        📎
      </label>
      <button class="chat-model-btn" type="button" title="Change model">
        <span class="chev">▾</span><span class="model-name">Configure BYOK</span>
      </button>
      <span class="chat-byok-status"></span>
    `;

    const configPanel=document.createElement('div'); configPanel.className='chat-config-panel';
    configPanel.innerHTML=`
      <div class="chat-config-grid">
        <select class="provider-select" aria-label="Provider">
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="google">Google</option>
          <option value="nvidia">NVIDIA NIM</option>
          <option value="openrouter">OpenRouter</option>
          <option value="groq">Groq</option>
          <option value="together">Together AI</option>
          <option value="custom">Custom OpenAI-compatible</option>
        </select>
        <input type="password" class="api-key-input" placeholder="API key (saved locally)">
        <input type="text" class="custom-url-input" placeholder="Custom base URL (optional)" style="display:none;">
        <select class="model-select" aria-label="Model"></select>
      </div>
      <div class="chat-config-actions">
        <button class="refresh-models" type="button">↻ Models</button>
        <button class="save-config primary" type="button">Save</button>
      </div>
    `;

    const attachPreview=document.createElement('span'); attachPreview.className='attach-preview';
    const inputRow=document.createElement('div'); inputRow.className='chat-input-row';
    inputRow.innerHTML=`<input type="text" placeholder="Message…"><button>Send</button>`;

    const modelPopover=document.createElement('div'); modelPopover.className='chat-model-popover';

    body.appendChild(messages);
    body.appendChild(toolbar);
    body.appendChild(configPanel);
    toolbar.appendChild(attachPreview);
    body.appendChild(modelPopover);
    body.appendChild(inputRow);

    const PROVIDERS={
      openai:{name:'OpenAI',baseURL:'https://api.openai.com/v1',models:['gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-3.5-turbo'],defaultModel:'gpt-4o-mini',
        headers:k=>({'Authorization':`Bearer ${k}`,'Content-Type':'application/json'}),formatMessages:m=>m,parseResponse:d=>d.choices?.[0]?.message?.content||''},
      anthropic:{name:'Anthropic',baseURL:'https://api.anthropic.com/v1',models:['claude-3-5-sonnet-20241022','claude-3-5-haiku-20241022','claude-3-opus-20240229'],defaultModel:'claude-3-5-haiku-20241022',
        headers:k=>({'x-api-key':k,'anthropic-version':'2023-06-01','Content-Type':'application/json'}),formatMessages:m=>{
          const sys=m.find(x=>x.role==='system')?.content||''; return {system:sys,messages:m.filter(x=>x.role!=='system')};
        },parseResponse:d=>d.content?.[0]?.text||''},
      google:{name:'Google',baseURL:'https://generativelanguage.googleapis.com/v1beta',models:['gemini-2.5-flash','gemini-2.5-pro','gemini-2.0-flash'],defaultModel:'gemini-2.5-flash',
        headers:k=>({'Content-Type':'application/json'}),formatMessages:m=>({contents:m.filter(x=>x.role!=='system').map(x=>({role:x.role==='assistant'?'model':'user',parts:[{text:x.content}]}))}),
        parseResponse:d=>d.candidates?.[0]?.content?.parts?.[0]?.text||''},
      nvidia:{name:'NVIDIA NIM',baseURL:'https://integrate.api.nvidia.com/v1',models:['meta/llama-3.1-405b-instruct','meta/llama-3.1-70b-instruct','meta/llama-3.1-8b-instruct'],defaultModel:'meta/llama-3.1-70b-instruct',
        headers:k=>({'Authorization':`Bearer ${k}`,'Content-Type':'application/json'}),formatMessages:m=>m,parseResponse:d=>d.choices?.[0]?.message?.content||''},
      openrouter:{name:'OpenRouter',baseURL:'https://openrouter.ai/api/v1',models:['openai/gpt-4o-mini','google/gemini-2.5-flash','anthropic/claude-3.5-sonnet','meta-llama/llama-3.3-70b-instruct'],defaultModel:'openai/gpt-4o-mini',
        headers:k=>({'Authorization':`Bearer ${k}`,'Content-Type':'application/json','HTTP-Referer':location.origin,'X-Title':'DASH'}),formatMessages:m=>m,parseResponse:d=>d.choices?.[0]?.message?.content||''},
      groq:{name:'Groq',baseURL:'https://api.groq.com/openai/v1',models:['llama-3.3-70b-versatile','llama-3.1-8b-instant','gemma2-9b-it'],defaultModel:'llama-3.3-70b-versatile',
        headers:k=>({'Authorization':`Bearer ${k}`,'Content-Type':'application/json'}),formatMessages:m=>m,parseResponse:d=>d.choices?.[0]?.message?.content||''},
      together:{name:'Together AI',baseURL:'https://api.together.xyz/v1',models:['meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo','meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo','Qwen/Qwen2.5-72B-Instruct-Turbo'],defaultModel:'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
        headers:k=>({'Authorization':`Bearer ${k}`,'Content-Type':'application/json'}),formatMessages:m=>m,parseResponse:d=>d.choices?.[0]?.message?.content||''},
      custom:{name:'Custom',baseURL:'',models:[],defaultModel:'',headers:k=>({'Authorization':`Bearer ${k}`,'Content-Type':'application/json'}),formatMessages:m=>m,parseResponse:d=>d.choices?.[0]?.message?.content||''}
    };

    const saved=JSON.parse(localStorage.getItem('dash_chat_byok')||'{}');
    let currentProvider=saved.provider||'openai', currentKey=saved.key||'', currentModel=saved.model||'',
        currentCustomURL=saved.customURL||'', attachedFile=null, busy=false;
    let history=JSON.parse(localStorage.getItem('dash_chat_byok_history')||'[]');
    if(!history.length) history=[{role:'system',content:'You are a helpful assistant in a personal dashboard. Be concise.'}];

    const providerSel=configPanel.querySelector('.provider-select');
    const keyInput=configPanel.querySelector('.api-key-input');
    const customURLInput=configPanel.querySelector('.custom-url-input');
    const modelSel=configPanel.querySelector('.model-select');
    const modelBtn=toolbar.querySelector('.chat-model-btn');
    const modelName=toolbar.querySelector('.model-name');
    const status=toolbar.querySelector('.chat-byok-status');

    function saveConfig(){
      currentKey=keyInput.value.trim();
      currentModel=modelSel.value||currentModel||PROVIDERS[currentProvider].defaultModel;
      currentCustomURL=customURLInput.value.trim();
      localStorage.setItem('dash_chat_byok',JSON.stringify({provider:currentProvider,key:currentKey,model:currentModel,customURL:currentCustomURL}));
      updateModelUI();
    }
    function updateModelUI(){
      const p=PROVIDERS[currentProvider];
      modelName.textContent=currentModel||p.defaultModel||'Choose model';
      modelName.title=`${p.name} · ${currentModel||p.defaultModel||'No model'}`;
      status.textContent=currentKey?'● READY':'○ SETUP';
    }
    function populateModels(){
      const p=PROVIDERS[currentProvider];
      customURLInput.style.display=currentProvider==='custom'?'block':'none';
      keyInput.placeholder=currentProvider==='custom'?'API key (optional)':'API key (saved locally)';
      const models=p.models||[];
      modelSel.innerHTML=models.length?models.map(m=>`<option value="${m}">${m}</option>`).join(''):'<option value="">No models loaded</option>';
      if(currentModel && models.includes(currentModel)) modelSel.value=currentModel;
      else { currentModel=models[0]||p.defaultModel||''; if(currentModel) modelSel.value=currentModel; }
      updateModelUI();
    }
    async function refreshModels(){
      const p=PROVIDERS[currentProvider];
      if(!currentKey || currentProvider==='custom'){
        populateModels(); return;
      }
      if(!p.baseURL){ populateModels(); return; }
      try{
        const r=await fetch(`${p.baseURL}/models`,{headers:p.headers(currentKey)});
        if(!r.ok) throw new Error(`${r.status}`);
        const d=await r.json();
        const list=(d.data||d.models||[]).map(x=>x.id||x.name).filter(Boolean);
        if(list.length) p.models=list.slice(0,300);
        populateModels();
        status.textContent=`● ${p.models.length} MODELS`;
      }catch(e){
        status.textContent='○ STATIC MODELS';
        populateModels();
      }
    }

    providerSel.value=currentProvider; keyInput.value=currentKey; customURLInput.value=currentCustomURL;
    providerSel.addEventListener('change',()=>{currentProvider=providerSel.value;currentModel='';populateModels();});
    modelSel.addEventListener('change',()=>{currentModel=modelSel.value;saveConfig();});
    configPanel.querySelector('.save-config').addEventListener('click',()=>{saveConfig();configPanel.classList.remove('open');modelBtn.classList.remove('active');});
    configPanel.querySelector('.refresh-models').addEventListener('click',refreshModels);
    modelBtn.addEventListener('click',()=>{
      renderModelPopover();
      modelPopover.classList.toggle('open');
      modelBtn.classList.toggle('active',modelPopover.classList.contains('open'));
      if(modelPopover.classList.contains('open')) refreshModels();
    });

    function renderModelPopover(){
      const models=PROVIDERS[currentProvider].models||[];
      if(!models.length){modelPopover.innerHTML='<div class="chat-model-empty">Configure an API key to load models.</div>';return;}
      modelPopover.innerHTML=models.map(m=>`<button class="chat-model-option ${m===currentModel?'selected':''}" data-model="${escapeHtml(m)}">${escapeHtml(m)}</button>`).join('');
      modelPopover.querySelectorAll('.chat-model-option').forEach(b=>b.addEventListener('click',()=>{
        currentModel=b.dataset.model; saveConfig(); modelPopover.classList.remove('open'); renderModelPopover();
      }));
    }
    // The compact model control is the normal selector; the panel is only for provider/key changes.
    document.addEventListener('click',e=>{
      if(!e.target.closest('.chat-byok-body')){modelPopover.classList.remove('open');modelBtn.classList.remove('active');}
    });

    function add(role,content,isHtml=false){
      const el=document.createElement('div');el.className='chat-msg '+role;
      if(isHtml) el.innerHTML=content; else el.textContent=content;
      messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
    }
    history.forEach(m=>{if(m.role!=='system')add(m.role,m.content);});

    const fileInput=toolbar.querySelector('input[type=file]');
    toolbar.querySelector('.attach-btn').addEventListener('click',()=>fileInput.click());
    fileInput.addEventListener('change',e=>{
      if(e.target.files[0]){
        attachedFile=e.target.files[0];
        attachPreview.innerHTML=`${attachedFile.type.startsWith('image/')?`<img src="${URL.createObjectURL(attachedFile)}">`:'📄'} ${escapeHtml(attachedFile.name)} <button class="attach-remove">✕</button>`;
        attachPreview.querySelector('.attach-remove').onclick=()=>{attachedFile=null;attachPreview.innerHTML='';};
      }
    });

    async function send(text){
      if(busy) return;
      const userText=text.trim();
      if(!userText && !attachedFile)return;
      if(!currentKey){add('error','⚠ Configure and save your API key first.');configPanel.classList.add('open');return;}
      if(!currentModel){add('error','⚠ Choose a model first.');return;}
      busy=true;
      if(userText)add('user',userText);
      if(attachedFile)add('user',attachedFile.type.startsWith('image/')?`<img src="${URL.createObjectURL(attachedFile)}" style="max-width:100%;border-radius:8px;">`:`📎 Attached: ${escapeHtml(attachedFile.name)}`,attachedFile.type.startsWith('image/'));
      history.push({role:'user',content:userText||'[attachment]'});
      localStorage.setItem('dash_chat_byok_history',JSON.stringify(history));
      const typing=document.createElement('div');typing.className='chat-typing';typing.textContent='Thinking…';messages.appendChild(typing);
      const sendBtn=inputRow.querySelector('button');sendBtn.disabled=true;
      try{
        const p=PROVIDERS[currentProvider];
        const baseURL=currentProvider==='custom'?currentCustomURL:p.baseURL;
        if(!baseURL)throw new Error('Custom provider needs Base URL');
        let apiMessages=p.formatMessages(history), body={model:currentModel,messages:apiMessages,temperature:.7,max_tokens:2048};
        let headers=p.headers(currentKey), url=`${baseURL}/chat/completions`;
        if(currentProvider==='anthropic'){
          body={model:currentModel,...apiMessages,max_tokens:2048,temperature:.7};url=`${baseURL}/messages`;
        }else if(currentProvider==='google'){
          body=p.formatMessages(history);body.generationConfig={temperature:.7,maxOutputTokens:2048};
          url=`${baseURL}/models/${currentModel}:generateContent?key=${encodeURIComponent(currentKey)}`;
        }
        const r=await fetch(url,{method:'POST',headers,body:JSON.stringify(body)});
        typing.remove();
        if(!r.ok){const er=await r.json().catch(()=>({}));throw new Error(`${r.status}: ${er.error?.message||er.message||'API error'}`);}
        const d=await r.json(),reply=p.parseResponse(d);
        if(!reply)throw new Error('Empty response');
        add('ai',reply);history.push({role:'assistant',content:reply});
        localStorage.setItem('dash_chat_byok_history',JSON.stringify(history));
        attachedFile=null;attachPreview.innerHTML='';
      }catch(e){typing.remove();add('error','❌ '+e.message);}
      busy=false;sendBtn.disabled=false;
    }

    const input=inputRow.querySelector('input'),sendBtn=inputRow.querySelector('button');
    sendBtn.addEventListener('click',()=>{send(input.value);input.value='';});
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input.value);input.value='';}});

    const clearBtn=document.createElement('button');clearBtn.className='icon-btn';clearBtn.style.alignSelf='flex-start';clearBtn.style.marginTop='8px';
    clearBtn.textContent='🗑 Clear';clearBtn.onclick=()=>{
      if(confirm('Clear chat history?')){localStorage.removeItem('dash_chat_byok_history');history=[{role:'system',content:'You are a helpful assistant in a personal dashboard. Be concise.'}];messages.innerHTML='';}
    };
    body.appendChild(clearBtn);

    populateModels(); updateModelUI();
  }

  /* ===================== GITHUB ===================== */
  function buildGithub(body, w){
    const cfg = loadCfg('github', w.id, { username: '' });
    const inputRow = document.createElement('div'); inputRow.className = 'gh-input-row';
    inputRow.innerHTML = `<input type="text" placeholder="GitHub username…"><button>Go</button>`;
    const profile = document.createElement('div'); profile.className = 'gh-profile';
    const bio = document.createElement('div'); bio.className = 'gh-bio';
    const stats = document.createElement('div'); stats.className = 'gh-stats';
    body.appendChild(inputRow); body.appendChild(profile); body.appendChild(bio); body.appendChild(stats);

    const saved = JSON.parse(localStorage.getItem(LS_GH) || 'null');

    async function loadUser(username){
      try {
        const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        if(!r.ok) throw new Error('User not found');
        const d = await r.json();
        profile.innerHTML = `
          <img class="gh-avatar" src="${d.avatar_url}" alt="">
          <div>
            <div class="gh-name">${d.name || d.login}</div>
            <div class="gh-login">@${d.login}</div>
          </div>
        `;
        bio.textContent = d.bio || '';
        stats.innerHTML = `
          <span><strong>${d.public_repos}</strong> repos</span>
          <span><strong>${d.followers}</strong> followers</span>
          <span><strong>${d.following}</strong> following</span>
        `;
        localStorage.setItem(LS_GH, JSON.stringify(d.login));
      } catch(e){
        profile.innerHTML = '';
        bio.textContent = e.message;
        stats.innerHTML = '';
      }
    }

    const input = inputRow.querySelector('input');
    const btn = inputRow.querySelector('button');
    btn.addEventListener('click', () => { if(input.value.trim()) loadUser(input.value.trim()); });
    input.addEventListener('keydown', e => { if(e.key==='Enter' && input.value.trim()) loadUser(input.value.trim()); });

    if(saved) loadUser(saved);
    else if(cfg.username) loadUser(cfg.username);
  }

  /* ===================== WORLD CLOCK ===================== */
  function buildWorldClock(body, w){
    const cfg = loadCfg('worldclock', w.id, [
      { city:'NYC', tz:'America/New_York' },
      { city:'LON', tz:'Europe/London' },
      { city:'TYO', tz:'Asia/Tokyo' },
      { city:'SYD', tz:'Australia/Sydney' }
    ]);
    const zones = cfg;
    const grid = document.createElement('div'); grid.className = 'wc-grid';
    body.appendChild(grid);

    function paint(){
      grid.innerHTML = zones.map(z => {
        const t = new Date().toLocaleTimeString('en-US', { timeZone: z.tz, hour:'2-digit', minute:'2-digit', hour12:false });
        return `<div class="wc-item"><div class="wc-city">${z.city}</div><div class="wc-time">${t}</div></div>`;
      }).join('');
    }
    paint();
    setInterval(paint, 1000);
  }


  /* ===================== ANILIST ===================== */
  const LS_ANILIST_TOKEN = 'dash_anilist_token';
  const LS_ANILIST_USER  = 'dash_anilist_user';
  const ANILIST_GQL = 'https://graphql.anilist.co';

  // Read token from URL fragment after OAuth redirect (implicit grant)
  (function parseAniListToken(){
    const hash = window.location.hash;
    if(!hash.includes('access_token')) return;
    const params = new URLSearchParams(hash.replace('#',''));
    const token = params.get('access_token');
    if(token){
      localStorage.setItem(LS_ANILIST_TOKEN, token);
      history.replaceState(null,'',window.location.pathname+window.location.search);
    }
  })();

  function getAniListToken(){ return localStorage.getItem(LS_ANILIST_TOKEN)||null; }

  async function aniGQL(query, variables={}, token=null){
    const headers = { 'Content-Type':'application/json', 'Accept':'application/json' };
    if(token) headers['Authorization'] = 'Bearer ' + token;
    const r = await fetch(ANILIST_GQL, {
      method:'POST',
      headers,
      body: JSON.stringify({ query, variables })
    });
    const d = await r.json();
    if(d.errors) throw new Error(d.errors[0].message);
    return d.data;
  }

  function aniListLoginBtn(clientId){
    return `<a class="al-login-btn" href="https://anilist.co/api/v2/oauth/authorize?client_id=${encodeURIComponent(clientId)}&response_type=token" target="_self">▶ Login con AniList</a>`;
  }

  // Shared login UI shown when no token
  function renderAniListAuth(body, clientIdKey){
    const savedId = localStorage.getItem(clientIdKey)||'';
    body.innerHTML = `
      <div class="al-auth">
        <div class="al-auth-logo">▶ AniList</div>
        <p class="al-auth-hint">Inserisci il tuo Client ID dall’app AniList (<a href="https://anilist.co/settings/developer" target="_blank">settings/developer</a>), poi clicca Login.</p>
        <input class="al-client-input" type="text" placeholder="Client ID" value="${escapeHtml(savedId)}">
        <button class="al-go-btn">Login →</button>
        <div class="al-auth-note">Imposta Redirect URL su <code>https://anilist.co/api/v2/oauth/pin</code> nella tua app AniList se usi il PIN flow, oppure metti l’URL del tuo sito.</div>
      </div>`;
    body.querySelector('.al-go-btn').addEventListener('click', ()=>{
      const id = body.querySelector('.al-client-input').value.trim();
      if(!id) return;
      localStorage.setItem(clientIdKey, id);
      window.location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${encodeURIComponent(id)}&response_type=token`;
    });
  }

  /* ---- Widget 1: Recently Aired Anime ---- */
  function buildAniListRecent(body){
    const token = getAniListToken();
    if(!token){ renderAniListAuth(body,'dash_al_clientid'); return; }

    body.innerHTML = '<div class="al-loading">Caricamento…</div>';

    const QUERY = `
      query($page:Int,$perPage:Int,$airingAt_greater:Int,$airingAt_lesser:Int){
        Page(page:$page,perPage:$perPage){
          airingSchedules(airingAt_greater:$airingAt_greater,airingAt_lesser:$airingAt_lesser,sort:TIME_DESC){
            episode
            airingAt
            media{
              id
              title{ userPreferred }
              coverImage{ medium color }
              format
              episodes
              siteUrl
              mediaListEntry{ status progress }
            }
          }
        }
      }`;
    const now = Math.floor(Date.now()/1000);
    const weekAgo = now - 7*24*3600;

    aniGQL(QUERY,{page:1,perPage:25,airingAt_greater:weekAgo,airingAt_lesser:now},token)
      .then(d=>{
        const schedules = d?.Page?.airingSchedules||[];
        if(!schedules.length){ body.innerHTML='<div class="al-empty">Nessun anime recente</div>'; return; }
        body.innerHTML = `
          <div class="al-header">
            <span>Ultimi 7 giorni</span>
            <button class="al-logout-btn" title="Disconnetti">Esci</button>
          </div>
          <div class="al-recent-list"></div>`;
        body.querySelector('.al-logout-btn').addEventListener('click',()=>{
          localStorage.removeItem(LS_ANILIST_TOKEN);
          buildAniListRecent(body);
        });
        const list = body.querySelector('.al-recent-list');
        list.innerHTML = schedules.map(s=>{
          const m = s.media;
          const color = m.coverImage?.color||'#3db4f2';
          const status = m.mediaListEntry?.status||'';
          const statusBadge = status ? `<span class="al-status-badge al-status-${status.toLowerCase()}">${status}</span>` : '';
          const date = new Date(s.airingAt*1000);
          const dateStr = date.toLocaleDateString([],{month:'short',day:'numeric'});
          return `<a class="al-recent-item" href="${escapeHtml(m.siteUrl)}" target="_blank" rel="noopener" style="--al-color:${escapeHtml(color)}">
            <img class="al-cover" src="${escapeHtml(m.coverImage?.medium||'')}" alt="" loading="lazy">
            <div class="al-recent-info">
              <div class="al-title">${escapeHtml(m.title?.userPreferred||'')}</div>
              <div class="al-meta">Ep ${s.episode}${m.episodes?'/'+m.episodes:''} · ${dateStr} ${statusBadge}</div>
            </div>
          </a>`;
        }).join('');
      })
      .catch(e=>{
        if(e.message&&e.message.toLowerCase().includes('invalid')){
          localStorage.removeItem(LS_ANILIST_TOKEN);
          renderAniListAuth(body,'dash_al_clientid');
        } else {
          body.innerHTML = `<div class="al-empty">Errore: ${escapeHtml(e.message)}</div>`;
        }
      });
  }

  /* ---- Widget 2: Notifications ---- */
  function buildAniListNotif(body){
    const token = getAniListToken();
    if(!token){ renderAniListAuth(body,'dash_al_clientid'); return; }

    body.innerHTML = '<div class="al-loading">Caricamento…</div>';

    const QUERY = `
      query($perPage:Int){
        Page(perPage:$perPage){
          notifications(resetNotificationCount:false){
            ... on AiringNotification{
              type episode media{ id title{ userPreferred } siteUrl coverImage{ medium color } }
            }
            ... on RelatedMediaAdditionNotification{
              type media{ id title{ userPreferred } siteUrl coverImage{ medium color } }
            }
            ... on MediaDataChangeNotification{
              type reason media{ id title{ userPreferred } siteUrl }
            }
            ... on ActivityMentionNotification{
              type createdAt user{ name }
            }
            ... on ActivityReplyNotification{
              type createdAt user{ name }
            }
            ... on ActivityLikeNotification{
              type createdAt user{ name }
            }
            ... on FollowingNotification{
              type createdAt user{ name avatar{ medium } }
            }
          }
        }
      }`;

    aniGQL(QUERY,{perPage:20},token)
      .then(d=>{
        const notifs = d?.Page?.notifications||[];
        body.innerHTML = `
          <div class="al-header">
            <span>Notifiche (${notifs.length})</span>
            <button class="al-logout-btn" title="Disconnetti">Esci</button>
          </div>
          <div class="al-notif-list"></div>`;
        body.querySelector('.al-logout-btn').addEventListener('click',()=>{
          localStorage.removeItem(LS_ANILIST_TOKEN);
          buildAniListNotif(body);
        });
        const list = body.querySelector('.al-notif-list');
        if(!notifs.length){ list.innerHTML='<div class="al-empty">Nessuna notifica</div>'; return; }
        list.innerHTML = notifs.map(n=>{
          let icon='◎', text='', href='#', cover='';
          switch(n.type){
            case 'AIRING':
              icon='▶'; text=`Ep ${n.episode} di <b>${escapeHtml(n.media?.title?.userPreferred||'')}</b> disponibile`;
              href=n.media?.siteUrl||'#'; cover=n.media?.coverImage?.medium||'';
              break;
            case 'RELATED_MEDIA_ADDITION':
              icon='➕'; text=`<b>${escapeHtml(n.media?.title?.userPreferred||'')}</b> aggiunto ai correlati`;
              href=n.media?.siteUrl||'#'; cover=n.media?.coverImage?.medium||'';
              break;
            case 'ACTIVITY_MENTION':
              icon='@'; text=`<b>${escapeHtml(n.user?.name||'')}</b> ti ha menzionato`; break;
            case 'ACTIVITY_REPLY':
              icon='↩'; text=`<b>${escapeHtml(n.user?.name||'')}</b> ha risposto`; break;
            case 'ACTIVITY_LIKE':
              icon='♥'; text=`<b>${escapeHtml(n.user?.name||'')}</b> ha messo like`; break;
            case 'FOLLOWING':
              icon='❤'; text=`<b>${escapeHtml(n.user?.name||'')}</b> ti segue ora`;
              cover=n.user?.avatar?.medium||''; break;
            case 'MEDIA_DATA_CHANGE':
              icon='✏'; text=`Dati aggiornati: <b>${escapeHtml(n.media?.title?.userPreferred||'')}</b>`;
              href=n.media?.siteUrl||'#'; break;
            default:
              icon='◎'; text=escapeHtml(n.type||'');
          }
          const imgHtml = cover ? `<img class="al-notif-cover" src="${escapeHtml(cover)}" alt="">` : `<span class="al-notif-icon">${icon}</span>`;
          return `<${href!=='#'?`a href="${escapeHtml(href)}" target="_blank" rel="noopener"`:'div'} class="al-notif-item">
            ${imgHtml}
            <span class="al-notif-text">${text}</span>
          </${href!=='#'?'a':'div'}>`;
        }).join('');
      })
      .catch(e=>{
        if(e.message&&e.message.toLowerCase().includes('invalid')){
          localStorage.removeItem(LS_ANILIST_TOKEN);
          renderAniListAuth(body,'dash_al_clientid');
        } else {
          body.innerHTML = `<div class="al-empty">Errore: ${escapeHtml(e.message)}</div>`;
        }
      });
  }

  /* ---- Widget 3: List Tracker (aggiorna la tua lista) ---- */
  function buildAniListTracker(body){
    const token = getAniListToken();
    if(!token){ renderAniListAuth(body,'dash_al_clientid'); return; }

    body.innerHTML = '<div class="al-loading">Caricamento…</div>';

    const VIEWER_Q = `query{ Viewer{ id name } }`;
    aniGQL(VIEWER_Q,{},token).then(vd=>{
      const userId = vd?.Viewer?.id;
      const userName = vd?.Viewer?.name||'';
      localStorage.setItem(LS_ANILIST_USER, JSON.stringify({id:userId,name:userName}));

      const LIST_Q = `
        query($userId:Int){
          MediaListCollection(userId:$userId,type:ANIME,status:CURRENT,sort:UPDATED_TIME_DESC){
            lists{
              entries{
                id mediaId progress score(format:POINT_10)
                media{
                  id title{ userPreferred } episodes coverImage{ medium color }
                  siteUrl nextAiringEpisode{ episode }
                }
              }
            }
          }
        }`;

      return aniGQL(LIST_Q,{userId},token).then(ld=>{
        const entries = (ld?.MediaListCollection?.lists||[]).flatMap(l=>l.entries||[]);
        body.innerHTML = `
          <div class="al-header">
            <span>▶ ${escapeHtml(userName)} — In corso</span>
            <button class="al-logout-btn" title="Disconnetti">Esci</button>
          </div>
          <div class="al-search-row">
            <input class="al-search" type="text" placeholder="Filtra anime…">
          </div>
          <div class="al-tracker-list"></div>`;
        body.querySelector('.al-logout-btn').addEventListener('click',()=>{
          localStorage.removeItem(LS_ANILIST_TOKEN);
          buildAniListTracker(body);
        });
        const listEl = body.querySelector('.al-tracker-list');
        const searchEl = body.querySelector('.al-search');

        function renderEntries(filter=''){
          const lf = filter.toLowerCase();
          const shown = filter ? entries.filter(e=>e.media?.title?.userPreferred?.toLowerCase().includes(lf)) : entries;
          if(!shown.length){ listEl.innerHTML='<div class="al-empty">Nessun anime in corso</div>'; return; }
          listEl.innerHTML = shown.map(entry=>{
            const m = entry.media;
            const total = m.episodes||m.nextAiringEpisode?.episode||'?';
            const color = m.coverImage?.color||'#3db4f2';
            return `<div class="al-tracker-item" data-entry-id="${entry.id}" data-media-id="${m.id}" data-progress="${entry.progress}" data-total="${typeof total==='number'?total:0}" style="--al-color:${escapeHtml(color)}">
              <img class="al-cover-sm" src="${escapeHtml(m.coverImage?.medium||'')}" alt="" loading="lazy">
              <div class="al-tracker-info">
                <a class="al-title" href="${escapeHtml(m.siteUrl)}" target="_blank" rel="noopener">${escapeHtml(m.title?.userPreferred||'')}</a>
                <div class="al-progress-row">
                  <button class="al-ep-btn al-ep-minus" title="Ep -1">−</button>
                  <span class="al-ep-cur">${entry.progress}</span>
                  <span class="al-ep-sep">/</span>
                  <span class="al-ep-tot">${total}</span>
                  <button class="al-ep-btn al-ep-plus" title="Ep +1">+</button>
                  <select class="al-status-sel">
                    <option value="CURRENT" selected>In corso</option>
                    <option value="COMPLETED">Completato</option>
                    <option value="PAUSED">In pausa</option>
                    <option value="DROPPED">Abbandonato</option>
                    <option value="PLANNING">Pianificato</option>
                  </select>
                </div>
              </div>
            </div>`;
          }).join('');

          // bind buttons
          listEl.querySelectorAll('.al-tracker-item').forEach(item=>{
            const entryId = parseInt(item.dataset.entryId);
            const mediaId = parseInt(item.dataset.mediaId);
            let progress = parseInt(item.dataset.progress)||0;
            const total = parseInt(item.dataset.total)||0;
            const curEl = item.querySelector('.al-ep-cur');
            const statusSel = item.querySelector('.al-status-sel');
            let saveTimer = null;

            function saveProgress(){
              clearTimeout(saveTimer);
              saveTimer = setTimeout(async()=>{
                item.classList.add('al-saving');
                try{
                  const MUT = `mutation($id:Int,$mediaId:Int,$progress:Int,$status:MediaListStatus){
                    SaveMediaListEntry(id:$id,mediaId:$mediaId,progress:$progress,status:$status){ id progress status }
                  }`;
                  await aniGQL(MUT,{id:entryId,mediaId,progress,status:statusSel.value},token);
                  item.classList.remove('al-saving');
                  item.classList.add('al-saved');
                  setTimeout(()=>item.classList.remove('al-saved'),1500);
                }catch(err){
                  item.classList.remove('al-saving');
                  item.classList.add('al-error');
                  setTimeout(()=>item.classList.remove('al-error'),2000);
                }
              },800);
            }

            item.querySelector('.al-ep-plus').addEventListener('click',()=>{
              if(total && progress>=total) return;
              progress++;
              curEl.textContent = progress;
              saveProgress();
            });
            item.querySelector('.al-ep-minus').addEventListener('click',()=>{
              if(progress<=0) return;
              progress--;
              curEl.textContent = progress;
              saveProgress();
            });
            statusSel.addEventListener('change', saveProgress);
          });
        }

        renderEntries();
        searchEl.addEventListener('input',()=>renderEntries(searchEl.value));
      });
    }).catch(e=>{
      if(e.message&&e.message.toLowerCase().includes('invalid')){
        localStorage.removeItem(LS_ANILIST_TOKEN);
        renderAniListAuth(body,'dash_al_clientid');
      } else {
        body.innerHTML = `<div class="al-empty">Errore: ${escapeHtml(e.message)}</div>`;
      }
    });
  }

  /* ===================== MODALS (widget + settings) ===================== */
  const modalBackdrop = document.getElementById('modalBackdrop');
  const settingsBackdrop = document.getElementById('settingsBackdrop');
  const choiceList = document.getElementById('choiceList');

  function openModal(backdrop){
    backdrop.classList.add('open');
    // hide map tiles behind modals
    document.querySelectorAll('.leaflet-container').forEach(m => m.style.zIndex = '-1');
  }
  function closeModal(backdrop){
    backdrop.classList.remove('open');
    document.querySelectorAll('.leaflet-container').forEach(m => m.style.zIndex = '');
    // re-invalidate map sizes
    document.querySelectorAll('.map-container').forEach(c => {
      if(c._leaflet_map) setTimeout(() => c._leaflet_map.invalidateSize(), 100);
    });
  }

  document.getElementById('addBtn').addEventListener('click', ()=>{
    choiceList.innerHTML = Object.entries(DEFS).map(([key, def])=>`
      <div class="widget-choice" data-type="${key}">
        <div class="wc-icon">${def.icon}</div>
        <div><div class="wc-label">${widgetTitle(key)}</div><div class="wc-desc">${widgetDesc(key)}</div></div>
      </div>`).join('');
    choiceList.querySelectorAll('.widget-choice').forEach(c=>{
      c.addEventListener('click', ()=>{
        const type = c.dataset.type;
        layout.push({ id: uid(), type, size: DEFS[type].size });
        saveLayout();
        renderGrid();
        closeModal(modalBackdrop);
      });
    });
    openModal(modalBackdrop);
  });
  document.getElementById('modalClose').addEventListener('click', ()=> closeModal(modalBackdrop));
  modalBackdrop.addEventListener('click', e=>{ if(e.target===modalBackdrop) closeModal(modalBackdrop); });

  // Settings
  const settingsBtn = document.getElementById('settingsBtn');
  settingsBtn.addEventListener('click', ()=>{
    const isComplex = document.body.classList.contains('complex-mode');
    complexToggle.classList.toggle('on', isComplex);
    openModal(settingsBackdrop);
  });
  document.getElementById('settingsClose').addEventListener('click', ()=> closeModal(settingsBackdrop));
  document.getElementById('openByokSettings').addEventListener('click', ()=>{
    closeModal(settingsBackdrop);
    const byok=document.querySelector('.chat-byok-body');
    if(byok){
      byok.querySelector('.chat-config-panel')?.classList.add('open');
      byok.querySelector('.chat-model-btn')?.classList.add('active');
      byok.scrollIntoView({behavior:'smooth',block:'center'});
    } else {
      // Chat BYOK is not on the dashboard yet; add it once and open its configuration.
      const w={id:uid(),type:'chatbyok',size:DEFS.chatbyok.size};
      layout.push(w); saveLayout(); renderGrid();
      setTimeout(()=>{
        const el=document.querySelector(`[data-id="${w.id}"]`);
        el?.querySelector('.chat-config-panel')?.classList.add('open');
        el?.querySelector('.chat-model-btn')?.classList.add('active');
        el?.scrollIntoView({behavior:'smooth',block:'center'});
      },50);
    }
  });
  settingsBackdrop.addEventListener('click', e=>{ if(e.target===settingsBackdrop) closeModal(settingsBackdrop); });

  const complexToggle = document.getElementById('complexToggle');
  complexToggle.addEventListener('click', ()=>{
    complexToggle.classList.toggle('on');
    document.body.classList.toggle('complex-mode');
    localStorage.setItem('dash_complex', document.body.classList.contains('complex-mode') ? '1' : '0');
    renderGrid();
  });

  // Language selector
  const langSelect = document.getElementById('langSelect');
  if(langSelect){
    langSelect.value = currentLang;
    langSelect.addEventListener('change', () => {
      currentLang = langSelect.value;
      localStorage.setItem(LS_LANG, currentLang);
      applyI18n();
      renderGrid();
    });
  }

  // restore complex mode
  if(localStorage.getItem('dash_complex') === '1'){
    document.body.classList.add('complex-mode');
    complexToggle.classList.add('on');
  }

  document.getElementById('resetLayout').addEventListener('click', ()=>{
    if(!confirm('Reset layout to default?')) return;
    localStorage.removeItem(LS_LAYOUT);
    layout = loadLayout();
    renderGrid();
    closeModal(settingsBackdrop);
  });

  document.getElementById('clearAll').addEventListener('click', ()=>{
    if(!confirm('Clear all notes, todos, events, bookmarks, and city data?')) return;
    const keys = Object.keys(localStorage).filter(k => k.startsWith('dash_'));
    keys.forEach(k => localStorage.removeItem(k));
    layout = loadLayout();
    renderGrid();
    closeModal(settingsBackdrop);
  });


  /* ===================== SEARCH BAR + AUTOCOMPLETE ===================== */
  const searchInput = document.getElementById('searchInput');
  const searchHint = document.getElementById('searchHint');
  const autocomplete = document.getElementById('autocomplete');
  window.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) { e.preventDefault(); searchInput?.focus(); searchInput?.select(); if(searchInput?.value?.trim()) renderAutocomplete(searchInput.value); } });
  let acIndex = -1;
  let acItems = [];

  const BANGS = {
    '!yt': q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q),
    '!gh': q => 'https://github.com/search?q=' + encodeURIComponent(q),
    '!w':  q => 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(q),
    '!ddg': q => 'https://duckduckgo.com/?q=' + encodeURIComponent(q),
    '!r':  q => 'https://reddit.com/search/?q=' + encodeURIComponent(q),
    '!so': q => 'https://stackoverflow.com/search?q=' + encodeURIComponent(q),
    '!npm': q => 'https://www.npmjs.com/search?q=' + encodeURIComponent(q),
    '!ghr': q => 'https://github.com/search?q=' + encodeURIComponent(q) + '&type=repositories'
  };

  function getBookmarks(){
    try{ return JSON.parse(localStorage.getItem(LS_BM)||'[]'); }catch(e){ return []; }
  }

  let acTimer=null;

  function fetchPublicAutocomplete(query){
    return new Promise(resolve => {
      const cbName = '__gsac_' + Date.now();
      const s = document.createElement('script');
      let settled = false;
      const finish = (res) => {
        if(settled) return;
        settled = true;
        clearTimeout(timer);
        try{ document.head.removeChild(s); }catch(e){}
        delete window[cbName];
        resolve(res);
      };
      const timer = setTimeout(() => finish([]), 3000);
      window[cbName] = (data) => {
        try{ finish((data[1]||[]).slice(0,8).map(x=> Array.isArray(x)?x[0]:x).filter(Boolean)); }
        catch(e){ finish([]); }
      };
      s.onerror = () => finish([]);
      s.src = 'https://suggestqueries.google.com/complete/search?client=firefox&q='
        + encodeURIComponent(query) + '&callback=' + cbName;
      document.head.appendChild(s);
    });
  }

  async function renderAutocomplete(query){
    const v=query.trim();
    if(!v){autocomplete.classList.remove('open');acItems=[];acIndex=-1;searchHint.textContent='';return;}
    const lower=v.toLowerCase();
    const bang=Object.keys(BANGS).find(b=>lower.startsWith(b+' ')||lower===b);
    searchHint.textContent=bang?bang.toUpperCase():'';

    const bm=getBookmarks().filter(b=>b.name.toLowerCase().includes(lower)||b.url.toLowerCase().includes(lower));
    const bangMatches=Object.keys(BANGS).filter(b=>b.includes(lower));
    let suggestions=await fetchPublicAutocomplete(v);
    if(searchInput.value.trim()!==v)return;

    let html='', items=[];
    if(bm.length){
      html+=`<div class="ac-section"><div class="ac-section-title">BOOKMARKS</div>`;
      bm.slice(0,4).forEach(b=>{
        let host='';try{host=new URL(b.url).hostname;}catch(e){}
        html+=`<div class="ac-item"><span class="ac-icon">☆</span><span class="ac-text">${escapeHtml(b.name)}</span><span class="ac-hint">${escapeHtml(host)}</span></div>`;
        items.push({type:'bookmark',url:b.url});
      });
      html+='</div>';
    }
    if(bangMatches.length){
      html+=`<div class="ac-section"><div class="ac-section-title">BANGS</div>`;
      bangMatches.forEach(b=>{
        html+=`<div class="ac-item"><span class="ac-icon">⚡</span><span class="ac-text">${b}</span><span class="ac-hint">Search</span></div>`;
        items.push({type:'bang',bang:b});
      });
      html+='</div>';
    }
    if(suggestions.length){
      html+=`<div class="ac-section"><div class="ac-section-title">WEB SUGGESTIONS</div>`;
      suggestions.forEach(q=>{
        html+=`<div class="ac-item"><span class="ac-icon">⌕</span><span class="ac-text">${escapeHtml(q)}</span></div>`;
        items.push({type:'suggestion',query:q});
      });
      html+='</div>';
    }
    if(!html){html=`<div class="ac-empty">Search "${escapeHtml(v)}"</div>`;items=[{type:'web',query:v}];}
    autocomplete.innerHTML=html;autocomplete.classList.add('open');acItems=items;acIndex=-1;
    autocomplete.querySelectorAll('.ac-item').forEach((el,i)=>el.addEventListener('mousedown',e=>{e.preventDefault();executeAutocomplete(acItems[i]);}));
  }

  function selectAutocomplete(index){
    const items=autocomplete.querySelectorAll('.ac-item');
    items.forEach((el,i)=>el.classList.toggle('active',i===index));
    if(index>=0&&index<items.length)items[index].scrollIntoView({block:'nearest'});
  }

  function executeAutocomplete(item){
    if(item.type==='bookmark')window.open(item.url,'_blank');
    else if(item.type==='bang'){searchInput.value=item.bang+' ';searchInput.focus();renderAutocomplete(searchInput.value);}
    else {
      const q=item.query||'';
      const bangKey=Object.keys(BANGS).find(b=>q.toLowerCase().startsWith(b+' '));
      const url=bangKey?BANGS[bangKey](q.slice(bangKey.length).trim()):'https://www.google.com/search?q='+encodeURIComponent(q);
      window.open(url,'_blank');
    }
    if(item.type!=='bang'){searchInput.value='';autocomplete.classList.remove('open');searchHint.textContent='';}
  }

  searchInput.addEventListener('input',()=>{
    clearTimeout(acTimer);
    acTimer=setTimeout(()=>renderAutocomplete(searchInput.value),180);
  });
  searchInput.addEventListener('focus',()=>{if(searchInput.value.trim())renderAutocomplete(searchInput.value);});
  document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))autocomplete.classList.remove('open');});

  searchInput.addEventListener('keydown',e=>{
    const items=autocomplete.querySelectorAll('.ac-item');
    if(e.key==='Escape'){autocomplete.classList.remove('open');return;}
    if(e.key==='ArrowDown'){e.preventDefault();if(!items.length)return;acIndex=Math.min(acIndex+1,items.length-1);selectAutocomplete(acIndex);return;}
    if(e.key==='ArrowUp'){e.preventDefault();acIndex=Math.max(acIndex-1,-1);selectAutocomplete(acIndex);return;}
    if(e.key==='Tab'){
      if(!autocomplete.classList.contains('open')||!acItems.length)return;
      e.preventDefault();
      acIndex=Math.min(acIndex+1,acItems.length-1);
      selectAutocomplete(acIndex);
      const item=acItems[acIndex];
      if(!item)return;
      if(item.type==='bookmark'){searchInput.value=item.url;}
      else if(item.type==='bang'){searchInput.value=item.bang+' ';}
      else{searchInput.value=item.query||'';}
      return;
    }
    if(e.key==='Enter'){
      if(acIndex>=0&&acItems[acIndex]){e.preventDefault();executeAutocomplete(acItems[acIndex]);return;}
      e.preventDefault();const v=searchInput.value.trim();if(!v)return;
      const bangKey=Object.keys(BANGS).find(b=>v.toLowerCase().startsWith(b+' '));
      const url=bangKey?BANGS[bangKey](v.slice(bangKey.length).trim()):'https://www.google.com/search?q='+encodeURIComponent(v);
      window.open(url,'_blank');searchInput.value='';autocomplete.classList.remove('open');searchHint.textContent='';
    }
  });

  /* ===================== INIT ===================== */
  // Inject runtime styles for new components
  (function injectStyles(){
    const style = document.createElement('style');
    style.textContent = `
      /* Weather hourly forecast strip */
      .weather-forecast{display:flex;gap:6px;overflow-x:auto;padding:6px 0 2px;scrollbar-width:none;margin-top:4px;}
      .weather-forecast::-webkit-scrollbar{display:none;}
      .wf-slot{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:36px;flex-shrink:0;}
      .wf-time{font-size:9px;opacity:.5;letter-spacing:.04em;text-transform:uppercase;}
      .wf-icon{font-size:16px;line-height:1;}
      .wf-temp{font-size:11px;font-weight:600;}
      /* AniList widgets */
      .al-auth{display:flex;flex-direction:column;gap:10px;padding:8px;}
      .al-auth-logo{font-size:18px;font-weight:700;color:#3db4f2;letter-spacing:.06em;}
      .al-auth-hint{font-size:11px;opacity:.7;margin:0;line-height:1.5;}
      .al-auth-hint a{color:#3db4f2;}
      .al-auth-note{font-size:10px;opacity:.5;line-height:1.4;}
      .al-auth-note code{background:var(--c-surface2,rgba(255,255,255,.08));padding:1px 4px;border-radius:3px;font-size:10px;}
      .al-client-input,.al-search{width:100%;padding:6px 8px;background:var(--c-surface2,rgba(255,255,255,.08));border:1px solid var(--c-border,rgba(255,255,255,.12));border-radius:6px;color:inherit;font-size:12px;box-sizing:border-box;}
      .al-go-btn,.al-login-btn{display:inline-block;padding:7px 16px;background:#3db4f2;color:#000;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;letter-spacing:.04em;}
      .al-go-btn:hover,.al-login-btn:hover{background:#5bc4ff;}
      .al-loading,.al-empty{padding:20px;opacity:.5;font-size:12px;text-align:center;}
      .al-header{display:flex;align-items:center;justify-content:space-between;padding:4px 0 8px;font-size:11px;font-weight:600;letter-spacing:.06em;opacity:.7;}
      .al-logout-btn{background:none;border:none;color:inherit;opacity:.4;cursor:pointer;font-size:11px;padding:0;}
      .al-logout-btn:hover{opacity:.8;}
      /* Recent list */
      .al-recent-list{display:flex;flex-direction:column;gap:6px;overflow-y:auto;max-height:calc(100% - 36px);}
      .al-recent-item{display:flex;gap:8px;align-items:center;text-decoration:none;color:inherit;padding:5px 6px;border-radius:6px;border-left:3px solid var(--al-color,#3db4f2);background:var(--c-surface2,rgba(255,255,255,.04));transition:background .15s;}
      .al-recent-item:hover{background:var(--c-surface3,rgba(255,255,255,.1));}
      .al-cover{width:36px;height:50px;object-fit:cover;border-radius:4px;flex-shrink:0;}
      .al-cover-sm{width:28px;height:40px;object-fit:cover;border-radius:3px;flex-shrink:0;}
      .al-recent-info{display:flex;flex-direction:column;gap:3px;min-width:0;}
      .al-title{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:inherit;}
      .al-meta{font-size:10px;opacity:.55;display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
      .al-status-badge{font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700;letter-spacing:.04em;background:var(--al-color,#3db4f2);color:#000;}
      .al-status-badge.al-status-current{background:#3db4f2;color:#000;}
      .al-status-badge.al-status-completed{background:#2ecc71;color:#000;}
      .al-status-badge.al-status-paused{background:#e67e22;color:#000;}
      .al-status-badge.al-status-dropped{background:#e74c3c;color:#fff;}
      /* Notification list */
      .al-notif-list{display:flex;flex-direction:column;gap:4px;overflow-y:auto;max-height:calc(100% - 36px);}
      .al-notif-item{display:flex;gap:8px;align-items:center;padding:5px 6px;border-radius:6px;background:var(--c-surface2,rgba(255,255,255,.04));font-size:11px;line-height:1.4;color:inherit;text-decoration:none;}
      .al-notif-item:hover{background:var(--c-surface3,rgba(255,255,255,.1));}
      .al-notif-cover{width:24px;height:34px;object-fit:cover;border-radius:3px;flex-shrink:0;}
      .al-notif-icon{font-size:14px;width:24px;text-align:center;flex-shrink:0;}
      .al-notif-text{min-width:0;}
      /* Tracker */
      .al-search-row{margin-bottom:6px;}
      .al-tracker-list{display:flex;flex-direction:column;gap:6px;overflow-y:auto;max-height:calc(100% - 72px);}
      .al-tracker-item{display:flex;gap:8px;align-items:center;padding:5px 6px;border-radius:6px;border-left:3px solid var(--al-color,#3db4f2);background:var(--c-surface2,rgba(255,255,255,.04));transition:opacity .2s,background .15s;}
      .al-tracker-item.al-saving{opacity:.5;}
      .al-tracker-item.al-saved{background:rgba(46,204,113,.15);}
      .al-tracker-item.al-error{background:rgba(231,76,60,.15);}
      .al-tracker-info{display:flex;flex-direction:column;gap:4px;min-width:0;flex:1;}
      .al-progress-row{display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
      .al-ep-btn{background:var(--c-surface2,rgba(255,255,255,.1));border:none;color:inherit;width:20px;height:20px;border-radius:4px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;}
      .al-ep-btn:hover{background:var(--c-surface3,rgba(255,255,255,.2));}
      .al-ep-cur{font-size:13px;font-weight:700;min-width:16px;text-align:center;}
      .al-ep-sep,.al-ep-tot{font-size:11px;opacity:.5;}
      .al-status-sel{background:var(--c-surface2,rgba(255,255,255,.08));border:1px solid var(--c-border,rgba(255,255,255,.12));border-radius:4px;color:inherit;font-size:10px;padding:2px 4px;cursor:pointer;margin-left:4px;}
      /* Offline banner */
      #offlineBanner{display:none;position:fixed;top:0;left:0;right:0;z-index:9999;
        background:#e74c3c;color:#fff;text-align:center;font-size:12px;
        letter-spacing:.08em;padding:5px 0;font-family:inherit;}
      body.offline #offlineBanner{display:block;}
    `;
    document.head.appendChild(style);
    // Offline/online detection
    const banner = document.createElement('div');
    banner.id = 'offlineBanner';
    banner.textContent = '• OFFLINE — showing cached data';
    document.body.prepend(banner);
    function syncOnline(){ document.body.classList.toggle('offline', !navigator.onLine); }
    syncOnline();
    window.addEventListener('online', syncOnline);
    window.addEventListener('offline', syncOnline);
  })();

  // Apply i18n first
  applyI18n();

  // Render grid immediately so widgets appear without waiting for geolocation
  renderGrid();
  // Then request geolocation; if granted, re-render so map/weather can use coords
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos => {
        window.__dashGeo = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        renderGrid();
      },
      () => {},
      { timeout: 8000 }
    );
  }
})();
