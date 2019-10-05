var canvas;
var ctx;
var canvasLeft;
var canvasTop;

var boxes;
var boxAmount;
var log;

var clickTempX;
var clickTempY;

function eventSetup(){//setup event Listeners
    
    canvas.addEventListener('contextmenu', event => event.preventDefault());//disable default actions of some events
    document.addEventListener('touchmove', event => event.preventDefault());
    document.addEventListener('scroll', event => event.preventDefault())
    
    document.addEventListener('keydown', //managing arroy key events
        function(evt){
            switch(evt.code){
                case("ArrowLeft"):
                    updateBoard(0);
                    break;
                case("ArrowRight"):
                    updateBoard(1);
                    break;
                case("ArrowUp"):
                    updateBoard(2);
                    break;
                case("ArrowDown"):
                    updateBoard(3);
                    break;
                
            }
        });
    canvas.addEventListener('touchstart', //managing touching events
        function(evt){
            clickTempX = (evt.touches[0].clientX);//store initial touchpoint
            clickTempY = (evt.touches[0].clientY);
        });
    canvas.addEventListener('touchend', 
        function(evt){//click action determines direction with initial touchpoint and last touchpoint
            clickAction(evt.changedTouches[0].clientX,evt.changedTouches[0].clientY);
        });
}
function canvasSetup(){//sets up canvas and canvas variables
    canvas = document.getElementById('canvas');         //setup canvas variables
    canvasLeft = canvas.getBoundingClientRect().left;
    canvasTop = canvas.getBoundingClientRect().top;
    
    log = document.getElementById('log');
    ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'papayawhip';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
function boardSetup(){//create box List which contains all box information, location and value and sets beginning screen
    boxes = new Array(boxAmount);       //define boxes lists that holds square location,by place in list, and value.
    for(var i = 0; i < boxAmount; i++){
        boxes[i] = new Array(boxAmount);
    }
    addBox();           //add three random boxes to start the game
    addBox();
    addBox();
    drawBoard();
}
function clickAction(x,y){//manages click events, determines whether click is right,left,up or down swipe
    
    var changeX = x - clickTempX;
    var changeY = y - clickTempY;
    
    if(Math.abs(changeX)< 20 && Math.abs(changeY)<20){ //if movement on screen is very small, do not create a change.
        return;
    }
    if(Math.abs(changeX) > Math.abs(changeY)){ //check if click will result in horizontal swipe
        if (changeX < 0){
            updateBoard(0); //left
        }else{
            updateBoard(1); //rigt
        }
    }else{                      //vertical swipe
        if(changeY<0){
            updateBoard(2);  //up
        }else{
            updateBoard(3);  //down
        }
    }  
    
}
function updateBoard(dir){//updates board given direction of swipe
    var temp,i,j;
    var change = false;
    var tempList = new Array(boxAmount);

    for(i = 0; i < boxAmount; i++){
        tempList[i] = new Array(boxAmount);
    }

    switch(dir){
        case 0:     //left 
            for(i = 0; i < boxAmount; i++){
                temp = sortRow([boxes[0][i],boxes[1][i],boxes[2][i],boxes[3][i]],false); //sorting algorithm for one row. 
                
                tempList[0][i] = temp[0];      //for left swipe, using rows which are stored in each column list
                tempList[1][i] = temp[1];
                tempList[2][i] = temp[2];
                tempList[3][i] = temp[3];
            }
            break;
        case 1:     //right
            for(i = 0; i < boxAmount; i++){
                temp = sortRow([boxes[0][i],boxes[1][i],boxes[2][i],boxes[3][i]],true);
                
                tempList[0][i] = temp[0];
                tempList[1][i] = temp[1];
                tempList[2][i] = temp[2];
                tempList[3][i] = temp[3];
            }
            break;
        case 2:     //up
            for(i = 0; i < boxAmount; i++){
                
                tempList[i] = sortRow([boxes[i][0],boxes[i][1],boxes[i][2],boxes[i][3]],false);
            }
            break;
        case 3:     //down
           for(i = 0; i < boxAmount; i++){
                
                tempList[i] = sortRow([boxes[i][0],boxes[i][1],boxes[i][2],boxes[i][3]],true);
            }
            break;
    }

    for(i = 0; i < boxAmount; i++){
        for(j = 0; j < boxAmount; j++){
            if(tempList[i][j] != boxes[i][j]){
                change = true;
                boxes = tempList;
                break;
            }
        }
    }
    if(change){
        addBox();
    }   
    
    drawBoard();
}
function drawBoard(){//drawing function. for each box in the list, draw according to specificiations
    ctx.fillStyle = 'papayawhip';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var boxWidth = canvas.width/boxAmount;
    ctx.fillStyle = "khaki";
    
    for(i = 0; i < boxAmount; i++){
        for(j = 0; j < boxAmount; j++){
            if(boxes[i][j]){
                if(boxes[i][j] < 8){
                    ctx.fillStyle = "khaki";
                }else if(boxes[i][j] < 32){
                    ctx.fillStyle = "lightsalmon";
                }else if(boxes[i][j] < 128){
                    ctx.fillStyle = "lightpink";
                }else if(boxes[i][j] < 496){
                    ctx.fillStyle = "lightcoral";
                }else if(boxes[i][j] < 2048 ){
                    ctx.fillStyle = "firebrick";
                }
                ctx.fillRect(i*boxWidth,j*boxWidth,boxWidth-1,boxWidth-2);
            }
        }
    }
    ctx.fillStyle = "black";
    ctx.font = "30px Marker Felt";
    for(i = 0; i < boxAmount; i++){
        for(j = 0; j < boxAmount; j++){
            if(boxes[i][j]){
                ctx.fillText(boxes[i][j].toString(), (i+0.5)*boxWidth,(j+0.5)*boxWidth);
            }
        }
    }
}
function sortRow(rowList, reverse){ //algorithm to sort a specific row from right to left
    var space = 0;
    var join;
    if (reverse){ //used if row needs to be sorted left to right.
        rowList = rowList.reverse();
    }
    
    
    for(var i = 0; i < rowList.length;i++){
        if(rowList[i] === undefined){
            space += 1;
        }else if(join && join == rowList[i]){
                rowList[i-space-1] *= 2;
                rowList[i] = undefined;
                join = undefined;
                space += 1;
                log.innerHTML = parseInt(log.innerHTML) + rowList[i-space];
        }else {
            join = rowList[i];
            if (space){
                rowList[i-space] = rowList[i];
                rowList[i] = undefined;
            }
            
        }
            
    }
    if(reverse){
        return rowList.reverse();
    }else{
        return rowList;
    }
}
function addBox(){//adds a box randomly to an empty spot on the list
    var emptyBoxes = [];
    for(var i = 0; i < boxes.length;i++){       //this loops create a list of all empty locations
        for(var j = 0; j < boxes.length;j++){
            if(boxes[i][j] === undefined){
                emptyBoxes.push([i,j]);
            }
        }
    }               
    
    var value = 2*Math.ceil(Math.random()*1.2); //random value of 2 or 4
    var random = emptyBoxes[Math.floor(Math.random()*emptyBoxes.length)];//chooses random box from empty box list
    boxes[random[0]][random[1]] = value;//adds box
    
}
window.onload = function(){ //this function starts when the browser is fully loaded
    boxAmount = 4;
    canvasSetup();
    eventSetup();
    boardSetup();
};