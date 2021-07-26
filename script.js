"use strict";

let GameSpeed = 10;
let lastGameSpeed = 0;
let lastRenderTime = 0;
let styleblock = true;
let grid = false;
let mode = "Place";
let select = "Fill";

let blocksList = [];
let inputType = "Single cell toggle";

let copyblocksList = [];
const colors = ["white","white","white","white","black"];

let mouseX = 0;
let mouseY = 0;
let clicks = 0;

let can = document.getElementById("canvas");
can.width = can.height =6.5*window.innerHeight/10;
let scale_divider = window.prompt("grid size?  (please only enter numnbers)",50);
if (scale_divider === null || scale_divider<0){scale_divider = 50}
scale_divider = parseInt(scale_divider);
let scale = can.width/scale_divider;
let ctx = can.getContext("2d");
ctx.lineWidth = 1;

class customTypeobject {
    constructor(name,x,y,content = []){
        this.name = name;
        this.cantoogle = false;
        this.x = x;
        this.y = y;
        this.content = content;
    }

}

const selector = {

x1:0,
y1:0,
x2:0,
y2:0


}


const inputTypes = [
    
    {name:"Single cell toggle",
    cantoogle:true,
    x:1,
    y:1,
    content: [1]
    },

    {name:" Single cell",
    cantoogle:false,
    x:1,
    y:1,
    content: [1]
    },

    {name:"Single cell delete ",
    cantoogle:false,
    x:1,
    y:1,
    content: [0]
    },

    {name:"Block",
    cantoogle:false,
    x:2,
    y:2,
    content: [1,1,1,1]
    },

    {name:"Beehive",
    cantoogle:false,
    x:4,
    y:3,
    content: [0,1,1,0,1,0,0,1,0,1,1,0]
    },

    {name:"Blinker",
    cantoogle:false,
    x:3,
    y:1,
    content: [1,1,1]
    },

    {name:"Galaxy",
    cantoogle:false,
    x:9,
    y:9,
    content: [  1,1,1,1,1,1,0,1,1,
                1,1,1,1,1,1,0,1,1,
                0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,
                1,1,0,1,1,1,1,1,1,
                1,1,0,1,1,1,1,1,1,
    ]
    },
    
    
    {name:"Glider",
    cantoogle:false,
    x:3,
    y:3,
    content: [0,1,0,0,0,1,1,1,1]
    },

    {name:"R-pentomino",
    cantoogle:false,
    x:3,
    y:3,
    content: [0,1,1,1,1,0,0,1,0]
    },

    {name:"Lightweight spaceship",
    cantoogle:false,
    x:5,
    y:4,
    content: [  0,1,0,0,1,
                1,0,0,0,0,
                1,0,0,0,1,
                1,1,1,1,0,
    ]
    },
    
    {name:"Middleweight spaceship",
    cantoogle:false,
    x:6,
    y:5,
    content: [  0,0,0,1,0,0,
                0,1,0,0,0,1,
                1,0,0,0,0,0,
                1,0,0,0,0,1,
                1,1,1,1,1,0,
    ]
    },

    {name:"Heavyweight spaceship",
    cantoogle:false,
    x:7,
    y:6,
    content: [  0,0,0,1,1,0,0,
                0,1,0,0,0,0,1,
                1,0,0,0,0,0,0,
                1,0,0,0,0,0,1,
                1,1,1,1,1,1,0,
    ]
    },
    
    {name:"Copperhead",
    cantoogle:false,
    x:6,
    y:13,
    content: [  0,0,1,1,0,0,
                0,1,0,0,1,0,
                0,1,0,0,1,0,
                1,0,0,0,0,1,
                1,0,0,0,0,1,
                0,1,1,1,1,0,
                1,1,0,0,1,1,
                1,0,0,0,0,1,
                1,0,0,0,0,1,
                0,0,0,0,0,0,
                0,0,0,0,0,0,
                0,1,1,1,1,0,
                0,0,1,1,0,0,
    ]
    },

    {name:"Glider gun",
    cantoogle:false,
    x:36,
    y:9,
    content: [  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,

    ]
    },
]


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
        if (grid){
            ctx.fillStyle= "grey";
            ctx.strokeRect(scale*this.x,scale*this.y,scale , scale);}
    }
    
    updateBlock = function(i){
        
        let currentCheck; 
        currentCheck = this.checkallNeig(i,"black");

        switch(currentCheck){

        case 0:
            blocksList[i].color = "white";
            break;
        case 1:
            if(styleblock){blocksList[i].color = "lightgrey";}else{blocksList[i].color = "white"}
            break;
        case 2:
            break;
        case 3:
            blocksList[i].color = "black";
            break;
        case 4:
            if(styleblock){blocksList[i].color = "darkred";break;}
            
        case 5:
        case 6:
        case 7:
        case 8:
            if(styleblock){blocksList[i].color = "grey";}else{blocksList[i].color = "white"}
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

function addnewcustomTypeselect(){

    let typeoption = document.createElement('option');
    typeoption.value = inputTypes[inputTypes.length-1].name;
    typeoption.text = inputTypes[inputTypes.length-1].name;
    typeoption.selected = true;
    let parent = document.getElementById('types');
    parent.appendChild(typeoption);
    changeinput(parent);


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


// add custom type

function addcustomtype(){
let customTinput = document.getElementById("customtype").value;
const customT = customTinput.split(",").map((v,i)=>{if(i !== 0){return parseInt(v);}else{return v}});
const customContent = customT.slice(3,customT.length);
const newCustomType = new customTypeobject(customT[0],customT[1],customT[2],customContent);
inputTypes.push(newCustomType);
addnewcustomTypeselect();
mode = "Place";
let modeelement = document.getElementById("mode");
modeelement.value = "Place";
changemode(modeelement);
}

// copycustom

function copycuston(){
    let customTinput = document.getElementById("customtype");
    customTinput.select();
    customTinput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    give_alert("alert"," ----------------- Your custom type has been copied to your clipboard! -----------------","blanchedalmond",3000);

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
    
    
    var rect = can.getBoundingClientRect();
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
                if (inputTypes[inputTypeindex].cantoogle){
                    if (blocksList[i].color === "black")
                    {blocksList[i].color = "white";}else{blocksList[i].color = "black";}
                }else{
                    blocksList[i+(scale_divider*iy)+ix].color = "black" ;
                }
                
             }else{
                blocksList[i+(scale_divider*iy)+ix].color = "white" ;
             }
            
            ixy++;
         }
        }
        
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
                        case "Copy":
                            render();
                            let copycustom = [];
                            let ydiff = selector.y2-selector.y1+1;
                            let xdiff = selector.x2-selector.x1+1;
                            copycustom.push("placeholder");
                            copycustom.push(xdiff);
                            copycustom.push(ydiff);
                            for (let iy = 0; iy<ydiff; iy++){
                                for (let ix = 0; ix<xdiff; ix++){
                                    if(blocksList[ix+(scale_divider*(selector.y1+iy))+selector.x1].color === "black"){
                                        copycustom.push(1);}else{copycustom.push(0);}
                                    
                                }}
                            console.log(copycustom);
                            document.getElementById("customtype").value = copycustom.toString();

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

