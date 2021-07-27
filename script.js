"use strict";

let GameSpeed = 20;
let lastGameSpeed = 0;
let lastRenderTime = 0;
let styleblock = true;
let grid = false;
let mode = "Place";
let select = "Fill";

let blocksList = [];
let inputType = "Ant";

let copyblocksList = [];
const colors = ["white","white","white","white","white","white","black"];

let mouseX = 0;
let mouseY = 0;
let clicks = 0;
let dir = [1,0];

let can = document.getElementById("canvas");
can.width = can.height =6.5*window.innerHeight/10;
let scale_divider = window.prompt("grid size?  (please only enter numnbers)",50);
if (scale_divider === null || scale_divider<0){scale_divider = 50}
scale_divider = parseInt(scale_divider);
let scale = can.width/scale_divider;
let ctx = can.getContext("2d");
ctx.lineWidth = 1;


const selector = {

x1:0,
y1:0,
x2:0,
y2:0


}


const inputTypes = [

    {name:"Ant",
    cantoogle:false,
    x:1,
    y:1,
    content: [1],
    state:1,
    },
    
    {name:"Block",
    cantoogle:false,
    x:1,
    y:1,
    content: [1],
    state:0,
    },

    {name:"Block toggle",
    cantoogle:true,
    x:1,
    y:1,
    content: [1],
    state:0,
    },

    {name:"Block delete ",
    cantoogle:false,
    x:1,
    y:1,
    content: [0],
    state:0,
    },


    {name:"Line",
    cantoogle:false,
    x:3,
    y:1,
    content: [1,1,1],
    state:0,
    },    
]


// piece (ein block)

class block {

    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.state = 0; 
        this.dir = [0,1];
        
    }

    render = function(){  
        ctx.fillStyle= this.color;
        ctx.fillRect(scale*this.x,scale*this.y,scale , scale);
        if (grid){
            ctx.fillStyle= "grey";
            ctx.strokeRect(scale*this.x,scale*this.y,scale , scale);}
    }
    
    updateBlock = function(i){


        if(this.state === 1){
        let checkedcolor; 
        checkedcolor = this.checkNeigBlock(this.dir[0],this.dir[1],i);

        if(checkedcolor !== "edge" && checkedcolor !== "ant" ){
        blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].state = 1;
        this.state = 0;}

        switch(checkedcolor){
            case "black":
                blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].color = "white";
                blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].dir = this.dir;
                blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].rotate(1);
                break;

           case "white":
               blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].color = "black";
               blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].dir = this.dir;
               blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].rotate(0);
               break;



            case "ant":
            case "edge":
                this.rotate(0);
                this.rotate(0);
                blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].dir = this.dir;
                blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].color = "black";
                blocksList[i+this.dir[0]+(this.dir[1]*scale_divider)].state += 1;
                this.state = 0;
                break;
            default:
                break;      


        }
        
        
    
        }

        if(this.state === 2){
            this.color = "grey";
        }
        

    


    }


    checkNeigBlock = function(x,y,i){


        
        if(this.x === scale_divider-1 && x === 1 || this.x === 0 && x === -1 || this.y === 0 && y=== -1 || this.y === scale_divider-1 && y=== 1 ){
            return "edge";
        }else if(copyblocksList[i+x+(y*scale_divider)].state === 1){
            return "ant";
        }else{
            return copyblocksList[i+x+(y*scale_divider)].color ;
        }
        
    }

    rotate = function(dirR){

        if(dirR){
            let y = -this.dir[1];
            let x = this.dir[0];
            this.dir[1] = x;
            this.dir[0] = y;
        }else{
            let y = this.dir[1];
            let x = -this.dir[0];
            this.dir[1] = x;
            this.dir[0] = y;
        }
    
    
    }



}



    
//start game

populateTypes();
creategrid(true);
startGame();

//game start

function startGame(){
window.requestAnimationFrame(main); 
}
    

//create grid

