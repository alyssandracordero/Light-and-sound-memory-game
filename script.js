// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global variables - to keep track of the state of the game
var pattern = [1, 2, 3, 4, 1, 1, 2, 4]; //keep track of button presses
var progress = 0; //is the number of levels the player has completed / index for the pattern array
var gamePlaying = false; //is the game currently active? / use Start and Stop buttons / true means active
var tonePlaying = false; //Is the tone of the button playing?
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0; //is the user in the clue sequence?

//Users calls startGame() when they want they press start.
function startGame(){
    //initialize game variables
    progress = 0; //no progress yet.
    gamePlaying = true; //set the current game as active.
  
    //hide the Start button and show the Stop button. request DOM for structure
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
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

//functions for playing the clue for the user to repeat by passign the lit class to the HTML.
//lighting the button, this function takes a button number
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
//clear the lighting, this function takes a button number
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

//function for playing a single clue for a specific amount of time by using  setTimeout()
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

//function to play a sequence of the clues.
function playClueSequence(){
  guessCounter = 0 //reset guess counter to 0 (bc new sequence being played)
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

//win / loss notifications
//notifies user that they have lost
function loseGame(){
  stopGame();
  alert("Game Over. You lost."); //pop-up of the message.
}

//notifies user that they won the game.
function winGame(){
  stopGame();
  alert("Game Over. You have won!");
}

//function to check if the user guessed the correct button.
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(Number(btn)===Number(pattern[guessCounter])){//if guessed correctly
    //guess was correct!
    if(Number(progress)===Number(guessCounter)){//check if their turn is over
      if(Number(progress)===Number(pattern.length-1)){//check if its their last turn
        winGame();
      }else{
        progress++;
        playClueSequence();  
      }
    }else{
      guessCounter++;
    }
  }else{
    loseGame();//guess was incorrect, user loss. 
  }
}