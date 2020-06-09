let r, g, b, m, n;
let mic, fft, line, song;
let x = 0.0;
let ctx, ctxOn;
var bot = new RiveScript();
let green, blue; 

let speech = new p5.Speech();
    speech.onStart = speechStart;
    speech.onEnd = speechEnd;

function preload() {
  song = loadSound('button.mp3');
}


function setup() {

  createCanvas(1280, 720);
  g = 0;
  grenn = 255;
  blue = 255;

  ctx = getAudioContext();
    ctxOn = createButton('turn on Audio');
    ctxOn.mousePressed(() => {
  	ctx.resume().then(() => {
  	console.log('Audio Context is now ON');
        ctxOn.hide();
  	});
  });
  
  mic = new p5.AudioIn();
  mic.start();
  
  fft = new p5.FFT();
  fft.setInput(mic);

  let speechRec = new p5.SpeechRec('en-US', gotSpeech);
  
  speechRec.start(true, false);

  function gotSpeech(){
    let input = speechRec.resultString;
    bot.reply("local-user", input).then(function(reply) {
      console.log("bot>", reply);
      line = reply;

      let voices = speech.voices;
      let voice = random(voices);
      speech.setVoice(voice.name);
      speech.speak(line);

      if(line.indexOf("turn off")!=-1){
        grenn = 0;
        blue = 0;
      }else if (line.indexOf("shut up")!=-1){
        grenn = 0;
        blue = 0;
      }else if (line.indexOf("stop")!=-1){
        grenn = 0;
        blue = 0;
      }else if (line.indexOf("hahaha")!=-1){
        grenn = 255;
        blue = 255;
      }
    }); 
    console.log(input);

  }

  bot.loadFile("brain.rive").then(brainReady).catch(brainError);

  function brainReady(){
    console.log('chatbot ready');
    bot.sortReplies();
  }

  function brainError(){
    console.log('error');
  } 

}

function draw() {
  background(0);

  let spectrum = fft.analyze();
  noStroke();

  for (i = 0; i < spectrum.length; i++) {

    var l = spectrum[i] / 50;
    var s = spectrum[i] / 35;
    var r = map(i, 0, 140, 0, 0.5)
    var n = map(i, 0, 30, 0, 0.5)


    fill(255, grenn, blue, 255 - g);

    ellipse(width / 2, i * r + height / 2 - 10, 10, l);
    ellipse(width / 2, -i * r + height / 2 - 10, 10, l);
    ellipse(i * r + width / 2, height / 2 - 50, l, 10);
    ellipse(-i * r + width / 2, height / 2 - 50, l, 10);

    fill(255, grenn, blue, g);

    ellipse(width / 2, i * n + height / 2 - 10, 10, s);
    ellipse(width / 2, -i * n + height / 2 - 10, 10, s);
    ellipse(i * n + width / 2, height / 2 - 50, s, 10);
    ellipse(-i * n + width / 2, height / 2 - 50, s, 10);

  }

}

function speechStart(){
  g = 255
}

function speechEnd(){
  g = 0
  song.play();
}

