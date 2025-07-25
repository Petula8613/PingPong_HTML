function createCzechKeyboard(targetInputId) {
  const input = document.getElementById(targetInputId);

  const keyboard = document.createElement('div');
  keyboard.id = 'keyboard';
  keyboard.className = 'keyboard hidden';
  document.body.appendChild(keyboard);

  const row1 = document.createElement('div');
  const row2 = document.createElement('div');
  const row3 = document.createElement('div');
  const row4 = document.createElement('div');
  const row5 = document.createElement('div');

  [row1, row2, row3, row4, row5].forEach(r => {
    r.className = 'keyboard-row';
    keyboard.appendChild(r);
  });

  let isShift = false;
  let accentBuffer = '';

  const accentMap = {
    'ˇ': {
      'c': 'č', 'C': 'Č', 'd': 'ď', 'D': 'Ď', 'e': 'ě', 'E': 'Ě',
      'n': 'ň', 'N': 'Ň', 'r': 'ř', 'R': 'Ř', 's': 'š', 'S': 'Š',
      't': 'ť', 'T': 'Ť', 'z': 'ž', 'Z': 'Ž'
    },
    '´': {
      'a': 'á', 'A': 'Á', 'e': 'é', 'E': 'É', 'i': 'í', 'I': 'Í',
      'o': 'ó', 'O': 'Ó', 'u': 'ú', 'U': 'Ú', 'y': 'ý', 'Y': 'Ý'
    }
  };

  const keys = {
    row1: [[';', '°'], ['+', '1'], ['ě', '2'], ['š', '3'], ['č', '4'], ['ř', '5'], ['ž', '6'], ['ý', '7'], ['á', '8'], ['í', '9'], ['é', '0'], ['=', '%'], ['´', 'ˇ'], ['BCK', 'BCK']],
    row2: [['q','Q'], ['w','W'], ['e','E'], ['r','R'], ['t','T'], ['z','Z'], ['u','U'], ['i','I'], ['o','O'], ['p','P'], ['ú','/'], [')','(']],
    row3: [['a','A'], ['s','S'], ['d','D'], ['f','F'], ['g','G'], ['h','H'], ['j','J'], ['k','K'], ['l','L'], ['ů','"'], ['§','!'], ['¨','"']],
    row4: [['\\\\','|'], ['y','Y'], ['x','X'], ['c','C'], ['v','V'], ['b','B'], ['n','N'], ['m','M'], [',','?'], ['.',':'], ['-','_']],
    row5: [['SHIFT','SHIFT'], [' ',' '], ['SHIFT','SHIFT'], ['ZAVRIT','ZAVRIT']]
  };

  function createRow(rowElement, keyDefs) {
    keyDefs.forEach(([normal, shift]) => {
      const btn = document.createElement("button");
      btn.textContent = isShift ? shift : normal;
      if (normal === ' ' || normal === 'SHIFT' || normal === 'ZAVRIT') btn.classList.add('wide');
      if (normal === ' ') btn.classList.add('extra-wide');
      btn.onclick = (e) => {
        e.stopPropagation();
        handleKeyPress(normal, shift);
      };
      rowElement.appendChild(btn);
    });
  }

  function handleKeyPress(normal, shift) {
    const char = isShift ? shift : normal;
    switch (normal) {
      case 'BCK':
        input.value = input.value.slice(0, -1);
        break;
      case 'SHIFT':
        isShift = !isShift;
        refreshKeyboard();
        break;
      case 'ZAVRIT':
        keyboard.classList.add('hidden');
        break;
      case ' ':
        input.value += ' ';
        break;
      default:
        if (accentBuffer && accentMap[accentBuffer] && accentMap[accentBuffer][char]) {
          input.value += accentMap[accentBuffer][char];
          accentBuffer = '';
        } else if (accentMap[char]) {
          accentBuffer = char;
        } else {
          input.value += char;
          accentBuffer = '';
        }
        if (isShift && normal !== 'SHIFT') {
          isShift = false;
          refreshKeyboard();
        }
    }
  }

  function refreshKeyboard() {
    [row1, row2, row3, row4, row5].forEach(r => r.innerHTML = '');
    createRow(row1, keys.row1);
    createRow(row2, keys.row2);
    createRow(row3, keys.row3);
    createRow(row4, keys.row4);
    createRow(row5, keys.row5);
  }

  input.addEventListener("click", (e) => {
    e.stopPropagation();
    input.focus();
    keyboard.classList.remove("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!keyboard.contains(e.target) && e.target !== input) {
      keyboard.classList.add("hidden");
    }
  });

  refreshKeyboard();
}
