"use strict";

// helper for localStorage
function getHrace()   { return JSON.parse(localStorage.getItem('hraci')   || '[]'); }
function saveHrace(h){ localStorage.setItem('hraci', JSON.stringify(h)); }
function getZapasy()  { return JSON.parse(localStorage.getItem('zapasy')  || '[]'); }
function saveZapasy(z){localStorage.setItem('zapasy', JSON.stringify(z));}

// Registrace hráče
function ulozHrace() {
  const j = document.getElementById('jmeno').value.trim(),
        p = document.getElementById('prijmeni').value.trim(),
        s = document.getElementById('skupina').value;
  if (!j || !p) { alert('Vyplňte jméno i příjmení'); return; }
  const arr = getHrace();
  arr.push({ jmeno: j, prijmeni: p, skupina: s });
  saveHrace(arr);
  document.getElementById('jmeno').value = '';
  document.getElementById('prijmeni').value = '';
  naplnCombo('A');
  naplnCombo('B');
  showPopup('Hráč uložen!');
}

// Naplnění selectů
function naplnCombo(g) {
  const grp = g==='A'?'Dospělí':'Děti',
        arr = getHrace(),
        s1  = document.getElementById('hrac1'+g),
        s2  = document.getElementById('hrac2'+g);
  s1.innerHTML = ''; s2.innerHTML = '';
  arr.filter(x=>x.skupina===grp).forEach(x=>{
    const t = x.prijmeni+' '+x.jmeno;
    s1.add(new Option(t,t));
    s2.add(new Option(t,t));
  });
}

// Uložení zápasu
function ulozZapas(g) {
  const h1 = document.getElementById('hrac1'+g).value,
        h2 = document.getElementById('hrac2'+g).value,
        s1 = document.getElementById('skore1'+g).value,
        s2 = document.getElementById('skore2'+g).value,
        s3 = document.getElementById('skore3'+g).value,
        s4 = document.getElementById('skore4'+g).value;
  if(!h1||!h2||h1===h2){ alert('Chybně zvolení hráči'); return; }
  if(s1===''||s2===''||s3===''||s4===''){ alert('Zadejte všechna skóre'); return; }
  const arr = getZapasy();
  arr.push({ h1,h2,s1,s2,s3,s4,skupina:g });
  saveZapasy(arr);
  showPopup('Zápas uložen!');
  renderStats();
}

// Zobraz popup
function showPopup(msg){
  const pop = document.getElementById('zpravaUlozeno');
  pop.textContent = msg;
  pop.style.display = 'block';
  setTimeout(()=>pop.style.display='none',2000);
}

// Skrytí / zobrazení výsledků
function toggleVysledky(){
  const v=document.getElementById('vysledky'),
        b=document.getElementById('btnVysledky');
  if(v.style.display==='block'){
    v.style.display='none'; b.textContent='Zobrazit výsledky';
  } else {
    renderResults(); v.style.display='block'; b.textContent='Skrýt výsledky';
  }
}

// Sestavení tabulek výsledků
function renderResults(){
  const arr = getZapasy(),
        stat = { A:{}, B:{} };
  arr.forEach(z=>{
    const p1 = Number(z.s1)+Number(z.s3),
          p2 = Number(z.s2)+Number(z.s4);
    if(!stat[z.skupina][z.h1]) stat[z.skupina][z.h1]={jmeno:z.h1,vyhry:0,prohry:0,body:0};
    if(!stat[z.skupina][z.h2]) stat[z.skupina][z.h2]={jmeno:z.h2,vyhry:0,prohry:0,body:0};
    stat[z.skupina][z.h1].body += p1;
    stat[z.skupina][z.h2].body += p2;
    if(p1>p2){ stat[z.skupina][z.h1].vyhry++; stat[z.skupina][z.h2].prohry++; }
    else if(p2>p1){ stat[z.skupina][z.h2].vyhry++; stat[z.skupina][z.h1].prohry++; }
  });
  ['A','B'].forEach(g=>{
    const tbl=document.getElementById('tabulka'+g),
          rows=Object.values(stat[g]).sort((a,b)=>b.vyhry-b.vyhry || b.body-a.body);
    let html='<tr><th>Poř.</th><th>Hráč</th><th>Výhry</th><th>Prohry</th><th>Body</th></tr>';
    rows.forEach((r,i)=> html+=`<tr><td>${i+1}</td><td>${r.jmeno}</td><td>${r.vyhry}</td><td>${r.prohry}</td><td>${r.body}</td></tr>`);
    tbl.innerHTML=html;
  });
}

// Statistiky zápasů
function renderStats(){
  ['A','B'].forEach(g=>{
    const hr = getHrace().filter(x=>x.skupina=== (g==='A'?'Dospělí':'Děti')),
          zap = getZapasy().filter(z=>z.skupina===g),
          out = {};
    hr.forEach(p=>{
      const key=p.prijmeni+' '+p.jmeno,
            played=zap.filter(z=>z.h1===key||z.h2===key).length;
      out[key]={ odehral:played, zbyva: Math.max(0,hr.length-1-played) };
    });
    const tb = document.getElementById('statistiky'+(g==='A'?'Dospelem':'Deti'));
    let html='<tr><th>Hráč</th><th>Odehrál</th><th>Zbývá odehrát</th></tr>';
    tb.innerHTML = html+= Object.entries(out).map(([h,s])=>`<tr><td>${h}</td><td>${s.odehral}</td><td>${s.zbyva}</td></tr>`).join('');
  });
}

// Zobrazení / skrytí sekce
function zobraz(id){
  document.querySelectorAll('.section').forEach(s=>s.style.display='none');
  document.getElementById(id).style.display='flex';
}
function zpet(){
  document.querySelectorAll('.section').forEach(s=>s.style.display='none');
}

// Po načtení stránky
window.addEventListener('DOMContentLoaded',()=>{
  naplnCombo('A');
  naplnCombo('B');
  renderStats();
});
