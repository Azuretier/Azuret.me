"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Game content for each server mode (embedded HTML strings)
const vanillaGameHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>RHYTHMIA</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
        html, body { height: 100%; overflow: hidden; touch-action: manipulation; font-family: system-ui, -apple-system, sans-serif; }
        body { background: #0a0a12; transition: background 0.5s; }
        .w0 { --c1: #FF6B9D; --c2: #C44569; --bg: #1a1025; }
        .w1 { --c1: #4ECDC4; --c2: #1A535C; --bg: #051620; }
        .w2 { --c1: #FFE66D; --c2: #F7B731; --bg: #1a1505; }
        .w3 { --c1: #FF6B6B; --c2: #C0392B; --bg: #1a0a0a; }
        .w4 { --c1: #A29BFE; --c2: #6C5CE7; --bg: #0a0a1a; }
        body { background: var(--bg); }
        #game { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; gap: 10px; }
        #score-display { font-size: clamp(2rem, 8vw, 4rem); font-weight: 900; color: white; text-shadow: 0 0 30px var(--c1); transition: transform 0.1s; }
        #score-display.pop { transform: scale(1.2); }
        #combo { font-size: clamp(1.5rem, 5vw, 2.5rem); font-weight: 700; color: var(--c1); opacity: 0; transform: scale(0); transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        #combo.show { opacity: 1; transform: scale(1); }
        #combo.big { transform: scale(1.5); color: #FFD700; }
        #game-area { position: relative; display: flex; gap: 10px; align-items: flex-start; }
        #board-wrap { position: relative; border: 3px solid var(--c1); border-radius: 8px; background: rgba(0,0,0,0.5); box-shadow: 0 0 30px var(--c1), inset 0 0 30px rgba(0,0,0,0.5); transition: box-shadow 0.1s, transform 0.1s; overflow: hidden; }
        #board-wrap.beat { box-shadow: 0 0 50px var(--c1), 0 0 80px var(--c1), inset 0 0 30px rgba(0,0,0,0.5); transform: scale(1.02); }
        #board-wrap.shake { animation: shake 0.2s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        #board { display: grid; gap: 1px; position: relative; }
        .cell { width: clamp(16px, 4vw, 28px); height: clamp(16px, 4vw, 28px); background: rgba(255,255,255,0.03); border-radius: 2px; transition: all 0.1s; }
        .cell.filled { box-shadow: 0 0 10px currentColor, inset 0 0 8px rgba(255,255,255,0.3); }
        .cell.ghost { opacity: 0.3; }
        .cell.clearing { animation: clear 0.3s ease-out forwards; }
        @keyframes clear { 0% { transform: scale(1); } 50% { transform: scale(1.3); background: white; } 100% { transform: scale(0); opacity: 0; } }
        #active-piece { position: absolute; top: 0; left: 0; pointer-events: none; transition: transform 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94); z-index: 10; }
        #active-piece.dropping { transition: transform 0.02s linear; }
        .piece-cell { position: absolute; border-radius: 2px; box-shadow: 0 0 10px currentColor, inset 0 0 8px rgba(255,255,255,0.3); }
        #next-wrap { background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; }
        #next-label { color: rgba(255,255,255,0.5); font-size: 0.7rem; text-align: center; margin-bottom: 5px; }
        #next { display: grid; gap: 1px; }
        .next-cell { width: clamp(12px, 3vw, 20px); height: clamp(12px, 3vw, 20px); border-radius: 2px; }
        #beat-bar { width: min(300px, 80vw); height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; position: relative; }
        #beat-fill { height: 100%; background: linear-gradient(90deg, var(--c2), var(--c1)); border-radius: 10px; transition: width 0.05s linear; box-shadow: 0 0 20px var(--c1); }
        #beat-target { position: absolute; right: 10%; top: 0; bottom: 0; width: 15%; background: rgba(255,215,0,0.3); border: 2px solid #FFD700; border-radius: 8px; }
        #judgment { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: clamp(2rem, 10vw, 5rem); font-weight: 900; pointer-events: none; opacity: 0; z-index: 100; }
        #judgment.show { animation: judgePop 0.5s ease-out forwards; }
        @keyframes judgePop { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } 30% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); } 100% { opacity: 0; transform: translate(-50%, -60%) scale(1); } }
        #controls { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; width: min(350px, 90vw); }
        .ctrl-btn { aspect-ratio: 1; background: linear-gradient(135deg, var(--c1), var(--c2)); border: none; border-radius: 12px; color: white; font-size: clamp(1.2rem, 4vw, 2rem); font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.1s, box-shadow 0.1s; -webkit-tap-highlight-color: transparent; }
        .ctrl-btn:active { transform: scale(0.9); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        #title-screen { position: fixed; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg); z-index: 200; gap: 30px; }
        #title-screen h1 { font-size: clamp(3rem, 12vw, 6rem); font-weight: 900; color: white; text-shadow: 0 0 30px var(--c1), 0 0 60px var(--c1); }
        #title-screen p { color: rgba(255,255,255,0.7); font-size: 1.2rem; }
        #start-btn { padding: 20px 60px; font-size: 1.5rem; font-weight: bold; background: linear-gradient(135deg, var(--c1), var(--c2)); border: none; border-radius: 50px; color: white; cursor: pointer; box-shadow: 0 0 30px var(--c1); transition: transform 0.2s, box-shadow 0.2s; }
        #start-btn:hover { transform: scale(1.05); box-shadow: 0 0 50px var(--c1); }
        #world-display { position: fixed; top: 10px; left: 10px; color: white; font-size: 0.9rem; opacity: 0.7; }
        #enemy-bar { width: min(250px, 70vw); height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; }
        #enemy-fill { height: 100%; background: linear-gradient(90deg, #FF4444, #FF8888); transition: width 0.3s; box-shadow: 0 0 10px #FF4444; }
        #enemy-label { color: rgba(255,255,255,0.6); font-size: 0.8rem; text-align: center; }
        #gameover { position: fixed; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.9); z-index: 200; gap: 20px; }
        #gameover.show { display: flex; }
        #gameover h2 { font-size: 3rem; color: var(--c1); text-shadow: 0 0 30px var(--c1); }
        #final-score { font-size: 2rem; color: white; }
        .particle { position: fixed; pointer-events: none; border-radius: 50%; z-index: 150; }
        #settings-btn { position: fixed; top: 10px; right: 10px; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; color: white; font-size: 1.2rem; cursor: pointer; z-index: 50; transition: all 0.2s; }
        #settings-btn:hover { background: rgba(255,255,255,0.2); transform: rotate(45deg); }
        #keybind-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.9); z-index: 300; }
        #keybind-modal.show { display: flex; }
        #keybind-panel { background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid var(--c1); border-radius: 16px; padding: 24px; max-width: 400px; width: 90%; box-shadow: 0 0 40px var(--c1); }
        #keybind-panel h2 { color: white; font-size: 1.5rem; margin-bottom: 20px; text-align: center; text-shadow: 0 0 10px var(--c1); }
        .keybind-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; }
        .keybind-label { color: rgba(255,255,255,0.8); font-size: 0.95rem; }
        .keybind-key { min-width: 80px; padding: 8px 16px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; color: white; font-size: 0.9rem; text-align: center; cursor: pointer; transition: all 0.2s; }
        .keybind-key:hover { border-color: var(--c1); box-shadow: 0 0 10px var(--c1); }
        .keybind-key.listening { border-color: #FFD700; box-shadow: 0 0 15px #FFD700; animation: pulse 0.5s infinite alternate; }
        @keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }
        .keybind-presets { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; justify-content: center; }
        .preset-btn { padding: 8px 16px; background: linear-gradient(135deg, var(--c2), var(--c1)); border: none; border-radius: 20px; color: white; font-size: 0.85rem; cursor: pointer; transition: transform 0.2s; }
        .preset-btn:hover { transform: scale(1.05); }
        #keybind-close { display: block; width: 100%; margin-top: 20px; padding: 12px; background: linear-gradient(135deg, var(--c1), var(--c2)); border: none; border-radius: 25px; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
        #keybind-close:hover { transform: scale(1.02); }
        .keybind-hint { color: rgba(255,255,255,0.5); font-size: 0.75rem; text-align: center; margin-top: 12px; }
    </style>
</head>
<body class="w0">
    <div id="title-screen"><h1>RHYTHMIA</h1><p>リズムに乗ってブロックを積め！</p><button id="start-btn">▶ START</button></div>
    <div id="game" style="display:none;"><div id="world-display">🎀 メロディア</div><div id="score-display">0</div><div id="combo">10 COMBO!</div><div id="enemy-label">👻 ノイズリング</div><div id="enemy-bar"><div id="enemy-fill" style="width:100%"></div></div><div id="game-area"><div id="board-wrap"><div id="board"></div><div id="active-piece"></div></div><div id="next-wrap"><div id="next-label">NEXT</div><div id="next"></div></div></div><div id="beat-bar"><div id="beat-target"></div><div id="beat-fill" style="width:0%"></div></div><div id="controls"><button class="ctrl-btn" data-action="rotate">↻</button><button class="ctrl-btn" data-action="left">←</button><button class="ctrl-btn" data-action="down">↓</button><button class="ctrl-btn" data-action="right">→</button><button class="ctrl-btn" data-action="drop">⬇</button></div></div>
    <div id="judgment"></div><button id="settings-btn">⚙</button>
    <div id="keybind-modal"><div id="keybind-panel"><h2>⚙ キー設定</h2><div class="keybind-row"><span class="keybind-label">← 左移動</span><div class="keybind-key" data-action="left">←</div></div><div class="keybind-row"><span class="keybind-label">→ 右移動</span><div class="keybind-key" data-action="right">→</div></div><div class="keybind-row"><span class="keybind-label">↓ 下移動</span><div class="keybind-key" data-action="down">↓</div></div><div class="keybind-row"><span class="keybind-label">↻ 回転</span><div class="keybind-key" data-action="rotate">↑</div></div><div class="keybind-row"><span class="keybind-label">⬇ ハードドロップ</span><div class="keybind-key" data-action="drop">Space</div></div><div class="keybind-presets"><button class="preset-btn" data-preset="arrows">矢印キー</button><button class="preset-btn" data-preset="wasd">WASD</button><button class="preset-btn" data-preset="vim">Vim (HJKL)</button></div><p class="keybind-hint">キーをクリックして変更 / Escでキャンセル</p><button id="keybind-close">閉じる</button></div></div>
    <div id="gameover"><h2>GAME OVER</h2><div id="final-score">SCORE: 0</div><button id="start-btn" onclick="location.reload()">RETRY</button></div>
    <script>const W=10,H=18;const WORLDS=[{name:'🎀 メロディア',bpm:100,colors:['#FF6B9D','#FF8FAB','#FFB6C1','#C44569','#E8668B','#D4587D','#B84A6F']},{name:'🌊 ハーモニア',bpm:110,colors:['#4ECDC4','#45B7AA','#3DA69B','#35958C','#2D847D','#26736E','#1A535C']},{name:'☀️ クレシェンダ',bpm:120,colors:['#FFE66D','#FFD93D','#F7B731','#ECA700','#D19600','#B68600','#9B7600']},{name:'🔥 フォルティッシモ',bpm:140,colors:['#FF6B6B','#FF5252','#FF3838','#FF1F1F','#E61717','#CC0F0F','#B30707']},{name:'✨ 静寂の間',bpm:160,colors:['#A29BFE','#9B8EFD','#9381FC','#8B74FB','#8367FA','#7B5AF9','#6C5CE7']}];const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];let board,piece,piecePos,nextPiece,score,combo,level,lines,worldIdx,enemyHP,gameOver,paused,beatPhase,lastBeat,audioCtx,dropTimer,beatTimer,cellSize=20,gapSize=1;const $=id=>document.getElementById(id);const boardEl=$('board'),nextEl=$('next'),scoreEl=$('score-display'),comboEl=$('combo'),judgmentEl=$('judgment'),beatFill=$('beat-fill'),enemyFill=$('enemy-fill'),enemyLabel=$('enemy-label'),worldDisplay=$('world-display'),boardWrap=$('board-wrap'),activePieceEl=$('active-piece');function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)()}function playTone(freq,dur=0.1,type='sine'){if(!audioCtx)return;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(0.3,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+dur);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+dur)}function playDrum(){if(!audioCtx)return;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='square';osc.frequency.setValueAtTime(150,audioCtx.currentTime);osc.frequency.exponentialRampToValueAtTime(50,audioCtx.currentTime+0.1);gain.gain.setValueAtTime(0.5,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+0.1);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+0.1)}function playLineClear(count){const freqs=[523,659,784,1047];freqs.slice(0,count).forEach((f,i)=>setTimeout(()=>playTone(f,0.15,'triangle'),i*60))}function spawnParticles(x,y,color,count=8){for(let i=0;i<count;i++){const p=document.createElement('div');p.className='particle';const size=Math.random()*10+5,angle=(Math.PI*2/count)*i,dist=Math.random()*80+40;p.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;background:'+color+';box-shadow:0 0 10px '+color+';transition:all 0.5s ease-out;';document.body.appendChild(p);requestAnimationFrame(()=>{p.style.transform='translate('+(Math.cos(angle)*dist)+'px,'+(Math.sin(angle)*dist)+'px) scale(0)';p.style.opacity='0'});setTimeout(()=>p.remove(),500)}}function createBoard(){boardEl.innerHTML='';boardEl.style.gridTemplateColumns='repeat('+W+', 1fr)';for(let i=0;i<W*H;i++){const cell=document.createElement('div');cell.className='cell';boardEl.appendChild(cell)}requestAnimationFrame(()=>{const firstCell=boardEl.querySelector('.cell');if(firstCell)cellSize=firstCell.getBoundingClientRect().width})}function randomPiece(){const world=WORLDS[worldIdx],shape=SHAPES[Math.floor(Math.random()*SHAPES.length)],color=world.colors[Math.floor(Math.random()*world.colors.length)];return{shape,color}}function drawBoard(){const cells=boardEl.children,display=board.map(r=>[...r]);if(piece){let gy=piecePos.y;while(!collision(piece,piecePos.x,gy+1))gy++;piece.shape.forEach((row,py)=>{row.forEach((val,px)=>{if(val){const by=gy+py,bx=piecePos.x+px;if(by>=0&&by<H&&bx>=0&&bx<W&&!display[by][bx])display[by][bx]={color:piece.color,ghost:true}}})})}for(let y=0;y<H;y++){for(let x=0;x<W;x++){const cell=cells[y*W+x],val=display[y][x];if(val){cell.className='cell filled'+(val.ghost?' ghost':'');cell.style.backgroundColor=val.color;cell.style.color=val.color}else{cell.className='cell';cell.style.backgroundColor='';cell.style.color=''}}}}function drawActivePiece(instant=false){if(!piece){activePieceEl.innerHTML='';return}const firstCell=boardEl.querySelector('.cell');if(firstCell)cellSize=firstCell.getBoundingClientRect().width;const unit=cellSize+gapSize;if(activePieceEl.children.length===0||activePieceEl.dataset.color!==piece.color){activePieceEl.innerHTML='';piece.shape.forEach((row,py)=>{row.forEach((val,px)=>{if(val){const cell=document.createElement('div');cell.className='piece-cell';cell.style.width=cellSize+'px';cell.style.height=cellSize+'px';cell.style.backgroundColor=piece.color;cell.style.color=piece.color;cell.style.left=(px*unit)+'px';cell.style.top=(py*unit)+'px';activePieceEl.appendChild(cell)}})});activePieceEl.dataset.color=piece.color}if(instant)activePieceEl.classList.add('dropping');else activePieceEl.classList.remove('dropping');const x=piecePos.x*unit,y=piecePos.y*unit;activePieceEl.style.transform='translate('+x+'px,'+y+'px)'}function rebuildActivePiece(){activePieceEl.innerHTML='';activePieceEl.dataset.color='';drawActivePiece(true)}function drawNext(){if(!nextPiece)return;const shape=nextPiece.shape;nextEl.innerHTML='';nextEl.style.gridTemplateColumns='repeat('+shape[0].length+', 1fr)';shape.forEach(row=>{row.forEach(val=>{const cell=document.createElement('div');cell.className='next-cell';if(val){cell.style.backgroundColor=nextPiece.color;cell.style.boxShadow='0 0 8px '+nextPiece.color}nextEl.appendChild(cell)})})}function collision(p,px,py){return p.shape.some((row,y)=>row.some((val,x)=>{if(!val)return false;const bx=px+x,by=py+y;return bx<0||bx>=W||by>=H||(by>=0&&board[by][bx])}))}function rotate(p){return{...p,shape:p.shape[0].map((_,i)=>p.shape.map(row=>row[i]).reverse())}}function lock(){piece.shape.forEach((row,py)=>{row.forEach((val,px)=>{if(val){const by=piecePos.y+py,bx=piecePos.x+px;if(by>=0&&by<H)board[by][bx]={color:piece.color}}})});let cleared=0;const newBoard=[],clearingRows=[];board.forEach((row,y)=>{if(row.every(c=>c!==null)){cleared++;clearingRows.push(y)}else newBoard.push(row)});if(cleared>0){const cells=boardEl.children;clearingRows.forEach(y=>{for(let x=0;x<W;x++)cells[y*W+x].classList.add('clearing')});const rect=boardEl.getBoundingClientRect();clearingRows.forEach(y=>{const cy=rect.top+(y+0.5)*(cellSize+gapSize);for(let i=0;i<5;i++){const cx=rect.left+(Math.random()*W)*(cellSize+gapSize);spawnParticles(cx,cy,piece.color,4)}});setTimeout(()=>{while(newBoard.length<H)newBoard.unshift(Array(W).fill(null));board=newBoard;const pts=[0,100,300,500,800][cleared];score+=pts*(combo>0?Math.min(combo,10):1);lines+=cleared;combo+=cleared;updateCombo();scoreEl.textContent=score;scoreEl.classList.add('pop');setTimeout(()=>scoreEl.classList.remove('pop'),100);enemyHP-=cleared*10;if(enemyHP<=0)advanceWorld();enemyFill.style.width=Math.max(0,enemyHP)+'%';playLineClear(cleared);drawBoard()},300)}else{combo=0;updateCombo()}piece=nextPiece;nextPiece=randomPiece();piecePos={x:Math.floor(W/2)-1,y:0};rebuildActivePiece();drawNext();drawBoard();if(collision(piece,piecePos.x,piecePos.y))endGame()}function updateCombo(){if(combo>=3){comboEl.textContent=combo+' COMBO!';comboEl.className=combo>=10?'show big':'show'}else comboEl.className=''}function advanceWorld(){worldIdx++;if(worldIdx>=WORLDS.length)worldIdx=0;document.body.className='w'+worldIdx;const w=WORLDS[worldIdx];worldDisplay.textContent=w.name;enemyHP=100;enemyFill.style.width='100%';enemyLabel.textContent='👻 ノイズリング Lv.'+(worldIdx+1);clearInterval(dropTimer);clearInterval(beatTimer);const beatMs=60000/w.bpm;beatTimer=setInterval(beatTick,beatMs/100);dropTimer=setInterval(()=>{if(!gameOver&&!paused)tick()},Math.max(200,800-worldIdx*100))}function beatTick(){if(gameOver||paused)return;beatPhase=(beatPhase+1)%100;beatFill.style.width=beatPhase+'%';if(beatPhase===0){boardWrap.classList.add('beat');playDrum();setTimeout(()=>boardWrap.classList.remove('beat'),100)}}function showJudgment(text,color){judgmentEl.textContent=text;judgmentEl.style.color=color;judgmentEl.style.textShadow='0 0 30px '+color;judgmentEl.className='show';setTimeout(()=>judgmentEl.className='',500)}function checkRhythm(){const diff=Math.abs(beatPhase-90);if(diff<5){showJudgment('PERFECT!','#FFD700');return 3}if(diff<15){showJudgment('GREAT!','#4ECDC4');return 2}if(diff<25){showJudgment('GOOD','#FF6B9D');return 1}return 0}function move(dx,dy){if(gameOver||paused||!piece)return;if(!collision(piece,piecePos.x+dx,piecePos.y+dy)){piecePos.x+=dx;piecePos.y+=dy;if(dx!==0)playTone(392,0.03,'square');drawBoard();drawActivePiece()}else if(dy>0)lock()}function rotatePiece(){if(gameOver||paused||!piece)return;const rotated=rotate(piece);if(!collision(rotated,piecePos.x,piecePos.y)){piece=rotated;playTone(523,0.05);rebuildActivePiece();drawBoard()}}function hardDrop(){if(gameOver||paused||!piece)return;const rhythm=checkRhythm();while(!collision(piece,piecePos.x,piecePos.y+1)){piecePos.y++;score+=rhythm}scoreEl.textContent=score;drawActivePiece(true);drawBoard();playTone(196,0.08,'sawtooth');lock()}function tick(){move(0,1)}function endGame(){gameOver=true;clearInterval(dropTimer);clearInterval(beatTimer);$('gameover').classList.add('show');$('final-score').textContent='SCORE: '+score}function startGame(){initAudio();$('title-screen').style.display='none';$('game').style.display='flex';board=Array(H).fill().map(()=>Array(W).fill(null));score=0;combo=0;level=1;lines=0;worldIdx=0;enemyHP=100;gameOver=false;paused=false;beatPhase=0;lastBeat=Date.now();document.body.className='w0';worldDisplay.textContent=WORLDS[0].name;enemyLabel.textContent='👻 ノイズリング';createBoard();piece=randomPiece();nextPiece=randomPiece();piecePos={x:Math.floor(W/2)-1,y:0};drawBoard();drawActivePiece();drawNext();scoreEl.textContent='0';const w=WORLDS[worldIdx],beatMs=60000/w.bpm;beatTimer=setInterval(beatTick,beatMs/100);dropTimer=setInterval(()=>{if(!gameOver&&!paused)tick()},800)}$('start-btn').addEventListener('click',startGame);document.querySelectorAll('.ctrl-btn').forEach(btn=>{const action=btn.dataset.action;const handler=e=>{e.preventDefault();if(action==='left')move(-1,0);else if(action==='right')move(1,0);else if(action==='down')move(0,1);else if(action==='rotate')rotatePiece();else if(action==='drop')hardDrop()};btn.addEventListener('click',handler);btn.addEventListener('touchstart',handler)});let keybinds={left:'ArrowLeft',right:'ArrowRight',down:'ArrowDown',rotate:'ArrowUp',drop:' '};const PRESETS={arrows:{left:'ArrowLeft',right:'ArrowRight',down:'ArrowDown',rotate:'ArrowUp',drop:' '},wasd:{left:'a',right:'d',down:'s',rotate:'w',drop:' '},vim:{left:'h',right:'l',down:'j',rotate:'k',drop:' '}};function saveKeybinds(){try{localStorage.setItem('rhythmia-keys',JSON.stringify(keybinds))}catch(e){}}function loadKeybinds(){try{const saved=localStorage.getItem('rhythmia-keys');if(saved)keybinds=JSON.parse(saved)}catch(e){}updateKeybindDisplay()}function updateKeybindDisplay(){document.querySelectorAll('.keybind-key').forEach(el=>{const action=el.dataset.action,key=keybinds[action];el.textContent=key===' '?'Space':key.length===1?key.toUpperCase():key.replace('Arrow','')})}const keybindModal=$('keybind-modal');let listeningFor=null;$('settings-btn').addEventListener('click',()=>{keybindModal.classList.add('show');updateKeybindDisplay()});$('keybind-close').addEventListener('click',()=>{keybindModal.classList.remove('show');saveKeybinds()});document.querySelectorAll('.keybind-key').forEach(el=>{el.addEventListener('click',()=>{document.querySelectorAll('.keybind-key').forEach(k=>k.classList.remove('listening'));el.classList.add('listening');listeningFor=el.dataset.action})});document.querySelectorAll('.preset-btn').forEach(btn=>{btn.addEventListener('click',()=>{const preset=btn.dataset.preset;if(PRESETS[preset]){keybinds={...PRESETS[preset]};updateKeybindDisplay();playTone(659,0.1)}})});document.addEventListener('keydown',e=>{if(listeningFor&&keybindModal.classList.contains('show')){e.preventDefault();if(e.key==='Escape'){document.querySelectorAll('.keybind-key').forEach(k=>k.classList.remove('listening'));listeningFor=null;updateKeybindDisplay();return}keybinds[listeningFor]=e.key;updateKeybindDisplay();document.querySelectorAll('.keybind-key').forEach(k=>k.classList.remove('listening'));listeningFor=null;playTone(523,0.1);return}if(keybindModal.classList.contains('show'))return;if(e.key===keybinds.left)move(-1,0);else if(e.key===keybinds.right)move(1,0);else if(e.key===keybinds.down)move(0,1);else if(e.key===keybinds.rotate)rotatePiece();else if(e.key===keybinds.drop){e.preventDefault();hardDrop()}});beatPhase=0;lastBeat=Date.now();loadKeybinds()<\/script>
</body>
</html>`;

const multiplayerGameHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>BATTLE ARENA</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>*{box-sizing:border-box;margin:0;padding:0;user-select:none}html,body{height:100%;overflow:hidden;font-family:'Orbitron',system-ui,sans-serif;background:linear-gradient(135deg,#0a0a1a 0%,#1a0a2e 50%,#0a1a2e 100%)}:root{--p1-color:#4ECDC4;--p1-glow:rgba(78,205,196,0.5);--p2-color:#FF6B9D;--p2-glow:rgba(255,107,157,0.5);--gold:#FFD700;--danger:#FF4444}.lobby{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;padding:20px}.lobby h1{font-size:clamp(2rem,8vw,4rem);font-weight:900;letter-spacing:.2em;background:linear-gradient(135deg,var(--gold),#FF6B35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:titlePulse 3s ease-in-out infinite}@keyframes titlePulse{0%,100%{filter:drop-shadow(0 0 20px var(--gold))}50%{filter:drop-shadow(0 0 40px #FF6B35)}}.lobby-subtitle{color:rgba(255,255,255,.6);font-size:1rem;letter-spacing:.3em}.mode-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;width:100%;max-width:600px}.mode-card{background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02));border:2px solid rgba(255,255,255,.1);border-radius:16px;padding:30px 20px;text-align:center;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1)}.mode-card:hover{transform:translateY(-8px) scale(1.02);border-color:var(--gold);box-shadow:0 20px 40px rgba(0,0,0,.4),0 0 30px rgba(255,215,0,.2)}.mode-icon{font-size:3rem;margin-bottom:15px}.mode-title{font-size:1.2rem;font-weight:700;color:var(--gold);margin-bottom:8px}.mode-desc{font-size:.8rem;color:rgba(255,255,255,.5);font-family:sans-serif}.battle-container{display:none;height:100%;flex-direction:column}.battle-container.active{display:flex}.battle-header{display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:rgba(0,0,0,.5);border-bottom:1px solid rgba(255,255,255,.1)}.vs-display{display:flex;align-items:center;gap:20px}.player-tag{display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:8px}.player-tag.p1{background:linear-gradient(135deg,var(--p1-color),rgba(78,205,196,.3));box-shadow:0 0 20px var(--p1-glow)}.player-tag.p2{background:linear-gradient(135deg,var(--p2-color),rgba(255,107,157,.3));box-shadow:0 0 20px var(--p2-glow)}.player-name{font-weight:700;letter-spacing:.1em}.player-score{font-size:1.5rem;font-weight:900}.vs-icon{font-size:2rem;color:var(--gold);text-shadow:0 0 20px var(--gold);animation:vsPulse 1s ease-in-out infinite}@keyframes vsPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}.battle-area{flex:1;display:flex;justify-content:center;align-items:center;gap:40px;padding:20px;position:relative}.player-side{display:flex;flex-direction:column;align-items:center;gap:15px}.board-container{position:relative;border-radius:12px;overflow:hidden}.board-container.p1{border:3px solid var(--p1-color);box-shadow:0 0 30px var(--p1-glow),inset 0 0 30px rgba(0,0,0,.5)}.board-container.p2{border:3px solid var(--p2-color);box-shadow:0 0 30px var(--p2-glow),inset 0 0 30px rgba(0,0,0,.5)}.board-container.attack{animation:attackFlash .3s ease-out}@keyframes attackFlash{0%{filter:brightness(1)}50%{filter:brightness(2)}100%{filter:brightness(1)}}.board-container.damaged{animation:damageShake .4s ease-out}@keyframes damageShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}.board{display:grid;gap:1px;background:rgba(0,0,0,.8);padding:2px}.cell{width:clamp(14px,2.5vw,22px);height:clamp(14px,2.5vw,22px);background:rgba(255,255,255,.03);border-radius:2px;transition:all .08s}.cell.filled{box-shadow:0 0 8px currentColor,inset 0 0 6px rgba(255,255,255,.3)}.cell.ghost{opacity:.3}.cell.garbage{background:#666!important;box-shadow:0 0 5px #444!important}.cell.clearing{animation:lineClear .3s ease-out forwards}@keyframes lineClear{0%{transform:scale(1);opacity:1}50%{transform:scale(1.3);background:#fff}100%{transform:scale(0);opacity:0}}.garbage-meter{width:20px;height:100%;background:rgba(255,255,255,.1);border-radius:10px;overflow:hidden;display:flex;flex-direction:column-reverse}.garbage-fill{background:linear-gradient(to top,var(--danger),#FF8888);transition:height .3s ease-out;border-radius:10px}.next-preview{background:rgba(0,0,0,.3);border:2px solid rgba(255,255,255,.1);border-radius:8px;padding:10px}.next-label{color:rgba(255,255,255,.5);font-size:.65rem;text-align:center;margin-bottom:5px;letter-spacing:.2em}.next-grid{display:grid;gap:1px}.next-cell{width:clamp(10px,2vw,16px);height:clamp(10px,2vw,16px);border-radius:2px}.center-display{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:100}.attack-notification{position:absolute;font-size:2rem;font-weight:900;color:var(--danger);text-shadow:0 0 20px var(--danger);opacity:0;pointer-events:none}.attack-notification.show{animation:attackPop .8s ease-out forwards}@keyframes attackPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}30%{opacity:1;transform:translate(-50%,-50%) scale(1.3)}100%{opacity:0;transform:translate(-50%,-80%) scale(1)}}.countdown{font-size:6rem;font-weight:900;color:var(--gold);text-shadow:0 0 50px var(--gold);animation:countPulse 1s ease-out}@keyframes countPulse{0%{transform:scale(2);opacity:0}50%{opacity:1}100%{transform:scale(1);opacity:1}}.controls-hint{display:flex;justify-content:center;gap:40px;padding:15px;background:rgba(0,0,0,.3);font-size:.75rem;color:rgba(255,255,255,.6);font-family:sans-serif}.control-group{display:flex;flex-direction:column;align-items:center;gap:5px}.control-group span:first-child{font-weight:700;color:var(--gold)}.key-hint{display:flex;gap:5px}.key{padding:4px 8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:4px;font-size:.7rem}.result-overlay{position:fixed;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.95);z-index:200;gap:30px}.result-overlay.show{display:flex}.winner-display{font-size:4rem;font-weight:900;animation:winnerPop .6s ease-out}@keyframes winnerPop{0%{transform:scale(0);opacity:0}50%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}.winner-display.p1{color:var(--p1-color);text-shadow:0 0 50px var(--p1-glow)}.winner-display.p2{color:var(--p2-color);text-shadow:0 0 50px var(--p2-glow)}.result-stats{display:flex;gap:60px;color:#fff}.stat-column{text-align:center}.stat-label{font-size:.8rem;opacity:.6;margin-bottom:8px}.stat-value{font-size:2rem;font-weight:700}.result-buttons{display:flex;gap:20px}.result-btn{padding:15px 40px;font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;letter-spacing:.1em;border:none;border-radius:30px;cursor:pointer;transition:all .3s}.result-btn.primary{background:linear-gradient(135deg,var(--gold),#FF6B35);color:#000}.result-btn.secondary{background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.3);color:#fff}.result-btn:hover{transform:scale(1.05)}@media(max-width:768px){.battle-area{flex-direction:column;gap:20px}.player-side{flex-direction:row}.garbage-meter{width:100%;height:15px;flex-direction:row}.controls-hint{flex-wrap:wrap}}</style>
</head>
<body>
    <div class="lobby" id="lobby"><h1>⚔️ BATTLE ARENA</h1><p class="lobby-subtitle">対戦モードを選択</p><div class="mode-grid"><div class="mode-card" onclick="startBattle('local')"><div class="mode-icon">👥</div><div class="mode-title">LOCAL 2P</div><div class="mode-desc">同じキーボードで2人対戦</div></div><div class="mode-card" onclick="startBattle('ai')"><div class="mode-icon">🤖</div><div class="mode-title">VS CPU</div><div class="mode-desc">AIと対戦</div></div></div></div>
    <div class="battle-container" id="battleContainer"><div class="battle-header"><div class="vs-display"><div class="player-tag p1"><span class="player-name">PLAYER 1</span><span class="player-score" id="p1Score">0</span></div><div class="vs-icon">⚔️</div><div class="player-tag p2"><span class="player-name" id="p2Name">PLAYER 2</span><span class="player-score" id="p2Score">0</span></div></div></div><div class="battle-area"><div class="player-side"><div class="next-preview"><div class="next-label">NEXT</div><div class="next-grid" id="p1Next"></div></div><div class="board-container p1" id="p1BoardWrap"><div class="board" id="p1Board"></div></div><div class="garbage-meter"><div class="garbage-fill" id="p1Garbage" style="height:0%"></div></div></div><div class="center-display"><div class="countdown" id="countdown"></div><div class="attack-notification" id="attackNotif"></div></div><div class="player-side"><div class="garbage-meter"><div class="garbage-fill" id="p2Garbage" style="height:0%"></div></div><div class="board-container p2" id="p2BoardWrap"><div class="board" id="p2Board"></div></div><div class="next-preview"><div class="next-label">NEXT</div><div class="next-grid" id="p2Next"></div></div></div></div><div class="controls-hint"><div class="control-group"><span>P1 (WASD)</span><div class="key-hint"><span class="key">A</span><span class="key">S</span><span class="key">D</span><span class="key">W</span><span class="key">Space</span></div></div><div class="control-group"><span>P2 (Arrows)</span><div class="key-hint"><span class="key">←</span><span class="key">↓</span><span class="key">→</span><span class="key">↑</span><span class="key">Enter</span></div></div></div></div>
    <div class="result-overlay" id="resultOverlay"><div class="winner-display" id="winnerText">PLAYER 1 WINS!</div><div class="result-stats"><div class="stat-column"><div class="stat-label">P1 SCORE</div><div class="stat-value" id="finalP1">0</div></div><div class="stat-column"><div class="stat-label">P2 SCORE</div><div class="stat-value" id="finalP2">0</div></div></div><div class="result-buttons"><button class="result-btn primary" onclick="startBattle(lastMode)">🔄 REMATCH</button><button class="result-btn secondary" onclick="backToLobby()">← LOBBY</button></div></div>
    <script>const W=10,H=20,COLORS=['#FF6B9D','#4ECDC4','#FFE66D','#A29BFE','#FF6B6B','#6C5CE7','#00D9FF'],SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];let audioCtx,lastMode='local',gameRunning=false,isAI=false,aiTimer;const players={p1:{board:null,piece:null,piecePos:null,nextPiece:null,score:0,garbage:0,dropTimer:null},p2:{board:null,piece:null,piecePos:null,nextPiece:null,score:0,garbage:0,dropTimer:null}};function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)}function playTone(freq,dur=.1,type='sine'){if(!audioCtx)return;try{const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(.2,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.01,audioCtx.currentTime+dur);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+dur)}catch(e){}}function playAttackSound(){playTone(200,.15,'sawtooth');setTimeout(()=>playTone(150,.1,'square'),50)}function randomPiece(){return{shape:SHAPES[Math.floor(Math.random()*SHAPES.length)],color:COLORS[Math.floor(Math.random()*COLORS.length)]}}function createBoard(id){const el=document.getElementById(id);el.innerHTML='';el.style.gridTemplateColumns='repeat('+W+', 1fr)';for(let i=0;i<W*H;i++){const cell=document.createElement('div');cell.className='cell';el.appendChild(cell)}}function drawBoard(player,boardId){const p=players[player],cells=document.getElementById(boardId).children,display=p.board.map(r=>[...r]);if(p.piece){let gy=p.piecePos.y;while(!collision(p,p.piece,p.piecePos.x,gy+1))gy++;p.piece.shape.forEach((row,py)=>{row.forEach((val,px)=>{if(val){const by=gy+py,bx=p.piecePos.x+px;if(by>=0&&by<H&&bx>=0&&bx<W&&!display[by][bx])display[by][bx]={color:p.piece.color,ghost:true}}})});p.piece.shape.forEach((row,py)=>{row.forEach((val,px)=>{if(val){const by=p.piecePos.y+py,bx=p.piecePos.x+px;if(by>=0&&by<H&&bx>=0&&bx<W)display[by][bx]={color:p.piece.color}}})})}for(let y=0;y<H;y++){for(let x=0;x<W;x++){const cell=cells[y*W+x],val=display[y][x];if(val){cell.className='cell filled'+(val.ghost?' ghost':'')+(val.garbage?' garbage':'');cell.style.backgroundColor=val.color;cell.style.color=val.color}else{cell.className='cell';cell.style.backgroundColor='';cell.style.color=''}}}}function drawNext(player,nextId){const p=players[player];if(!p.nextPiece)return;const shape=p.nextPiece.shape,el=document.getElementById(nextId);el.innerHTML='';el.style.gridTemplateColumns='repeat('+shape[0].length+', 1fr)';shape.forEach(row=>{row.forEach(val=>{const cell=document.createElement('div');cell.className='next-cell';if(val){cell.style.backgroundColor=p.nextPiece.color;cell.style.boxShadow='0 0 6px '+p.nextPiece.color}el.appendChild(cell)})})}function collision(p,piece,px,py){return piece.shape.some((row,y)=>row.some((val,x)=>{if(!val)return false;const bx=px+x,by=py+y;return bx<0||bx>=W||by>=H||(by>=0&&p.board[by][bx])}))}function rotate(piece){return{...piece,shape:piece.shape[0].map((_,i)=>piece.shape.map(row=>row[i]).reverse())}}function lock(player,boardId,opponent){const p=players[player],opp=players[opponent];p.piece.shape.forEach((row,py)=>{row.forEach((val,px)=>{if(val){const by=p.piecePos.y+py,bx=p.piecePos.x+px;if(by>=0&&by<H)p.board[by][bx]={color:p.piece.color}}})});let cleared=0;const newBoard=[],clearingRows=[];p.board.forEach((row,y)=>{if(row.every(c=>c!==null)){cleared++;clearingRows.push(y)}else newBoard.push(row)});if(cleared>0){const cells=document.getElementById(boardId).children;clearingRows.forEach(y=>{for(let x=0;x<W;x++)cells[y*W+x].classList.add('clearing')});setTimeout(()=>{while(newBoard.length<H)newBoard.unshift(Array(W).fill(null));p.board=newBoard;const pts=[0,100,300,500,800][cleared];p.score+=pts;updateScores();if(cleared>=2){const garbageLines=cleared-1;opp.garbage+=garbageLines;document.getElementById(opponent+'Garbage').style.height=Math.min(opp.garbage*5,100)+'%';showAttack(opponent,garbageLines);playAttackSound();document.getElementById(player+'BoardWrap').classList.add('attack');setTimeout(()=>document.getElementById(player+'BoardWrap').classList.remove('attack'),300)}drawBoard(player,boardId)},300)}if(p.garbage>0)addGarbage(player,boardId);p.piece=p.nextPiece;p.nextPiece=randomPiece();p.piecePos={x:Math.floor(W/2)-1,y:0};drawNext(player,player+'Next');drawBoard(player,boardId);if(collision(p,p.piece,p.piecePos.x,p.piecePos.y))endBattle(opponent)}function addGarbage(player,boardId){const p=players[player],linesToAdd=Math.min(p.garbage,8);p.garbage=Math.max(0,p.garbage-linesToAdd);document.getElementById(player+'Garbage').style.height=Math.min(p.garbage*5,100)+'%';p.board.splice(0,linesToAdd);const gapX=Math.floor(Math.random()*W);for(let i=0;i<linesToAdd;i++){const row=Array(W).fill(null).map((_,x)=>x===gapX?null:{color:'#666',garbage:true});p.board.push(row)}document.getElementById(player+'BoardWrap').classList.add('damaged');setTimeout(()=>document.getElementById(player+'BoardWrap').classList.remove('damaged'),400);playTone(100,.2,'square')}function showAttack(target,lines){const notif=document.getElementById('attackNotif');notif.textContent='+'+lines+' GARBAGE!';notif.className='attack-notification show';setTimeout(()=>notif.className='attack-notification',800)}function move(player,boardId,opponent,dx,dy){if(!gameRunning)return;const p=players[player];if(!p.piece)return;if(!collision(p,p.piece,p.piecePos.x+dx,p.piecePos.y+dy)){p.piecePos.x+=dx;p.piecePos.y+=dy;if(dx!==0)playTone(392,.03,'square');drawBoard(player,boardId)}else if(dy>0)lock(player,boardId,opponent)}function rotatePiece(player,boardId){if(!gameRunning)return;const p=players[player];if(!p.piece)return;const rotated=rotate(p.piece);if(!collision(p,rotated,p.piecePos.x,p.piecePos.y)){p.piece=rotated;playTone(523,.05);drawBoard(player,boardId)}}function hardDrop(player,boardId,opponent){if(!gameRunning)return;const p=players[player];if(!p.piece)return;while(!collision(p,p.piece,p.piecePos.x,p.piecePos.y+1))p.piecePos.y++;playTone(196,.08,'sawtooth');drawBoard(player,boardId);lock(player,boardId,opponent)}function updateScores(){document.getElementById('p1Score').textContent=players.p1.score;document.getElementById('p2Score').textContent=players.p2.score}function initPlayer(player){players[player]={board:Array(H).fill().map(()=>Array(W).fill(null)),piece:randomPiece(),piecePos:{x:Math.floor(W/2)-1,y:0},nextPiece:randomPiece(),score:0,garbage:0,dropTimer:null}}function startBattle(mode){lastMode=mode;isAI=mode==='ai';initAudio();document.getElementById('lobby').style.display='none';document.getElementById('battleContainer').classList.add('active');document.getElementById('resultOverlay').classList.remove('show');document.getElementById('p2Name').textContent=isAI?'CPU':'PLAYER 2';initPlayer('p1');initPlayer('p2');createBoard('p1Board');createBoard('p2Board');drawBoard('p1','p1Board');drawBoard('p2','p2Board');drawNext('p1','p1Next');drawNext('p2','p2Next');updateScores();document.getElementById('p1Garbage').style.height='0%';document.getElementById('p2Garbage').style.height='0%';const countdown=document.getElementById('countdown');let count=3;countdown.textContent=count;countdown.style.display='block';const countInterval=setInterval(()=>{count--;if(count>0){countdown.textContent=count;playTone(440,.1)}else if(count===0){countdown.textContent='GO!';playTone(880,.2,'triangle')}else{clearInterval(countInterval);countdown.style.display='none';gameRunning=true;startDropTimers();if(isAI)startAI()}},1000)}function startDropTimers(){players.p1.dropTimer=setInterval(()=>{if(gameRunning)move('p1','p1Board','p2',0,1)},1000);players.p2.dropTimer=setInterval(()=>{if(gameRunning)move('p2','p2Board','p1',0,1)},1000)}function startAI(){aiTimer=setInterval(()=>{if(!gameRunning)return;const p=players.p2;if(!p.piece)return;const action=Math.random();if(action<.3)move('p2','p2Board','p1',-1,0);else if(action<.6)move('p2','p2Board','p1',1,0);else if(action<.8)rotatePiece('p2','p2Board');else if(action<.95)move('p2','p2Board','p1',0,1);else hardDrop('p2','p2Board','p1')},200)}function endBattle(winner){gameRunning=false;clearInterval(players.p1.dropTimer);clearInterval(players.p2.dropTimer);if(aiTimer)clearInterval(aiTimer);document.getElementById('winnerText').textContent=(winner==='p1'?'PLAYER 1':(isAI?'CPU':'PLAYER 2'))+' WINS!';document.getElementById('winnerText').className='winner-display '+winner;document.getElementById('finalP1').textContent=players.p1.score;document.getElementById('finalP2').textContent=players.p2.score;document.getElementById('resultOverlay').classList.add('show')}function backToLobby(){document.getElementById('resultOverlay').classList.remove('show');document.getElementById('battleContainer').classList.remove('active');document.getElementById('lobby').style.display='flex'}document.addEventListener('keydown',e=>{if(!gameRunning)return;if(e.key==='a'||e.key==='A')move('p1','p1Board','p2',-1,0);else if(e.key==='d'||e.key==='D')move('p1','p1Board','p2',1,0);else if(e.key==='s'||e.key==='S')move('p1','p1Board','p2',0,1);else if(e.key==='w'||e.key==='W')rotatePiece('p1','p1Board');else if(e.key===' '){e.preventDefault();hardDrop('p1','p1Board','p2')}if(!isAI){if(e.key==='ArrowLeft')move('p2','p2Board','p1',-1,0);else if(e.key==='ArrowRight')move('p2','p2Board','p1',1,0);else if(e.key==='ArrowDown')move('p2','p2Board','p1',0,1);else if(e.key==='ArrowUp')rotatePiece('p2','p2Board');else if(e.key==='Enter'){e.preventDefault();hardDrop('p2','p2Board','p1')}}})<\/script>
</body>
</html>`;

const moddedGameHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LIFE JOURNEY</title>
    <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const{useState}=React;function LifeJourney(){const[activeTab,setActiveTab]=useState(0);const[isTransitioning,setIsTransitioning]=useState(false);const chapters=[{id:'birth',emoji:'👶',title:'誕生',subtitle:'BIRTH',poem:'光の中へ、新たな命が芽吹く',description:'無限の可能性を秘めて、この世界に生を受けた瞬間。全ては白紙のキャンバス。',gradient:'linear-gradient(135deg, #FFE5EC 0%, #FFF5F7 50%, #FFEEF2 100%)',accent:'#FF6B9D'},{id:'growth',emoji:'🌱',title:'成長',subtitle:'GROWTH',poem:'一歩一歩、確かな足跡を刻んで',description:'知識を吸収し、経験を重ね、少しずつ自分という存在を形作っていく時期。',gradient:'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #E8F5E9 100%)',accent:'#4CAF50'},{id:'dream',emoji:'✨',title:'夢',subtitle:'DREAM',poem:'星に手を伸ばし、明日を描く',description:'心に灯った情熱。叶えたい願い、なりたい自分への希望が胸を焦がす。',gradient:'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E3F2FD 100%)',accent:'#2196F3'},{id:'challenge',emoji:'🔥',title:'挑戦',subtitle:'CHALLENGE',poem:'壁の向こうに、真の強さがある',description:'困難と向き合い、時に躓きながらも立ち上がる。その度に心は鍛えられていく。',gradient:'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFF3E0 100%)',accent:'#FF9800'},{id:'love',emoji:'💕',title:'愛',subtitle:'LOVE',poem:'誰かのために、自分のために',description:'人との繋がりの中で見つける温もり。与え、与えられる愛の循環。',gradient:'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 50%, #FCE4EC 100%)',accent:'#E91E63'},{id:'wisdom',emoji:'🌙',title:'叡智',subtitle:'WISDOM',poem:'経験が織りなす、静かなる光',description:'歩んできた道のりが教えてくれた真実。穏やかな眼差しで世界を見つめる。',gradient:'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 50%, #EDE7F6 100%)',accent:'#673AB7'},{id:'legacy',emoji:'🌸',title:'継承',subtitle:'LEGACY',poem:'桜のように、次の春へと繋ぐ',description:'自分が受け取ったものを次の世代へ。命は続いていく、永遠の物語。',gradient:'linear-gradient(135deg, #FFF0F5 0%, #FFE4E9 50%, #FFF0F5 100%)',accent:'#FF6B9D'}];const current=chapters[activeTab];const isDark=['dream','wisdom'].includes(current.id);const handleTabChange=(index)=>{if(index===activeTab)return;setIsTransitioning(true);setTimeout(()=>{setActiveTab(index);setIsTransitioning(false)},300)};return(<div style={{width:'100vw',height:'100vh',background:current.gradient,transition:'background 0.6s ease',position:'relative',overflow:'hidden',fontFamily:'"Zen Kaku Gothic New", sans-serif'}}><style>{\`@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}@keyframes starTwinkle{0%,100%{opacity:.3}50%{opacity:1}}.tab-button{position:relative;padding:12px 8px;background:transparent;border:none;cursor:pointer;transition:all .4s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;align-items:center;gap:6px;opacity:.6}.tab-button:hover{opacity:1;transform:translateY(-4px)}.tab-button.active{opacity:1}.tab-button.active::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:30px;height:3px;background:currentColor;border-radius:2px}.content-area{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;position:relative}.floating-emoji{position:absolute;font-size:80px;animation:float 6s ease-in-out infinite;opacity:.3;filter:blur(2px);z-index:0}.main-content{position:relative;z-index:1;text-align:center;max-width:600px;animation:slideUp .6s ease-out}.chapter-emoji{font-size:100px;animation:pulse 3s ease-in-out infinite;margin-bottom:20px}.chapter-title{font-size:4rem;font-weight:700;letter-spacing:.3em;margin:0;text-shadow:0 4px 30px rgba(0,0,0,.1)}.chapter-subtitle{font-family:'Zen Kaku Gothic New',sans-serif;font-size:1rem;letter-spacing:.5em;text-transform:uppercase;opacity:.7;margin-top:8px}.chapter-poem{font-size:1.5rem;font-weight:300;margin:30px 0;font-style:italic;opacity:.9}.chapter-description{font-family:'Zen Kaku Gothic New',sans-serif;font-size:1.1rem;line-height:2;opacity:.85;max-width:500px;margin:0 auto}.progress-bar{position:absolute;bottom:0;left:0;right:0;height:4px;background:rgba(255,255,255,.2)}.progress-fill{height:100%;transition:width .6s cubic-bezier(.4,0,.2,1)}.star{position:absolute;width:4px;height:4px;background:#fff;border-radius:50%;animation:starTwinkle 2s ease-in-out infinite}\`}</style>{isDark&&Array.from({length:30}).map((_,i)=>(<div key={i} className="star" style={{left:(Math.random()*100)+'%',top:(Math.random()*60)+'%',animationDelay:(Math.random()*2)+'s',opacity:Math.random()*.5+.3}}/>))}<nav style={{display:'flex',justifyContent:'center',gap:'8px',padding:'30px 20px 20px',flexWrap:'wrap',color:isDark?'#fff':'#333'}}>{chapters.map((chapter,index)=>(<button key={chapter.id} className={'tab-button '+(activeTab===index?'active':'')} onClick={()=>handleTabChange(index)} style={{color:'inherit'}}><span style={{fontSize:'24px'}}>{chapter.emoji}</span><span style={{fontSize:'12px',fontFamily:'"Zen Kaku Gothic New", sans-serif',letterSpacing:'.1em'}}>{chapter.title}</span></button>))}</nav><main className="content-area" style={{color:isDark?'#fff':'#333',opacity:isTransitioning?0:1,transition:'opacity .3s ease'}}><span className="floating-emoji" style={{top:'10%',left:'5%',animationDelay:'0s'}}>{current.emoji}</span><span className="floating-emoji" style={{top:'60%',right:'10%',animationDelay:'2s'}}>{current.emoji}</span><span className="floating-emoji" style={{bottom:'20%',left:'15%',animationDelay:'4s'}}>{current.emoji}</span><div className="main-content" key={activeTab}><div className="chapter-emoji">{current.emoji}</div><h1 className="chapter-title">{current.title}</h1><p className="chapter-subtitle">{current.subtitle}</p><p className="chapter-poem">「{current.poem}」</p><p className="chapter-description">{current.description}</p></div></main><div className="progress-bar"><div className="progress-fill" style={{width:((activeTab+1)/chapters.length*100)+'%',background:current.accent}}/></div><div style={{position:'absolute',bottom:'20px',right:'20px',fontFamily:'"Zen Kaku Gothic New", sans-serif',fontSize:'14px',opacity:.6,color:isDark?'#fff':'#333'}}>{String(activeTab+1).padStart(2,'0')} / {String(chapters.length).padStart(2,'0')}</div></div>)}ReactDOM.createRoot(document.getElementById('root')).render(<LifeJourney/>)
    <\/script>
</body>
</html>`;

export default function RhythmiaNexus() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<'vanilla' | 'multiplayer' | 'modded' | null>(null);
  const [onlineCount, setOnlineCount] = useState(127);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(120 + Math.floor(Math.random() * 30) - 15);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const launchGame = useCallback((type: 'vanilla' | 'multiplayer' | 'modded') => {
    setActiveGame(type);
  }, []);

  const closeGame = useCallback(() => {
    setActiveGame(null);
  }, []);

  const getGameContent = (type: 'vanilla' | 'multiplayer' | 'modded') => {
    switch (type) {
      case 'vanilla': return vanillaGameHTML;
      case 'multiplayer': return multiplayerGameHTML;
      case 'modded': return moddedGameHTML;
    }
  };

  const getGameTitle = (type: 'vanilla' | 'multiplayer' | 'modded') => {
    switch (type) {
      case 'vanilla': return '🎮 RHYTHMIA — VANILLA SERVER';
      case 'multiplayer': return '⚔️ BATTLE ARENA — MULTIPLAYER';
      case 'modded': return '✨ LIFE JOURNEY — MOD SERVER';
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@300;400;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
          --neon-pink: #FF6B9D;
          --neon-cyan: #4ECDC4;
          --neon-purple: #A29BFE;
          --neon-gold: #FFD700;
          --neon-orange: #FF6B35;
          --dark-bg: #0a0a12;
          --darker-bg: #050508;
        }
        
        body { font-family: 'Zen Kaku Gothic New', sans-serif; background: var(--dark-bg); min-height: 100vh; overflow-x: hidden; color: #fff; }
        .bg-grid { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(78, 205, 196, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78, 205, 196, 0.03) 1px, transparent 1px); background-size: 50px 50px; animation: gridMove 20s linear infinite; pointer-events: none; z-index: 0; }
        @keyframes gridMove { 0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 100% { transform: perspective(500px) rotateX(60deg) translateY(50px); } }
        .bg-glow { position: fixed; width: 600px; height: 600px; border-radius: 50%; filter: blur(150px); opacity: 0.3; pointer-events: none; z-index: 0; }
        .glow-1 { top: -200px; left: -200px; background: var(--neon-pink); animation: glowPulse 8s ease-in-out infinite; }
        .glow-2 { bottom: -200px; right: -200px; background: var(--neon-cyan); animation: glowPulse 8s ease-in-out infinite 4s; }
        .glow-3 { top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--neon-purple); animation: glowPulse 8s ease-in-out infinite 2s; opacity: 0.15; }
        @keyframes glowPulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } }
        .container { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }
        header { padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; letter-spacing: 0.3em; background: linear-gradient(135deg, var(--neon-pink), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .status-bar { display: flex; gap: 20px; font-size: 0.85rem; opacity: 0.7; }
        .status-item { display: flex; align-items: center; gap: 8px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: statusPulse 2s ease-in-out infinite; }
        @keyframes statusPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
        .hero-text { text-align: center; margin-bottom: 60px; }
        .hero-text h1 { font-family: 'Orbitron', monospace; font-size: clamp(2rem, 8vw, 5rem); font-weight: 900; letter-spacing: 0.2em; margin-bottom: 20px; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: titleGlow 3s ease-in-out infinite; }
        @keyframes titleGlow { 0%, 100% { filter: drop-shadow(0 0 20px rgba(255,107,157,0.5)); } 50% { filter: drop-shadow(0 0 40px rgba(78,205,196,0.8)); } }
        .hero-text p { font-size: 1.1rem; opacity: 0.6; letter-spacing: 0.3em; text-transform: uppercase; }
        .server-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; width: 100%; max-width: 1200px; }
        .server-card { position: relative; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 35px 25px; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }
        .server-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, var(--card-color) 0%, transparent 50%); opacity: 0; transition: opacity 0.4s; }
        .server-card:hover::before { opacity: 0.1; }
        .server-card:hover { transform: translateY(-10px) scale(1.02); border-color: var(--card-color); box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px var(--card-color-dim); }
        .server-card.vanilla { --card-color: var(--neon-cyan); --card-color-dim: rgba(78, 205, 196, 0.3); }
        .server-card.modded { --card-color: var(--neon-pink); --card-color-dim: rgba(255, 107, 157, 0.3); }
        .server-card.multiplayer { --card-color: var(--neon-gold); --card-color-dim: rgba(255, 215, 0, 0.3); }
        .card-icon { font-size: 3.5rem; margin-bottom: 15px; display: block; }
        .card-badge { position: absolute; top: 20px; right: 20px; padding: 6px 14px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 20px; background: var(--card-color); color: var(--darker-bg); }
        .card-badge.new { background: linear-gradient(135deg, #FF6B35, #FFD700); animation: badgePulse 2s ease-in-out infinite; }
        @keyframes badgePulse { 0%, 100% { box-shadow: 0 0 10px rgba(255, 107, 53, 0.5); } 50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.8); } }
        .card-title { font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 700; margin-bottom: 8px; color: var(--card-color); }
        .card-subtitle { font-size: 0.85rem; opacity: 0.5; margin-bottom: 15px; letter-spacing: 0.2em; text-transform: uppercase; }
        .card-description { font-size: 0.9rem; line-height: 1.7; opacity: 0.7; margin-bottom: 20px; }
        .card-features { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .feature-tag { padding: 5px 10px; font-size: 0.7rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; opacity: 0.8; }
        .card-stats { display: flex; gap: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); }
        .stat { text-align: center; }
        .stat-value { font-family: 'Orbitron', monospace; font-size: 1.2rem; font-weight: 700; color: var(--card-color); }
        .stat-label { font-size: 0.65rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.1em; }
        .play-button { position: relative; width: 100%; padding: 14px; margin-top: 15px; font-family: 'Orbitron', monospace; font-size: 0.9rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--darker-bg); background: linear-gradient(135deg, var(--card-color), var(--card-color)); border: none; border-radius: 12px; cursor: pointer; overflow: hidden; transition: all 0.3s; }
        .play-button:hover { transform: scale(1.02); box-shadow: 0 10px 30px var(--card-color-dim); }
        .play-button::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
        .play-button:hover::after { left: 100%; }
        .game-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--darker-bg); z-index: 100; display: none; flex-direction: column; }
        .game-container.active { display: flex; }
        .game-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; background: rgba(0,0,0,0.8); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .game-title { font-family: 'Orbitron', monospace; font-size: 1rem; letter-spacing: 0.2em; }
        .back-button { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-family: 'Orbitron', monospace; font-size: 0.85rem; letter-spacing: 0.1em; color: #fff; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; transition: all 0.3s; }
        .back-button:hover { background: rgba(255,255,255,0.2); border-color: var(--neon-cyan); }
        .game-frame { flex: 1; border: none; width: 100%; }
        footer { padding: 30px 40px; text-align: center; font-size: 0.8rem; opacity: 0.4; letter-spacing: 0.2em; }
        .online-count { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--neon-gold); margin-top: 8px; }
        .online-dot { width: 6px; height: 6px; background: var(--neon-gold); border-radius: 50%; animation: onlinePulse 1.5s ease-in-out infinite; }
        @keyframes onlinePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 5px var(--neon-gold); } 50% { opacity: 0.5; box-shadow: 0 0 15px var(--neon-gold); } }
        .loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--darker-bg); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 200; opacity: 1; transition: opacity 0.5s; }
        .loading-overlay.hidden { opacity: 0; pointer-events: none; }
        .loader { width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--neon-cyan); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { margin-top: 20px; font-family: 'Orbitron', monospace; font-size: 0.9rem; letter-spacing: 0.3em; opacity: 0.7; }
        @media (max-width: 768px) { header { padding: 20px; flex-direction: column; gap: 15px; } .server-grid { grid-template-columns: 1fr; padding: 0 10px; } .hero-text h1 { letter-spacing: 0.1em; } }
      `}</style>

      {/* Background effects */}
      <div className="bg-grid"></div>
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-glow glow-3"></div>

      {/* Loading overlay */}
      <div className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
        <div className="loader"></div>
        <div className="loading-text">INITIALIZING...</div>
      </div>

      <div className="container">
        <header>
          <div className="logo">RHYTHMIA</div>
          <div className="status-bar">
            <div className="status-item">
              <span className="status-dot"></span>
              <span>サーバー接続中</span>
            </div>
            <div className="status-item">
              <span>v2.5.0</span>
            </div>
          </div>
        </header>

        <main>
          <div className="hero-text">
            <h1>SELECT SERVER</h1>
            <p>サーバーを選択してプレイ開始</p>
          </div>

          <div className="server-grid">
            {/* Vanilla Server */}
            <div className="server-card vanilla" onClick={() => launchGame('vanilla')}>
              <span className="card-badge">OFFICIAL</span>
              <span className="card-icon">🎮</span>
              <h2 className="card-title">VANILLA</h2>
              <p className="card-subtitle">Original Experience</p>
              <p className="card-description">
                オリジナルのRHYTHMIA体験。リズムに乗ってブロックを積み、ワールドを攻略しよう。純粋なゲームプレイを楽しめます。
              </p>
              <div className="card-features">
                <span className="feature-tag">🎵 5ワールド</span>
                <span className="feature-tag">⚡ リズムシステム</span>
                <span className="feature-tag">🎨 オリジナル</span>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">100</div>
                  <div className="stat-label">BPM Start</div>
                </div>
                <div className="stat">
                  <div className="stat-value">160</div>
                  <div className="stat-label">BPM Max</div>
                </div>
                <div className="stat">
                  <div className="stat-value">∞</div>
                  <div className="stat-label">レベル</div>
                </div>
              </div>
              <button className="play-button">▶ PLAY NOW</button>
            </div>

            {/* Multiplayer Server */}
            <div className="server-card multiplayer" onClick={() => launchGame('multiplayer')}>
              <span className="card-badge new">🔥 NEW</span>
              <span className="card-icon">⚔️</span>
              <h2 className="card-title">BATTLE ARENA</h2>
              <p className="card-subtitle">Multiplayer Mode</p>
              <p className="card-description">
                リアルタイム対戦モード！ライン消去で相手にガベージを送り込め。最後まで生き残った者が勝者だ。
              </p>
              <div className="card-features">
                <span className="feature-tag">👥 2P対戦</span>
                <span className="feature-tag">🤖 AI対戦</span>
                <span className="feature-tag">💥 ガベージ</span>
                <span className="feature-tag">🏆 ランキング</span>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">VS</div>
                  <div className="stat-label">Mode</div>
                </div>
                <div className="stat">
                  <div className="stat-value">1v1</div>
                  <div className="stat-label">Battle</div>
                </div>
                <div className="stat">
                  <div className="stat-value">LIVE</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
              <div className="online-count">
                <span className="online-dot"></span>
                <span>{onlineCount} players online</span>
              </div>
              <button className="play-button">⚔️ BATTLE NOW</button>
            </div>

            {/* Modded Server */}
            <div className="server-card modded" onClick={() => launchGame('modded')}>
              <span className="card-badge">MODDED</span>
              <span className="card-icon">✨</span>
              <h2 className="card-title">LIFE JOURNEY</h2>
              <p className="card-subtitle">Zen Experience</p>
              <p className="card-description">
                人生の旅を体験するインタラクティブアート。誕生から継承まで、7つの章を通じて人生の意味を探求します。
              </p>
              <div className="card-features">
                <span className="feature-tag">🌅 7チャプター</span>
                <span className="feature-tag">🎨 ビジュアルアート</span>
                <span className="feature-tag">📖 ストーリー</span>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">7</div>
                  <div className="stat-label">Chapters</div>
                </div>
                <div className="stat">
                  <div className="stat-value">∞</div>
                  <div className="stat-label">リプレイ</div>
                </div>
                <div className="stat">
                  <div className="stat-value">ZEN</div>
                  <div className="stat-label">Mode</div>
                </div>
              </div>
              <button className="play-button">▶ EXPERIENCE</button>
            </div>
          </div>
        </main>

        <footer>
          RHYTHMIA NEXUS © 2025 — PLAY YOUR RHYTHM
        </footer>
      </div>

      {/* Game Container */}
      <div className={`game-container ${activeGame ? 'active' : ''}`}>
        {activeGame && (
          <>
            <div className="game-header">
              <span className="game-title">{getGameTitle(activeGame)}</span>
              <button className="back-button" onClick={closeGame}>
                ← ロビーに戻る
              </button>
            </div>
            <iframe 
              className="game-frame" 
              srcDoc={getGameContent(activeGame)}
              title={getGameTitle(activeGame)}
            />
          </>
        )}
      </div>
    </>
  );
}
