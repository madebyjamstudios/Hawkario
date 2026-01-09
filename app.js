// HawkTimer Pro Controller (condensed UI, full features)
(function(){
  const els = {
    mode: document.getElementById('mode'),
    duration: document.getElementById('duration'),
    format: document.getElementById('format'),
    fontFamily: document.getElementById('fontFamily'),
    fontWeight: document.getElementById('fontWeight'),
    fontSize: document.getElementById('fontSize'),
    fontColor: document.getElementById('fontColor'),
    opacity: document.getElementById('opacity'),
    strokeWidth: document.getElementById('strokeWidth'),
    strokeColor: document.getElementById('strokeColor'),
    shadow: document.getElementById('shadow'),
    align: document.getElementById('align'),
    letterSpacing: document.getElementById('letterSpacing'),
    bgMode: document.getElementById('bgMode'),
    bgColor: document.getElementById('bgColor'),
    bgOpacity: document.getElementById('bgOpacity'),
    warnEnable: document.getElementById('warnEnable'),
    warnTime: document.getElementById('warnTime'),
    warnColorEnable: document.getElementById('warnColorEnable'),
    warnColor: document.getElementById('warnColor'),
    warnFlashEnable: document.getElementById('warnFlashEnable'),
    flashRate: document.getElementById('flashRate'),
    preview: document.getElementById('preview'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    openOutput: document.getElementById('openOutput'),
    goFullscreen: document.getElementById('goFullscreen'),
    presetName: document.getElementById('presetName'),
    savePreset: document.getElementById('savePreset'),
    presetList: document.getElementById('presetList'),
    exportPresets: document.getElementById('exportPresets'),
    importPresets: document.getElementById('importPresets'),
    importFile: document.getElementById('importFile')
  };

  let outputWindow = null;
  const channel = new BroadcastChannel('alpha-timer-channel');

  function parseHMS(str){
    const parts = str.trim().split(':').map(s=>parseInt(s,10)||0);
    let h=0,m=0,s=0;
    if(parts.length===3){[h,m,s]=parts;} else if(parts.length===2){[m,s]=parts;} else if(parts.length===1){[s]=parts;}
    return (h*3600)+(m*60)+s;
  }
  function secondsToHMS(total){
    const h = Math.floor(total/3600), m = Math.floor((total%3600)/60), s = total%60;
    const z2 = n=>String(n).padStart(2,'0');
    if(h>0) return `${z2(h)}:${z2(m)}:${z2(s)}`; return `${z2(m)}:${z2(s)}`;
  }
  function fmtPreview(){
    const total = parseHMS(els.duration.value);
    if(els.format.value==='H:MM:SS'){
      const h = Math.floor(total/3600), m = Math.floor((total%3600)/60), s = total%60; const z2 = n=>String(n).padStart(2,'0');
      return `${h}:${z2(m)}:${z2(s)}`;
    }
    if(els.format.value==='SS') return String(total);
    const m = Math.floor(total/60), s = total%60; const z2 = n=>String(n).padStart(2,'0');
    return `${z2(m)}:${z2(s)}`;
  }
  function hexToRgba(hex, opacity){
    const h = hex.replace('#',''); const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  function applyPreview(){
    els.preview.textContent = fmtPreview();
    const previewBox = document.querySelector('.preview');
    const bg = els.bgMode.value === 'solid' ? hexToRgba(els.bgColor.value, parseFloat(els.bgOpacity.value)) : 'transparent';
    previewBox.style.background = bg;
    els.preview.style.fontFamily = els.fontFamily.value;
    els.preview.style.fontWeight = els.fontWeight.value;
    els.preview.style.fontSize = els.fontSize.value + 'vw';
    els.preview.style.color = els.fontColor.value;
    els.preview.style.opacity = els.opacity.value;
    els.preview.style.webkitTextStrokeWidth = els.strokeWidth.value + 'px';
    els.preview.style.webkitTextStrokeColor = els.strokeColor.value;
    els.preview.style.textShadow = els.shadow.value;
    els.preview.style.letterSpacing = els.letterSpacing.value + 'em';
    els.preview.style.textAlign = els.align.value;
  }
  ['input','change'].forEach(evt=>{
    [els.mode,els.duration,els.format,els.fontFamily,els.fontWeight,els.fontSize,els.fontColor,els.opacity,els.strokeWidth,els.strokeColor,els.shadow,els.align,els.letterSpacing,els.bgMode,els.bgColor,els.bgOpacity,els.warnEnable,els.warnTime,els.warnColorEnable,els.warnColor,els.warnFlashEnable,els.flashRate].forEach(el=> el.addEventListener(evt, applyPreview));
  });
  applyPreview();

  function currentConfig(){
    return {
      mode: els.mode.value,
      durationSec: parseHMS(els.duration.value),
      format: els.format.value,
      style: {
        fontFamily: els.fontFamily.value,
        fontWeight: els.fontWeight.value,
        fontSizeVw: parseFloat(els.fontSize.value),
        color: els.fontColor.value,
        opacity: parseFloat(els.opacity.value),
        strokeWidth: parseInt(els.strokeWidth.value,10),
        strokeColor: els.strokeColor.value,
        textShadow: els.shadow.value,
        align: els.align.value,
        letterSpacing: parseFloat(els.letterSpacing.value),
        bgMode: els.bgMode.value,
        bgColor: els.bgColor.value,
        bgOpacity: parseFloat(els.bgOpacity.value)
      },
      warn: {
        enabled: els.warnEnable.value === 'on',
        seconds: parseHMS(els.warnTime.value),
        colorEnabled: els.warnColorEnable.value === 'on',
        color: els.warnColor.value,
        flashEnabled: els.warnFlashEnable.value === 'on',
        flashRateMs: parseInt(els.flashRate.value,10)
      }
    };
  }

  function send(command, cfg){
    const payload = { type: 'TIMER_UPDATE', payload: { command, config: cfg } };
    if(outputWindow && !outputWindow.closed){ outputWindow.postMessage(payload, '*'); }
    channel.postMessage(payload);
  }
  els.startBtn.addEventListener('click', ()=> send('start', currentConfig()));
  els.pauseBtn.addEventListener('click', ()=> send('pause', currentConfig()));
  els.resetBtn.addEventListener('click', ()=> send('reset', currentConfig()));
  els.openOutput.addEventListener('click', ()=>{
    outputWindow = window.open('viewer.html', 'HawkTimerOutput', 'popup=yes');
    setTimeout(()=> send('reset', currentConfig()), 300);
  });
  els.goFullscreen.addEventListener('click', ()=>{
    if(outputWindow && !outputWindow.closed){ outputWindow.focus(); outputWindow.document.documentElement.requestFullscreen && outputWindow.document.documentElement.requestFullscreen(); }
  });

  // Presets
  const storeKey = 'hawktimer-pro-presets-v1';
  function loadPresets(){ try { return JSON.parse(localStorage.getItem(storeKey)) || []; } catch { return []; } }
  function savePresets(list){ localStorage.setItem(storeKey, JSON.stringify(list)); }
  function renderPresetList(){
    const list = loadPresets(); els.presetList.innerHTML = '';
    list.forEach((p, idx)=>{
      const row = document.createElement('div'); row.className='preset-item';
      const name = document.createElement('div'); name.className='preset-name'; name.textContent = p.name;
      const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='6px';
      const applyBtn = document.createElement('button'); applyBtn.textContent='Apply';
      const startBtn = document.createElement('button'); startBtn.textContent='Start'; startBtn.className='secondary';
      const dupBtn = document.createElement('button'); dupBtn.textContent='Duplicate'; dupBtn.className='secondary';
      const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.className='secondary';
      actions.append(applyBtn, startBtn, dupBtn, delBtn);
      row.append(name, actions); els.presetList.append(row);
      applyBtn.onclick = ()=> applyPreset(p);
      startBtn.onclick = ()=> { applyPreset(p); send('start', currentConfig()); };
      dupBtn.onclick = ()=>{ const list2 = loadPresets(); list2.splice(idx+1, 0, { ...p, name: p.name + ' (copy)' }); savePresets(list2); renderPresetList(); };
      delBtn.onclick = ()=>{ const list2 = loadPresets(); list2.splice(idx,1); savePresets(list2); renderPresetList(); };
    });
  }
  function applyPreset(p){
    const c = p.config;
    els.mode.value = c.mode; els.duration.value = secondsToHMS(c.durationSec); els.format.value = c.format;
    els.fontFamily.value = c.style.fontFamily; els.fontWeight.value = c.style.fontWeight; els.fontSize.value = c.style.fontSizeVw;
    els.fontColor.value = c.style.color; els.opacity.value = c.style.opacity; els.strokeWidth.value = c.style.strokeWidth; els.strokeColor.value = c.style.strokeColor;
    els.shadow.value = c.style.textShadow; els.align.value = c.style.align; els.letterSpacing.value = c.style.letterSpacing;
    els.bgMode.value = c.style.bgMode || 'transparent'; els.bgColor.value = c.style.bgColor || '#000000'; els.bgOpacity.value = c.style.bgOpacity ?? 0;
    if(c.warn){ els.warnEnable.value = c.warn.enabled ? 'on':'off'; els.warnTime.value = secondsToHMS(c.warn.seconds); els.warnColorEnable.value = c.warn.colorEnabled ? 'on':'off'; els.warnColor.value = c.warn.color || '#ff3333'; els.warnFlashEnable.value = c.warn.flashEnabled ? 'on':'off'; els.flashRate.value = c.warn.flashRateMs || 500; }
    applyPreview();
  }

  els.savePreset.addEventListener('click', ()=>{
    const name = els.presetName.value.trim() || 'Preset'; const list = loadPresets(); const config = currentConfig();
    list.push({ name, config }); savePresets(list); renderPresetList(); els.presetName.value='';
  });
  els.exportPresets.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(loadPresets(), null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='hawktimer-pro-presets.json'; a.click(); setTimeout(()=> URL.revokeObjectURL(url), 5000);
  });
  els.importPresets.addEventListener('click', ()=> els.importFile.click());
  els.importFile.addEventListener('change', (e)=>{
    const file = e.target.files[0]; if(!file) return; const reader = new FileReader();
    reader.onload = ()=>{ try { const data = JSON.parse(reader.result); if(Array.isArray(data)){ savePresets(data); renderPresetList(); } else alert('Invalid presets file'); } catch(err){ alert('Failed to parse JSON'); } };
    reader.readAsText(file);
  });

  renderPresetList();
})();