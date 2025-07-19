const emoji = document.querySelector(".emoji");
const form = document.querySelector("#input-form");
const container = document.querySelector(".container");
let currentSize = 200;
let shrinking = false;
let explode = false;
let numParticle = 0;

//stopwatch variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let stopwatch;
const timer = document.querySelector(".timer");


//-------eventlistener
emoji.addEventListener('click',(e)=>{
    currentSize += 10;
    if(currentSize>300){
        //explode
        emoji.style.fontSize = "0px";
        currentSize = 0;
        explode = true;
        shrinking = false;
        for(let i=0;i<10;i++){
            setTimeout(()=>particleGenerator(Math.floor(Math.random()*100),"fall"),i*200)
        }
        stop(); //stop timer 
        record();
    }else if(!explode){
        if(!isRunning){
            start();
        }
        particleGenerator(0,"spit");
        emoji.style.fontSize = currentSize.toString() + "px";
    }

    //prevent activating multiple animation at the same time by shrinking = t/f
    if(!shrinking && currentSize>200 && !explode){
        shrinking = true;
        requestAnimationFrame(shrink);
    }

    //delete particles if too many
    if(numParticle>15){
        removeParticle(7,".particle.spit");
        
    }
})

//----- reset 
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    setEmoji(e.target[0].value);

    emoji.style.fontSize = "200px";
    currentSize = 200;
    e.target[0].value = '';
    shrinking = false;
    explode = false;
    currentSize = 200;

    //reset timer + record
    reset();
    timer.innerText = "How fast can you click me?"
    try{
        document.querySelector('.record').remove();
    }catch(e){
        //do nothing;
    }

    //reset particle
    let list = document.querySelectorAll(".particle");
    for(let item of list){
        item.remove();
    }
    numParticle = 0; //remove the amount of particle
})


//------shrinking when the emoji is clicked

function shrink(){
    if(currentSize>200){
        currentSize-= 0.75;
        emoji.style.fontSize = currentSize.toString() + "px";
        requestAnimationFrame(shrink);
    }else if(!explode){
        //if it shrinks below 200, reset to 200, stop animation
        emoji.style.fontSize = "200px";
        currentSize = 200;
        shrinking = false;
        stop();
        reset();
    }
}

//----------set new emoji 
function setEmoji(newEmoji){
    emoji.innerText = newEmoji;
}

//--------------particle logic

function particleGenerator(x,animation){
    let newParticle = document.createElement('div');
    newParticle.classList.add('particle');
    newParticle.classList.add(animation);

    //set random x location for new particle
    if(animation == "fall"){
        newParticle.style.setProperty('--initial-x', `${x}vw`);
    }
    //set x trajectory of particle
    newParticle.style.setProperty('--translate-x', `${Math.floor(Math.random()*40-20)}vw`)

    //rotate randomly particle
    newParticle.style.transform = `rotate(${Math.floor(Math.random()*360)}deg)`;

    //content
    newParticle.innerText = emoji.innerText;

    numParticle++;
    container.appendChild(newParticle);
}

function removeParticle(num, type){
    let list = document.querySelectorAll(type);
        for(let i=0;i<num;i++){
            list[i].remove();
        }
        numParticle -= num; //remove the amount of particle
}

// -----------------------------

//Stop watch function
function start(){
    if(!isRunning){
        isRunning = true;
        startTime = Date.now() - elapsedTime; //in case user stop the watch and start again
        stopwatch = setInterval(()=>updateTime(),10); //update display every 10ms
    }
}

function reset(){
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    clearInterval(stopwatch);
    timer.innerText = "00:00:00"
}

function stop(){
    if(isRunning){
        clearInterval(stopwatch);
        isRunning = false;
    }
}

function updateTime(){
    elapsedTime = Date.now()-startTime;
    const second = Math.floor((elapsedTime%60000)/1000); //1s = 1000ms;
    const ms = Math.floor(elapsedTime%1000/10);
    timer.innerText = `${second.toString().padStart(2,"0")}:${ms.toString().padStart(2,"0")}`; 
}


//-----display record
function record(){
    const recordBoard = document.createElement('div');
    recordBoard.classList.add('record');
    recordBoard.innerText = `YOUR RECORD IS ${timer.innerText}`;
    container.appendChild(recordBoard);
}
