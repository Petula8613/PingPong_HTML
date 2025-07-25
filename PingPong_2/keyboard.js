"use strict";
let activeInput = null, isShift = false, accentBuffer = '', keyboardType = 'text';

const accentMap = {
  'ˇ': { 'c':'č','C':'Č','d':'ď','D':'Ď','e':'ě','E':'Ě','n':'ň','N':'Ň','r':'ř','R':'Ř','s':'š','S':'Š','t':'ť','T':'Ť','z':'ž','Z':'Ž' },
  '´': { 'a':'á','A':'Á','e':'é','E':'É','i':'í','I':'Í','o':'ó','O':'Ó','u':'ú','U':'Ú','y':'ý','Y':'Ý' }
};

const keysText = {
  row1: [[';', '°'], ['+', '1'], ['ě','2'], ['š','3'], ['č','4'], ['ř','5'], ['ž','6'], ['ý','7'], ['á','8'], ['í','9'], ['é','0'], ['=','%'], ['´','ˇ'], ['←','←']],
  row2: [['q','Q'], ['w','W'], ['e','E'], ['r','R'], ['t','T'], ['z','Z'], ['u','U'], ['i','I'], ['o','O'], ['p','P'], ['ú','/'], [')','(']],
  row3: [['a','A'], ['s','S'], ['d','D'], ['f','F'], ['g','G'], ['h','H'], ['j','J'], ['k','K'], ['l','L'], ['ů','"'], ['§','!'], ['¨','"']],
  row4: [['\\','|'], ['y','Y'], ['x','X'], ['c','C'], ['v','V'], ['b','B'], ['n','N'], ['m','M'], [',','?'], ['.',':'], ['-','_']],
  row5: [['SHIFT','SHIFT'], [' ',' '], ['SHIFT','SHIFT'], ['ZAVRIT','ZAVRIT']]
};

const keysNumber = {
  row1: [['7'], ['8'], ['9']],
  row2: [['4'], ['5'], ['6']],
  row3: [['1'], ['2'], ['3']],
  row4: [['←'], ['0'], ['ZAVRIT']],
  row5: []
};

function createRow(rowEl, defs) {
  rowEl.innerHTML = '';
  defs.forEach(k => {
    const [n, s] = k.length === 2 ? k : [k[0], k[0]];
    const btn = document.createElement('button');
    btn.textContent = isShift ? s : n;
    if (n===' '||n==='SHIFT'||n==='ZAVRIT') btn.classList.add('wide');
    if (n===' ') btn.classList.add('extra-wide');
    btn.onclick = e => { e.stopPropagation(); handleKey(n, s); };
    rowEl.appendChild(btn);
  });
}

function handleKey(n, s) {
  const ch = isShift ? s : n;
  switch(n) {
    case '←': if(activeInput) activeInput.value = activeInput.value.slice(0, -1); break;
    case 'SHIFT': isShift = !isShift; renderKeys(); break;
    case 'ZAVRIT': keyboard.classList.remove('visible'); break;
    case ' ': if(activeInput) activeInput.value += ' '; break;
    default:
      if(!activeInput) return;
      if(accentBuffer && accentMap[accentBuffer]?.[ch]) {
        activeInput.value += accentMap[accentBuffer][ch];
        accentBuffer = '';
      } else if(accentMap[ch]) {
        accentBuffer = ch;
      } else {
        activeInput.value += ch;
        accentBuffer = '';
      }
      if(isShift && n!=='SHIFT'){ isShift = false; renderKeys(); }
  }
}

function renderKeys() {
  const layout = keyboardType === 'number' ? keysNumber : keysText;
  createRow(r1, layout.row1);
  createRow(r2, layout.row2);
  createRow(r3, layout.row3);
  createRow(r4, layout.row4);
  createRow(r5, layout.row5);
}

const keyboard = document.getElementById('keyboard'),
      r1 = document.getElementById('row1'),
      r2 = document.getElementById('row2'),
      r3 = document.getElementById('row3'),
      r4 = document.getElementById('row4'),
      r5 = document.getElementById('row5');

document.querySelectorAll('input').forEach(i =>
  i.addEventListener('focus', e => {
    activeInput = e.target;
    keyboardType = i.type === 'number' ? 'number' : 'text';
    keyboard.classList.add('visible');
    renderKeys();
  })
);

document.addEventListener('click', e => {
  if(!keyboard.contains(e.target) && e.target.tagName!=='INPUT'){
    keyboard.classList.remove('visible');
    activeInput = null;
  }
});

renderKeys();
