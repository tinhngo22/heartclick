const emoji = document.querySelector(".emoji");
const form = document.querySelector("#input-form");
const container = document.querySelector(".container");
let currentSize = 200;
let shrinking = false;
let explode = false;

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
    }
}


emoji.addEventListener('click',(e)=>{
    currentSize += 10;
    if(currentSize>300){
        emoji.style.fontSize = "0px";
        currentSize = 0;
        explode = true;
        shrinking = false;
        emojiExplode();
    }else if(!explode){
        particleGenerator(0,Math.floor(Math.random()*360),"spit");
        emoji.style.fontSize = currentSize.toString() + "px";
    }

    //prevent activating multiple animation at the same time by shrinking = t/f
    if(!shrinking && currentSize>200 && !explode){
        shrinking = true;
        requestAnimationFrame(shrink);
    }
})


form.addEventListener("submit",(e)=>{
    e.preventDefault();
    setEmoji(e.target[0].value);
    emoji.style.fontSize = "200px";
    currentSize = 200;
    e.target[0].value = '';
})

function setEmoji(newEmoji){
    emoji.innerText = newEmoji;
}

function particleGenerator(x,rotate,animation){

    let newParticle = document.createElement('div');
    newParticle.classList.add('particle');
    newParticle.classList.add(animation);


    newParticle.style.setProperty('--translate-x', `${Math.random()*40-20}vw`)
    //location of the animation
    newParticle.style.transform = `rotate(${rotate}deg) translateX(${x}vh)`;

    //content
    newParticle.innerText = emoji.innerText;

    container.appendChild(newParticle);
}
