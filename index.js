const audios = Array.from(document.querySelectorAll('audio'));
  const keysArray = Array.from(document.querySelectorAll('.key'));
  const keys = document.querySelector('.keys');
  const recButton = document.querySelector('.button-rec');
  const playButton = document.querySelector('.button-play');
  let recArray = [];
  let isREC = false;

  function playSound(event) {
    const audio = audios.find(elem => elem.dataset.key == event.keyCode);
    if (!audio) return;
    rec(event);
    audio.currentTime = 0;
    audio.play();
    switchTransition(event);
  }

  function switchTransition(event) {
    keysArray.forEach(key => key.classList.remove('playing'));
    const key = keysArray.find(key => key.dataset.key == event.keyCode);
    key.classList.add('playing');
    key.addEventListener('transitionend', evt => {
      if (evt.propertyName !== 'transform') return;
      key.classList.remove('playing')
    }) 
  }

  document.addEventListener('keydown', playSound);

  recButton.addEventListener('click', () => {
    isREC = !isREC;
    recButton.classList.toggle('active');
    if (isREC) {
      playButton.disabled = true;
      playButton.classList.remove('active')
    }
    else {
      playButton.disabled = false;
      playButton.classList.toggle('active');
      recArray = recArray.filter(item => item).map(item => {
        let obj = {};
        obj.keyCode = item;
        return obj;
      }).reverse();
    }
  })
  
  playButton.addEventListener('click', () => { 
    let timerId = setTimeout(function playRec() {
      if (recArray.length != 0) {
        playSound(recArray.pop());
        timerId = setTimeout(playRec, 500);
      }
      else {
        clearTimeout(timerId);
        playButton.classList.toggle('active');
        playButton.disabled = !playButton.disabled;
      }
    }, 1000);
  });
 
  keys.addEventListener('mousedown', (event) => {
    const clickedKey = event.target.closest('.key');
    if (!clickedKey) return;
    rec(event)
    const code = {keyCode: clickedKey.dataset.key};
    playSound(code)
  })

  function rec(event) {
    if(isREC) {
      recArray.push(+event.keyCode)
    }
  }