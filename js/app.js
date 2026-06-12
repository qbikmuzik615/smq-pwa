import { FluidSimulation } from './fluid-simulation.js';
const $ = id => document.getElementById(id);
const STORAGE_KEY = 'smq_v1';
const defaultSettings = { sound:true, fastHints:false, swirl:6, rainbow:5, startBlank:true, visibleTime:0.985, colorRotationSpeed:0.12, bloom:true, bloomIntensity:0.7, splatRadius:0.18, vorticity:22 };
const defaultState = { stage:1, score:0, questionIndex:0 };
let settings = Object.assign({}, defaultSettings);
let state = Object.assign({}, defaultState);
let fluid, inGame = false;

function saveAll(){ localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, state })); }
function loadAll(){ try{ const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); if(d.settings) Object.assign(settings, d.settings); if(d.state) Object.assign(state, d.state); }catch(e){} }

const questions = [
  { q:'What is 2+2?', a:['4','3','5','6'], c:0 },
  { q:'Capital of France?', a:['Paris','London','Berlin','Rome'], c:0 },
  { q:'Fastest land animal?', a:['Cheetah','Lion','Horse','Leopard'], c:0 }
];

function showQuestion(){
  const qi = questions[state.questionIndex % questions.length];
  $('questionText').textContent = qi.q;
  $('answerButtons').innerHTML = '';
  qi.a.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.onclick = () => handleAnswer(i, qi.c, btn);
    $('answerButtons').appendChild(btn);
  });
  $('stageBadge').textContent = 'Stage ' + state.stage;
  $('scoreBadge').textContent = state.score;
}

function handleAnswer(i, correct, btn){
  if(i === correct){ btn.classList.add('correct'); state.score += 10; state.questionIndex++; saveAll(); setTimeout(showQuestion, 700); }
  else { btn.classList.add('wrong'); saveAll(); }
  $('scoreBadge').textContent = state.score;
}

function startGame(){
  $('splashUi').classList.add('hidden');
  $('app').classList.remove('hidden');
  inGame = true;
  showQuestion();
}

function syncFluidControls(){
  $('rngVisible').value = String(settings.visibleTime);
  $('rngColorSpeed').value = String(settings.colorRotationSpeed);
  $('rngBloom').value = String(settings.bloomIntensity);
  $('rngRadius').value = String(settings.splatRadius);
  $('rngVorticity').value = String(settings.vorticity);
  $('tglStartBlank').classList.toggle('on', !!settings.startBlank);
  $('tglBloom').classList.toggle('on', !!settings.bloom);
  $('tglSound').classList.toggle('on', !!settings.sound);
  $('tglFastHints').classList.toggle('on', !!settings.fastHints);
  $('rngSwirl').value = String(settings.swirl);
  $('rngRainbow').value = String(settings.rainbow);
}

function initUI(){
  $('btnSettings').onclick = () => $('settingsPanel').classList.toggle('hidden');
  $('btnCloseSettings').onclick = () => $('settingsPanel').classList.add('hidden');
  $('tglSound').onclick = e => { settings.sound=!settings.sound; e.currentTarget.classList.toggle('on',settings.sound); saveAll(); };
  $('tglFastHints').onclick = e => { settings.fastHints=!settings.fastHints; e.currentTarget.classList.toggle('on',settings.fastHints); saveAll(); };
  $('tglStartBlank').onclick = e => { settings.startBlank=!settings.startBlank; e.currentTarget.classList.toggle('on',settings.startBlank); fluid?.setConfig({startBlank:settings.startBlank}); saveAll(); };
  $('tglBloom').onclick = e => { settings.bloom=!settings.bloom; e.currentTarget.classList.toggle('on',settings.bloom); fluid?.setConfig({bloom:settings.bloom}); saveAll(); };
  $('rngSwirl').oninput = e => { settings.swirl=+e.target.value; fluid?.setConfig({swirl:settings.swirl}); saveAll(); };
  $('rngRainbow').oninput = e => { settings.rainbow=+e.target.value; fluid?.setConfig({rainbow:settings.rainbow}); saveAll(); };
  $('rngVisible').oninput = e => { settings.visibleTime=+e.target.value; fluid?.setConfig({visibleTime:settings.visibleTime}); saveAll(); };
  $('rngColorSpeed').oninput = e => { settings.colorRotationSpeed=+e.target.value; fluid?.setConfig({colorRotationSpeed:settings.colorRotationSpeed}); saveAll(); };
  $('rngBloom').oninput = e => { settings.bloomIntensity=+e.target.value; fluid?.setConfig({bloomIntensity:settings.bloomIntensity}); saveAll(); };
  $('rngRadius').oninput = e => { settings.splatRadius=+e.target.value; fluid?.setConfig({splatRadius:settings.splatRadius}); saveAll(); };
  $('rngVorticity').oninput = e => { settings.vorticity=+e.target.value; fluid?.setConfig({vorticity:settings.vorticity}); saveAll(); };
  syncFluidControls();
}

function initFluid(){
  const canvas = $('fluidCanvas');
  fluid = new FluidSimulation(canvas, { startBlank:settings.startBlank, visibleTime:settings.visibleTime, colorRotationSpeed:settings.colorRotationSpeed, bloom:settings.bloom, bloomIntensity:settings.bloomIntensity, splatRadius:settings.splatRadius, vorticity:settings.vorticity, swirl:settings.swirl, rainbow:settings.rainbow });
  fluid.start();
  canvas.addEventListener('touchstart', () => { if(!inGame) startGame(); }, { once:true });
  canvas.addEventListener('mousedown', () => { if(!inGame) startGame(); }, { once:true });
}

loadAll();
window.addEventListener('DOMContentLoaded', () => { initUI(); initFluid(); });
