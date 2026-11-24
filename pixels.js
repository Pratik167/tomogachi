'use strict';

const AchooPixels = (() => {
  const ink = '#273a32';
  const glyphs = {
    heart: ['01100110','11111111','11111111','11111111','01111110','00111100','00011000'],
    emptyHeart: ['01100110','10011001','10000001','10000001','01000010','00100100','00011000'],
    sparkle: ['0001000','0001000','0011100','1111111','0011100','0001000','0001000'],
    bowl: ['00111100','01100110','11000011','10011001','10000001','01111110'],
    gamepad: ['00111100','01111110','11011111','10001101','11011011','11111111','11000011'],
    smile: ['00111100','01000010','10100101','10000001','10100101','10011001','01000010','00111100']
  };
  const letters = {
    A: ['01110','11011','11011','11111','11011','11011','11011'],
    c: ['00000','00000','01111','11000','11000','11000','01111'],
    h: ['11000','11000','11110','11011','11011','11011','11011'],
    o: ['00000','00000','01110','11011','11011','11011','01110']
  };
  const panelColors = {
    I: '#24416a', W: '#fff8fc', P: '#f49cc9', R: '#c95492', B: '#a9def8', S: '#6194c4'
  };
  const panelSprites = {
    cat: [
      '..............P.P', '..I.....I....PPRPP', '.IBI...IBI...PRRR',
      '.IWWIIIWWI....PR', 'IWWWWWWWWWI........I', 'IWIWWWWWIWI.......II',
      'IWWWWIWWWWI..I...I', '.IWPIWIWPIWWWI..I', '..IWWWWWIWWWWIII',
      '..IIIIIIWWWWWI', '....IWWWWWWWI', '....IIIIIIIII'
    ],
    rice: [
      '.....IIII', '...IIWWWWII', '..IWWWBWWWWI', '.IWBWWWWBWWWI',
      '.IIIIIIIIIIII', '.IPPPPPPPPPPI', '..IPPRPPRPPI', '...IRRRRRRI', '....IIIIII'
    ],
    water: [
      '......I', '.....IBI', '....IBWI', '...IBWWBI', '...ISBBBI', '....IIII',
      '..IIIIIIIII', '.IPPPPPPPPPI', '..IPRRRRRPI', '...IIIIIII'
    ],
    ball: [
      '.....IIIII', '...IIPPPPPII', '..IPPWWPPPPPI', '..IPPPPWWPPPI',
      '.IRPPPPPWWPPPI', '.IRRPPPPPWWPPI', '.IRRRPPPPPWWPI', '..IRRRRPPPPPI',
      '..IIRRRRRRII', '....IIIIII', '..I........I'
    ],
    hide: [
      '.I...........I', '..I.I.....I.I', '...IWI...IWI', '...IWWIIIWWI',
      '..IWIWWWIWWWI', '.IIIIIIIIIIIIII', 'IWWWWWWWWWWWWWWI', '.IPPPPPPPPPPPPI',
      '.IPPPPPPRPPPPPI', '.IRRRRRRRRRRRRI', '..IIIIIIIIIIII'
    ],
    wash: [
      '........W...', '..P....IBI', '.PPP..IBWBI', '..P..IBWWBI',
      '...I..IIII..I', '..IWIWWWIWIWI', '.IIIIIIIIIIIII', '.IPPPPPPPPPPPI',
      '..IPPPPPPPPPI', '...IRRRRRRRI', '....IIIIIII'
    ],
    comb: [
      '..........II', '.........IRPI', '........IRPI', '.IIIIIIIIWPI',
      'IRPPPPPPPPPI', 'IIIPIPIPIPII', '.I.I.I.I.I', '.I.I.I.I.I', '.I.I.I.I.I'
    ],
    previous: ['....R','...RR','..RRR','.RRRR','RRRRR','.RRRR','..RRR','...RR','....R'],
    next: ['R','RR','RRR','RRRR','RRRRR','RRRR','RRR','RR','R']
  };
  const coatColors = {
    blue: ['#b3c9a9','#769693','#d0e0b1'],
    pink: ['#d7c5ad','#ae8890','#e5d6b6'],
    cream: ['#dfd9ad','#a8a080','#eee7bf']
  };

  function rect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  function stamp(ctx, shape, x, y, color) {
    shape.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] === '1') rect(ctx, x + dx, y + dy, 1, 1, color);
      }
    });
  }

  function icon(canvas, name, color, border) {
    const ctx = canvas.getContext('2d');
    const shape = glyphs[name];
    const x = Math.floor((canvas.width - shape[0].length) / 2);
    const y = Math.floor((canvas.height - shape.length) / 2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (border) {
      for (const [dx, dy] of [[0,-1],[-1,0],[1,0],[0,1]]) {
        stamp(ctx, shape, x + dx, y + dy, border);
      }
    }
    stamp(ctx, shape, x, y, color);
  }

  function panelArt(canvas, name) {
    const ctx = canvas.getContext('2d');
    const shape = panelSprites[name];
    const width = Math.max(...shape.map(row => row.length));
    const x = Math.floor((canvas.width - width) / 2);
    const y = Math.floor((canvas.height - shape.length) / 2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shape.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        const color = panelColors[row[dx]];
        if (color) rect(ctx, x + dx, y + dy, 1, 1, color);
      }
    });
  }

  function logo(canvas) {
    const ctx = canvas.getContext('2d');
    stamp(ctx, [
      '0000111000000000000011100000',
      '0001111100000000000111110000',
      '0011111110000000001111111000',
      '0011111111000000011111111000',
      '0011111111111111111111111000'
    ], 5, 0, '#fdf3ff');
    rect(ctx, 11, 2, 2, 3, '#ed92c6');
    rect(ctx, 27, 2, 2, 3, '#ed92c6');
    rect(ctx, 2, 4, 34, 12, '#fdf3ff');
    rect(ctx, 1, 7, 36, 8, '#fdf3ff');
    rect(ctx, 4, 15, 30, 3, '#ffb8df');
    rect(ctx, 2, 14, 34, 2, '#ffb8df');
    [...'Achoo'].forEach((character, index) => stamp(ctx, letters[character], 4 + index * 6, 6, '#1a3b6e'));
  }

  function decorate() {
    logo(document.getElementById('logo'));
    for (const canvas of document.querySelectorAll('[data-glyph]')) {
      const color = canvas.hasAttribute('data-sticker') ? '#f584c2' : ink;
      const border = canvas.hasAttribute('data-sticker') ? '#fff1fa' : undefined;
      icon(canvas, canvas.dataset.glyph, color, border);
    }
    for (const canvas of document.querySelectorAll('[data-panel-art]')) {
      panelArt(canvas, canvas.dataset.panelArt);
    }
  }

  function drawMuniii(ctx, pose, blink, offset) {
    const outline = '#29372f';
    const fur = '#899487';
    const light = '#c5cdb4';
    const stripe = '#465449';
    const ear = '#c995a6';
    const eyes = '#778f69';
    const pixel = (x, y, w, h, color) => rect(ctx, x, y + offset, w, h, color);

    if (pose === 'napping') {
      // Low head, curved back, and a ringed tail follow Muniii's photo.
      pixel(35,39,49,23,outline); pixel(40,35,35,5,outline);
      pixel(39,39,41,19,fur); pixel(47,37,23,19,fur);
      for (const [x, y] of [[47,39],[56,37],[65,37],[73,40]]) {
        pixel(x,y,5,3,stripe); pixel(x+2,y+3,3,7,stripe);
      }
      pixel(78,45,7,14,stripe); pixel(82,53,5,8,outline);
      pixel(77,50,5,3,light); pixel(80,56,4,2,fur);
      pixel(53,55,34,8,outline); pixel(56,56,27,5,fur);
      for (const x of [61,69,77]) pixel(x,56,3,5,stripe);
      pixel(43,57,11,5,outline); pixel(49,57,6,4,light);
      pixel(24,46,31,14,outline); pixel(28,44,26,14,fur);
      pixel(27,40,6,10,outline); pixel(29,43,3,6,ear);
      pixel(47,40,5,10,outline); pixel(48,43,3,5,ear);
      for (const x of [34,41,48]) pixel(x,46,2,6,stripe);
      pixel(31,52,6,1,outline); pixel(43,52,6,1,outline);
      pixel(37,54,3,2,ear); pixel(35,56,7,1,outline);
      pixel(19,54,8,1,outline); pixel(48,54,9,1,outline);
      return;
    }

    if (pose === 'playing') {
      pixel(42,47,40,14,outline); pixel(45,44,36,14,fur);
      for (const x of [50,60,69,76]) pixel(x,45,3,9,stripe);
      pixel(72,56,8,6,outline); pixel(74,57,5,3,light);
      pixel(78,42,8,14,outline); pixel(82,33,8,14,outline);
      pixel(86,27,11,8,outline); pixel(93,31,5,9,outline);
      pixel(81,45,4,8,fur); pixel(85,35,4,8,fur);
      pixel(88,29,6,4,fur); pixel(94,33,2,4,fur);
      pixel(82,41,4,3,stripe); pixel(88,31,4,3,stripe);
      pixel(30,27,31,25,outline); pixel(33,29,25,21,fur);
      pixel(32,22,6,11,outline); pixel(34,25,3,5,ear);
      pixel(53,22,6,11,outline); pixel(54,25,3,5,ear);
      for (const x of [39,46,53]) pixel(x,30,2,6,stripe);
      pixel(34,35,4,2,stripe); pixel(54,35,4,2,stripe);
      pixel(37,39,5,3,eyes); pixel(50,39,5,3,eyes);
      pixel(39,39,2,3,outline); pixel(52,39,2,3,outline);
      pixel(43,44,5,3,light); pixel(45,45,2,2,ear);
      pixel(31,47,5,9,outline); pixel(32,52,7,7,fur);
      pixel(27,55,13,5,outline); pixel(29,56,9,2,light);
      pixel(50,53,6,10,outline); pixel(51,55,4,5,fur);
      pixel(58,55,7,8,outline); pixel(59,56,5,5,light);
      pixel(25,43,6,1,outline); pixel(56,44,6,1,outline);
      return;
    }

    // The default sitting pose fits the existing 116 × 78 LCD scene.
    pixel(43,44,30,19,outline); pixel(46,44,24,17,fur);
    for (const x of [49,58,67]) pixel(x,46,2,11,stripe);
    pixel(47,58,7,6,outline); pixel(48,59,5,3,light);
    pixel(62,58,7,6,outline); pixel(63,59,5,3,light);
    pixel(71,51,10,10,outline); pixel(74,47,8,9,fur);
    pixel(78,42,6,8,outline); pixel(80,43,4,5,fur);
    pixel(75,52,5,3,stripe); pixel(79,45,3,3,stripe);
    pixel(74,56,6,2,light); pixel(77,58,5,2,stripe);
    pixel(40,29,35,20,outline); pixel(43,27,29,23,fur);
    pixel(42,22,7,13,outline); pixel(45,25,3,7,ear);
    pixel(66,22,7,13,outline); pixel(67,25,3,7,ear);
    pixel(47,30,3,7,stripe); pixel(55,28,4,8,stripe); pixel(65,30,3,7,stripe);
    pixel(43,39,28,9,light); pixel(51,42,13,6,light);
    pixel(42,36,5,2,stripe); pixel(69,36,5,2,stripe);
    pixel(47,35,2,4,stripe); pixel(66,35,2,4,stripe);
    if (blink) {
      pixel(47,38,6,1,outline); pixel(62,38,6,1,outline);
    } else {
      pixel(47,38,6,4,outline); pixel(62,38,6,4,outline);
      pixel(49,38,3,3,eyes); pixel(64,38,3,3,eyes);
      pixel(50,39,1,2,outline); pixel(65,39,1,2,outline);
    }
    pixel(55,43,5,2,ear); pixel(57,45,1,2,outline);
    pixel(52,47,5,1,outline); pixel(58,47,5,1,outline);
    pixel(35,42,9,1,outline); pixel(72,42,8,1,outline);
  }

  function drawCat(ctx, coat, blink, happy, offset, pose) {
    if (coat === 'muniii') {
      drawMuniii(ctx, pose, blink, pose === 'napping' ? 0 : offset);
      return;
    }
    const [fur, shade, highlight] = coatColors[coat];
    // Enlarge each pixel block with integer edges, anchored at the cat's feet.
    const scale = 1.24;
    const horizontal = x => Math.round(58 + (x - 58) * scale);
    const vertical = y => Math.round(64 + (y - 64) * scale) + offset;
    const block = (x, y, w, h, color = ink) => rect(ctx,horizontal(x),vertical(y),horizontal(x + w) - horizontal(x),vertical(y + h) - vertical(y),color);

    // Tail, body, paws, and whiskers use hard edges at the LCD's native resolution.
    block(70,52,9,7); block(77,47,4,9); block(78,42,5,7); block(81,43,4,4);
    block(72,54,6,3,shade); block(79,47,2,7,fur); block(80,44,2,3,fur);
    block(43,48,28,13); block(45,60,24,3); block(48,62,7,2); block(59,62,8,2);
    block(45,48,24,11,fur); block(49,59,5,3,highlight); block(60,59,5,3,highlight);
    block(46,55,3,5,shade); block(66,55,2,5,shade);

    block(38,30,35,17); block(41,27,29,23); block(44,47,23,4);
    block(39,22,5,11); block(44,24,3,8); block(47,27,2,4);
    block(66,24,3,8); block(69,22,4,11);
    block(41,25,2,9,shade); block(43,28,3,4,fur); block(69,25,2,8,shade);
    block(41,32,29,14,fur); block(44,30,23,18,fur); block(47,47,17,2,highlight);
    block(51,30,3,4,shade); block(56,30,3,3,shade); block(61,30,2,2,shade);
    block(34,39,9,1); block(36,43,7,1); block(69,39,8,1); block(69,43,6,1);

    if (happy) {
      block(46,39,5,1); block(46,40,1,1); block(50,40,1,1);
      block(62,39,5,1); block(62,40,1,1); block(66,40,1,1);
    } else {
      block(47,38,3,blink ? 1 : 4); block(63,38,3,blink ? 1 : 4);
    }
    block(55,42,3,2); block(56,44,1,2);
    block(53,45,3,1); block(57,45,3,1);
  }

  function animate(canvas, readPet) {
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const background = document.createElement('canvas');
    background.width = canvas.width;
    background.height = canvas.height;
    const backdrop = background.getContext('2d');
    const pixel = (x,y,w,h,color) => rect(backdrop,x,y,w,h,color);
    for (let y = 2; y < 70; y += 3) {
      for (let x = 2; x < 115; x += 3) pixel(x,y,1,1,'#bac99a');
    }
    // Low contrast room details keep the cat silhouette readable.
    pixel(9,16,16,15,'#a8b789'); pixel(11,18,12,11,'#c6d6a4');
    pixel(16,18,2,11,'#a8b789'); pixel(10,23,14,1,'#a8b789');
    pixel(7,30,20,2,'#a8b789');
    pixel(97,54,9,9,'#a7b58a'); pixel(100,47,2,7,'#a7b58a');
    pixel(95,48,5,3,'#a7b58a'); pixel(102,45,5,4,'#a7b58a');
    pixel(0,64,116,2,'#738464');
    for (const x of [10,23,37,88,102]) pixel(x,69,5,1,'#9baa80');

    function frame(now) {
      const {coat,effect,effectUntil,category,lastInteraction} = readPet();
      const active = now < effectUntil;
      const pose = coat === 'muniii' && active && category === 'Play' ? 'playing'
        : coat === 'muniii' && now - lastInteraction > 15000 ? 'napping' : 'sitting';
      const offset = active && pose !== 'napping' && !reduced.matches ? -Math.round(Math.abs(Math.sin(now / 105)) * 5) : 0;
      const blink = !reduced.matches && now % 4300 > 4120;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);
      drawCat(ctx, coat, blink, active, offset, pose);
      if (active) {
        const rise = reduced.matches ? 0 : Math.floor((1250 - (effectUntil - now)) / 130);
        stamp(ctx, glyphs[effect === '♥' ? 'heart' : 'sparkle'], 78, 23 - rise, ink);
        stamp(ctx, glyphs.sparkle, 33, 17 - rise, '#728569');
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  return {icon, panelArt, decorate, animate};
})();
