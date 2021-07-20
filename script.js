"use strict";


let GameSpeed = 10;
let lastGameSpeed = 0;
let lastRenderTime = 0;

let blocksList = [];

let copyblocksList = [];
const colors = ["white","white","black"];

let can = document.getElementById("canvas");
can.width = can.height =8*window.innerHeight/10;
let scale_divider = 50;
let scale = can.width/scale_divider;
let ctx = can.getContext("2d");
ctx.lineWidth = 1;


// piece (ein block)

class block {


    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.state = 0;
        
    }



    render = function(){  
        ctx.fillStyle= this.color;
        ctx.fillRect(scale*this.x,scale*this.y,scale , scale);
    }
    
    updateBlock = function(i){
        
        let currentCheck; 
        currentCheck = this.checkallNeig(i,"black");

        switch(currentCheck){

        case 0:
            blocksList[i].color = "white";
            break;
        case 1:
            blocksList[i].color = "lightgrey";
            break;
        case 2:
            break;
        case 3:
            blocksList[i].color = "black";
            break;
        case 4:
            blocksList[i].color = "darkred";
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            blocksList[i].color = "grey";
            break;


        }
        
    
    }

    checkNeigBlock = function(x,y,i,searchcolor){


        
        if(this.x === scale_divider-1 && x === 1 || this.x === 0 && x === -1 || this.y === 0 && y=== -1 || this.y === scale_divider-1 && y=== 1 ){
            return false;
        }else{
            if(copyblocksList[i+x+(y*scale_divider)].color === searchcolor){return true;}
        }
        
        return false;
    
    
    }

    checkallNeig = function(i,searchcolor){

        let detectCount = 0;
        
        if( this.checkNeigBlock(1,0,i,searchcolor)){detectCount++}
        if( this.checkNeigBlock(-1,0,i,searchcolor)){detectCount++}
        if( this.checkNeigBlock(0,1,i,searchcolor)){detectCount++}
        if( this.checkNeigBlock(0,-1,i,searchcolor)){detectCount++}
        
        if( this.checkNeigBlock(1,1,i,searchcolor)){detectCount++}
        if( this.checkNeigBlock(-1,1,i,searchcolor)){detectCount++}
        if( this.checkNeigBlock(-1,-1,i,searchcolor)){detectCount++}
        if( this.checkNeigBlock(1,-1,i,searchcolor)){detectCount++}
        

        return detectCount;
        
    }
}



    
//start game
creategrid()
startGame();

//game start

function startGame(){
window.requestAnimationFrame(main); 
}
    

//create grid

function creategrid(){
    for (let length_y = 0; length_y<scale_divider; length_y++ ){
        for (let length_x = 0; length_x<scale_divider; length_x++ ){
        createblock(length_x,length_y,getrandcolor());}}

}


//loop loop
function main(currentTime){
window.requestAnimationFrame(main);
const secondsSinceLastRender = (currentTime- lastRenderTime)/1000
if (secondsSinceLastRender < 1 / GameSpeed) {return}
lastRenderTime = currentTime;  
render();
update();
}



//update
function update(){
    
copyblocksList = [];
copyblocksList = blocksList.map(a => {return {...a}})


for (let i= 0; i<blocksList.length;i++){   
blocksList[i].updateBlock(i);}

}



//render
function render(){

ctx.clearRect(0,0,can.width,can.height)
 
for (let i= 0; i<blocksList.length;i++){   
blocksList[i].render();}

}



// create block

function createblock(x,y,color){

const newblock = new block(x,y,color);
blocksList.push(newblock)

}

// get random color

function getrandcolor(){
    return colors[Math.floor(Math.random()*colors.length)];
}



//pause game 

function pausegame(){

    if (GameSpeed != 0){
        document.getElementsByClassName("pause")[0].style.display = "block";
        console.log("Game has been stopped");
        lastGameSpeed = GameSpeed;
        GameSpeed = 0 ;
    }else{
        console.log("Game has been continued");
        GameSpeed = lastGameSpeed;
        document.getElementsByClassName("pause")[0].style.display = "none";}
}


//input handling und so

addEventListener("keydown", e => {
//    console.log(e.keyCode);
    switch(e.keyCode){
        case 27:
            pausegame();
            break;
        case 82: // r
        blocksList = [];
        creategrid();
            break;
        case 32:
            console.log("1", blocksList);
            update();
            break;
                } 
})
