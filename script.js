//Global variables - to keep track of the state of the game
var pattern = [1, 2, 3, 4, 1, 1, 2, 4]; //keep track of button presses
var progress = 0; //is the number of levels the player has completed / index for the pattern array
var gamePlaying = false; //is the game currently active? / use Start and Stop buttons / true means active
var tonePlaying = false; //Is the tone of the button playing?
var volume = 0.5;  //must be between 0.0 and 1.0

//Users calls startGame() when they want they press start.
function startGame(){
    //initialize game variables
    progress = 0; //no progress yet.
    gamePlaying = true; //set the current game as active.
  
    //hide the Start button and show the Stop button. request DOM for structure
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
}

//Users calls stopGame() when they press stop.
function stopGame(){
    //initialize game variables
    progress = 0; //no progress yet.
    gamePlaying = false; //set the current game to in-active.
  
    //hide the Stop button and show the Start button. request DOM for structure
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions:
//determines the peach of sound for each button.
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

//plays a tone during a specified amount of time. It takes a button number (1-4), and a length of time.
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

//function that starts playing the tone. It takes a button number as argument.
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

//after you call startTone() you may call stop tone to stop playing the sound.
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)