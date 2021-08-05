const audios = Array.from(document.querySelectorAll('audio'));
const keysArray = Array.from(document.querySelectorAll('.key'));
const keys = document.querySelector('.keys');
const recButton = document.querySelector('.button-rec');
const playButton = document.querySelector('.button-play');
let recArray = [];
let isREC = false;
let str = "";

function keyEvent(event) {
  if(event.keyCode == 82) rec();
  else if (event.keyCode == 80 || event.keyCode == 32) playRec();
  else {
    const audio = audios.find(elem => elem.dataset.key == event.keyCode);
    if (!audio) return;
    recording(event);
    str += event.keyCode;
    if (str.includes('686865')) easterEgg();
    console.log(str)
    audio.currentTime = 0;
    audio.play();
    switchTransition(event);
  }
}

keys.addEventListener('mousedown', (event) => {
  const clickedKey = event.target.closest('.key');
  if (!clickedKey) return;
  const code = {keyCode: clickedKey.dataset.key};
  keyEvent(code);
})

function switchTransition(event) {
  keysArray.forEach(key => key.classList.remove('playing'));
  const key = keysArray.find(key => key.dataset.key == event.keyCode);
  key.classList.add('playing');
  key.addEventListener('transitionend', evt => {
    if (evt.propertyName !== 'transform') return;
    key.classList.remove('playing');
  }) 
}

document.addEventListener('keydown', keyEvent);

function rec() {
  isREC = !isREC;
  recButton.classList.toggle('active');
  if (isREC) {
    recArray = [];
    playButton.disabled = true;
    playButton.classList.remove('active');
  }
  else {
    if (recArray.length) {
      playButton.disabled = false;
      playButton.classList.toggle('active');
      recArray = recArray.map(item => {
        let obj = {};
        obj.keyCode = item;
        return obj;
      }).reverse();
    }
  }
}

function recording(event) {
  if(isREC) {
    recArray.push(+event.keyCode);
  }
}

function playRec() {
  let timerId = setTimeout(function playRec() {
    if (recArray.length != 0) {
      keyEvent(recArray.pop());
      timerId = setTimeout(playRec, 500);
    }
    else {
      clearTimeout(timerId);
      playButton.classList.toggle('active');
      playButton.disabled = !playButton.disabled;
    }
  }, 1000);
}

recButton.addEventListener('click', rec);
playButton.addEventListener('click', playRec);

function easterEgg() {
  const linkHTML = '<a href="https://www.youtube.com/watch?v=y3Ca3c6J9N4" class="easter-egg" target="_blank"></a>'
  const div = document.createElement('div');
  div.innerHTML = linkHTML;
  document.body.appendChild(div.firstChild);
  const egg = document.querySelector('.easter-egg');
  egg.click();
  str = "";
  egg.remove();
}