function creategrid(populate){
    for (let length_y = 0; length_y<scale_divider; length_y++ ){
        for (let length_x = 0; length_x<scale_divider; length_x++ ){
            if(populate){
        createblock(length_x,length_y,getrandcolor());}
        else{
            createblock(length_x,length_y,"white");
        }
    
    
    }}

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
ctx.lineWidth = 2;
if(clicks=== 2){ctx.strokeRect(selector.x1*scale,selector.y1*scale,(selector.x2-selector.x1+1)*scale,(selector.y2-selector.y1+1)*scale,)}
ctx.lineWidth = 1;
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


// populateTypes

function populateTypes(){

    inputTypes.forEach((v)=>{
        let typeoption = document.createElement('option');
        typeoption.value = v.name;
        typeoption.text = v.name;
        let parent = document.getElementById('types');
        parent.appendChild(typeoption);

    })



}



//pause game 

function pausegame(){
    render()
    if (GameSpeed != 0){
        document.getElementsByClassName("pause")[0].style.display = "block";
        lastGameSpeed = GameSpeed;
        GameSpeed = 0 ;
    }else{
        GameSpeed = lastGameSpeed;
        document.getElementsByClassName("pause")[0].style.display = "none";}
}

//toggle style

function togglestyle(){
    if (styleblock === true){
        styleblock = false ;
    }else{
        styleblock = true;}

}

// toggle grid

function togglegrid(){
    if (grid === true){
        grid = false ;
    }else{
        grid = true;}

}

// change input type

function changeinput(e){
    inputType = e.value;
}


// change mode

function changemode(e){
mode = e.value;
let inputselect = document.getElementById("inputtype");
let selectselect = document.getElementById("selecttype");
if(e.value === "Place"){
inputselect.style.display = "block";
selectselect.style.display = "none";
}else{
inputselect.style.display = "none";
selectselect.style.display = "block";
}

}


// change select type

function changeselect(e){
select= e.value;


}


// find index with name

function findindex(array,key,value){
    let pos = array.map((e)=>e[key]).indexOf(value);
    return pos;
}


// select fill

function selectfill(color){

    let ydiff = selector.y2-selector.y1+1;
    let xdiff = selector.x2-selector.x1+1;
    for (let iy = 0; iy<ydiff; iy++){
        for (let ix = 0; ix<xdiff; ix++){
            blocksList[ix+(scale_divider*(selector.y1+iy))+selector.x1].color = color;
            
        }}


}

// custom alert

function give_alert(alert_id,text,color,time){
    let alert_text = document.getElementById(alert_id);
    alert_text.innerHTML = text; 
    alert_text.style.color = color;
    alert_text.style.display  = "block";  
    setTimeout( ()=>{alert_text.style.display  = "none";   } ,time) ;
   
}

//input handling und so

addEventListener("keydown", e => {
//    console.log(e.keyCode);
    switch(e.keyCode){
        case 27:
            pausegame();
            break;
                } 
})

onclick = function(e){
    
    let rect = can.getBoundingClientRect();
    mouseX = Math.floor((e.clientX- rect.left) /scale );
    mouseY = Math.floor((e.clientY- rect.top) / scale );
    let i = mouseX + (mouseY*scale_divider);


    if(i>=0 && i< blocksList.length && mouseX< scale_divider ){

        clicks ++;

        if(mode === "Place"){

        let inputTypeindex = findindex(inputTypes,"name",inputType) ;
        let ixy = 0;
        for (let iy = 0; iy<inputTypes[inputTypeindex].y; iy++){
        for (let ix = 0; ix<inputTypes[inputTypeindex].x; ix++){

             if (inputTypes[inputTypeindex].content[ixy]){
                 if (inputTypes[inputTypeindex].state === 1){blocksList[i+(scale_divider*iy)+ix].state = 1 ;}
                if (inputTypes[inputTypeindex].cantoogle){

                    if (blocksList[i].color === "black"){blocksList[i].color = "white";}
                    else{blocksList[i].color = "black";}

                }else{
                    blocksList[i+(scale_divider*iy)+ix].color = "black" ;}
                
             }else{blocksList[i+(scale_divider*iy)+ix].color = "white" ;}
            
            ixy++;
        }}

        
        clicks = 0;
        }


        if(mode === "Select"){
            switch(clicks){
                case 1:
                    selector.x1 = mouseX;
                    selector.y1 = mouseY;
                    break;
                case 2:
                    selector.x2 = mouseX;
                    selector.y2 = mouseY;
                    break;
                case 3:
                    clicks = 0;

                    switch(select){
                        
                        case "Fill":
                            selectfill("black");
                            break;

                        case "Delete":
                            selectfill("white");
                            break;
                        
                        default:
                        console.log("yeayea")    
                        break;


                    }

                    break;
                default:
                    break;
            }

        }

        render();
    }
    
}

