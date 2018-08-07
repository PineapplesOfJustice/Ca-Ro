var namespace = "http://www.w3.org/2000/svg";

var player = ["Game Undefined",
              {name: "Player 1", score: 0, symbol: "Images/Symbol/X.png",},
              {name: "Player 2", score: 0, symbol: "Images/Symbol/O.png",},];
var playerTurn = "player1";
var gameTurn = 0;

var symbol = [];
var symbolId;

var symbolOptions = [undefined,
                 "X.png",
                 "O.png",
                 "Pineapple.png",
                 "Pokeball.png",
                 "Yoshi Egg.png",
                 "Bomb.png",
                 "Heart Container.png",
                 "Pikachu.png",
                 "Master Sword.png",
                 "Penguin.png",
                 "Earth.png",
                 "Okami Blossom.png",
                 "T-rex.png",
                 "Celia.png",
                 "Donkey Kong.png",
                 "Kirby.png",
                 "Link.png",
                 "Mario.png",
                 "Luigi.png",];

// box = (2box - 1)
var boxX = 20; // Actually 39
var boxY = 20; // Actually 39
var boxSize = 5;

var curPosX = 0;
var curPosY = 0;

var gameMode = "Basic";

function changeGameMode(subject){
  document.getElementById("BasicButton").setAttribute("style", "display: inline;");
  document.getElementById("Tetris-StyleButton").setAttribute("style", "display: inline;");  
  document.getElementById(subject + "Button").setAttribute("style", "display: none;");
  gameMode = subject;  
}

function startGame(){  
  document.getElementById("game").setAttribute("style", "display: inline;");
  document.getElementById("game").setAttribute("style", "background-image: url('Images/Background/White Background.jpg');");
  document.getElementById("canvas").addEventListener('mouseleave', hoverEffects);
  //document.getElementById("openingBox").setAttribute("style", "display: none;"); 
  if(Number(document.getElementById("name1").value) != 0){player[1].name = document.getElementById("name1").value;}
  if(Number(document.getElementById("name1").value) != 0){player[2].name = document.getElementById("name2").value;}
  document.getElementById("player1Name").value = player[1].name; 
  document.getElementById("score1").innerHTML = "Score: " + player[1].score; 
  document.getElementById("symbol1").setAttribute("src", player[1].symbol);
  document.getElementById("player2Name").value = player[2].name; 
  document.getElementById("score2").innerHTML = "Score: " + player[2].score;  
  document.getElementById("symbol2").setAttribute("src", player[2].symbol);
  boxX = Math.abs(Number(document.getElementById("rowBox").value))/2;
  if(boxX == 0){boxX = 20}
  else if(boxX > 20){boxX = 20}  
  boxY = Math.abs(Number(document.getElementById("colBox").value))/2;   
  if(boxY == 0){boxY = 20}  
  else if(boxY > 20){boxY = 20}
    
  scrollViewBox(); // Call the function that move the Canvas's viewBox.
  for(var x=Math.ceil(-1*boxX); x<=Math.ceil(boxX); x++){
    makeLine((x*boxSize), (Math.ceil(-1*boxY)*boxSize), (x*boxSize), (Math.ceil(boxY)*boxSize), "black", 1, 1);
  }

  for(var y=Math.ceil(-1*boxY); y<=Math.ceil(boxY); y++){
    makeLine((Math.ceil(-1*boxX)*boxSize), (y*boxSize), (Math.ceil(boxX)*boxSize), (y*boxSize), "black", 1, 1);  
  }

  for(var x=Math.ceil(-1*boxX); x<Math.ceil(boxX); x++){
    for(var y=Math.ceil(-1*boxY); y<Math.ceil(boxY); y++){
      var box = makeRect((x*boxSize), (y*boxSize), boxSize, boxSize, "white", 0);
      box.setAttribute("id", "box" + x + "_" + y);  
      box.addEventListener('mouseenter', hoverEffects);  
      box.classList = "neutral";  
    }
  }
  document.getElementById("openingBox").remove();    
  displaySymbols("Square", 1);    
  displaySymbols("Square", 2); 
  if(!localStorage.caro){ 
    localStorage.caro = true;  
    displayTutorialAgain();  
  }
  //document.body.innerHTML += "<script data-brackets-id='71' src='javascript v.1.1/" + gameMode + ".js'></script>";  
}

var mouseX = 0;
var mouseY = 0;
var hoverOpacity = 0.3;
var hoverSymbol = makeImage(player[playerTurn.replace("player", "")].symbol, (Math.floor(mouseX/boxSize)*boxSize), (Math.floor(mouseY/boxSize)*boxSize), boxSize, boxSize, 1);

function hoverEffects(event){
  var pt = canvas.createSVGPoint()
  pt.x = event.clientX;
  pt.y = event.clientY;
  var svgPt = pt.matrixTransform(canvas.getScreenCTM().inverse());
  mouseX = svgPt.x;
  mouseY = svgPt.y;
  //console.log("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize));
  if(hoverSymbol){hoverSymbol.remove();}  
  if(document.getElementById("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize))){  
    if(document.getElementById("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize)).classList.contains("neutral")){
      hoverSymbol = makeImage(player[playerTurn.replace("player", "")].symbol, (Math.floor(mouseX/boxSize)*boxSize), (Math.floor(mouseY/boxSize)*boxSize), boxSize, boxSize, hoverOpacity);
      //hoverSymbol.setAttribute("x", (Math.floor(mouseX/boxSize)*boxSize));
      //hoverSymbol.setAttribute("y", (Math.floor(mouseY/boxSize)*boxSize));
    }
  }
}
/*
document.getElementById("canvas").addEventListener('mouseenter', displayHover);
function displayHover(event){
  hoverSymbol.setAttribute("style", "display: inline;");  
}

document.getElementById("canvas").addEventListener('mouseleave', hideHover);
function hideHover(event){
  hoverSymbol.setAttribute("style", "display: none;"); 
}
*/

//This is to Display Symbol

document.getElementById("canvas").addEventListener('click', addSymbol);
function addSymbol(event){
  var pt = canvas.createSVGPoint()
  pt.x = event.clientX;
  pt.y = event.clientY;
  var svgPt = pt.matrixTransform(canvas.getScreenCTM().inverse());
  mouseX = svgPt.x;
  mouseY = svgPt.y;
    
  console.log("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize));  
  //console.log(document.getElementById("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize)).classList);  
    
  if(document.getElementById("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize)).classList.contains("neutral")){  
    if(playerTurn == "player1"){
      symbol[symbol.length] = makeImage(player[1].symbol, (Math.floor(mouseX/boxSize)*boxSize), (Math.floor(mouseY/boxSize)*boxSize), boxSize, boxSize, 1);  
      symbol[symbol.length-1].setAttribute("id", "symbol" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize));  
      document.getElementById("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize)).classList = playerTurn;
      symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects);
      //hoversymbol[symbol.length-1].setAttribute("xlink:href", player[2].symbol);
      hoverSymbol.remove();  
      symbol[symbol.length-1] = "symbol" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize) + "&&1";
      checkForWinner("player1", (Math.floor(mouseX/boxSize)), (Math.floor(mouseY/boxSize)));  
      playerTurn = "player2"; 
    }
    else if(playerTurn == "player2"){ 
      symbol[symbol.length] = makeImage(player[2].symbol, (Math.floor(mouseX/boxSize)*boxSize), (Math.floor(mouseY/boxSize)*boxSize), boxSize, boxSize, 1);  
      symbol[symbol.length-1].setAttribute("id", "symbol" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize));  
      //console.log(cursymbol[symbol.length-1].id);  
      document.getElementById("box" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize)).classList = playerTurn;
      symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects); 
      //hoversymbol[symbol.length-1].setAttribute("xlink:href", player[1].symbol);
      hoverSymbol.remove();
      symbol[symbol.length-1] = "symbol" + Math.floor(mouseX/boxSize) + "_" + Math.floor(mouseY/boxSize) + "&&2";
      checkForWinner("player2", (Math.floor(mouseX/boxSize)), (Math.floor(mouseY/boxSize))); 
      playerTurn = "player1"; 
    }  
    gameTurn += 1;
    document.getElementById("turnSpace").innerHTML = "Turn: " + gameTurn;  
  }
}

var line = [];
var inARow = 0;
var inARowRecord = 0;
var over5 = false;
var rect1, rect2;
function checkForWinner(subject, x, y){
  inARowRecord = 0;  
  inARow = 0; 
  over5 = false;  
  // Check For Horizontal  
  for(var rectX=-4; rectX<=4; rectX++){
    //console.log("symbol" + (x+rectX) + "_" + y);  
    if(!document.getElementById("box" + (x+rectX) + "_" + y)){
      inARow = 0;  
    }  
    else if(document.getElementById("box" + (x+rectX) + "_" + y).classList != subject){  
      inARow = 0;  
      //console.log(document.getElementById("box" + (x+rectX) + "_" + y).classList);  
    }
    else{
      inARow += 1;
      //console.log(document.getElementById("box" + (x+rectX) + "_" + y).classList);  
      //console.log(inARow);  
      if(inARow == 1 && over5 == false){
        rect1 = document.getElementById("symbol" + (x+rectX) + "_" + y);  
      }
      if(inARow >= 5){
        inARowRecord = inARow;  
        over5 = true;  
        rect2 = document.getElementById("symbol" + (x+rectX) + "_" + y); 
      }
    }
  }
  if(over5 == true){
    symbol[symbol.length-1] += "*";   
    displayLine("horizontal");  
  }
    
  inARow = 0; 
  over5 = false;  
  // Check For Vertical  
  for(var rectY=-4; rectY<=4; rectY++){
    //console.log("symbol" + (x) + "_" + (y+rectY));  
    if(!document.getElementById("box" + x + "_" + (y+rectY))){
      inARow = 0;  
    }  
    else if(document.getElementById("box" + x + "_" + (y+rectY)).classList != subject){  
      inARow = 0;    
    }
    else{
      inARow += 1; 
      //console.log(inARow);  
      if(inARow == 1 && over5 == false){
        rect1 = document.getElementById("symbol" + x + "_" + (y+rectY));  
      }
      if(inARow >= 5){
        inARowRecord = inARow;
        over5 = true;  
        rect2 = document.getElementById("symbol" + x + "_" + (y+rectY)); 
      }
    }
  }
  if(over5 == true){
    symbol[symbol.length-1] += "*";   
    displayLine("vertical");  
  }  
    
  inARow = 0; 
  over5 = false;  
  // Check For Diagonal 1  
  for(var rectD=-4; rectD<=4; rectD++){ 
    if(!document.getElementById("box" + (x+rectD) + "_" + (y+rectD))){
      inARow = 0;  
    }  
    else if(document.getElementById("box" + (x+rectD) + "_" + (y+rectD)).classList != subject){  
      inARow = 0;    
    }
    else{
      inARow += 1; 
      //console.log(inARow);  
      if(inARow == 1 && over5 == false){
        rect1 = document.getElementById("symbol" + (x+rectD) + "_" + (y+rectD));  
      }
      if(inARow >= 5){
        inARowRecord = inARow;
        over5 = true;  
        rect2 = document.getElementById("symbol" + (x+rectD) + "_" + (y+rectD)); 
      }
    }
  }
  if(over5 == true){
    symbol[symbol.length-1] += "*";   
    displayLine("diagonal1");  
  }  
    
  inARow = 0; 
  over5 = false;  
  // Check For Diagonal 2  
  for(var rectD=-4; rectD<=4; rectD++){ 
    //console.log("box" + (x+rectD) + "_" + (y+(-1*rectD)));  
    if(!document.getElementById("box" + (x+rectD) + "_" + (y+(-1*rectD)))){
      inARow = 0;  
    }  
    else if(document.getElementById("box" + (x+rectD) + "_" + (y+(-1*rectD))).classList != subject){  
      inARow = 0;    
    }
    else{
      inARow += 1; 
      //console.log(inARow);  
      if(inARow == 1 && over5 == false){
        rect1 = document.getElementById("symbol" + (x+rectD) + "_" + (y+(-1*rectD)));  
      }
      if(inARow >= 5){
        inARowRecord = inARow;
        over5 = true;  
        rect2 = document.getElementById("symbol" + (x+rectD) + "_" + (y+(-1*rectD))); 
      }
    }
  }
  if(over5 == true){
    symbol[symbol.length-1] += "*";   
    displayLine("diagonal2");  
  }  
  if(gameMode == "Tetris-Style" && inARowRecord >= 5){  
    setTimeout(function(){tetrisTime()}, 200);  
  }
}

function displayLine(subject, subject2){
  rect1X = Number(rect1.getAttribute("x"));
  rect1Y = Number(rect1.getAttribute("y"));
  rect2X = Number(rect2.getAttribute("x"));
  rect2Y = Number(rect2.getAttribute("y"));
  if(subject == "horizontal"){  
    line[line.length] = {line: makeLine(rect1X, rect1Y+(0.5*boxSize), rect2X+boxSize, rect2Y+(0.5*boxSize), "black", 1, 1),};
    line[line.length] = {line: makeLine(rect1X, rect1Y+(0.5*boxSize), rect2X+boxSize, rect2Y+(0.5*boxSize), "beige", 0.7, 1),};
    /*line[line.length] = makeRect(rect1X, rect1Y+(0.5*boxSize), (rect2X+boxSize-rect1X), rect2Y+(0.5*boxSize)-(rect1Y+(0.5*boxSize)), "beige", 1);
    line[line.length-1].setAttribute("stroke", "black");
    line[line.length-1].setAttribute("stroke-width", "1");*/
  }
  else if(subject == "vertical"){  
    line[line.length] = {line: makeLine(rect1X+(0.5*boxSize), rect1Y, rect2X+(0.5*boxSize), rect2Y+boxSize, "black", 1, 1),};
    line[line.length] = {line: makeLine(rect1X+(0.5*boxSize), rect1Y, rect2X+(0.5*boxSize), rect2Y+boxSize, "beige", 0.7, 1),};  
  }
  else if(subject == "diagonal1"){  
    line[line.length] = {line: makeLine(rect1X, rect1Y, rect2X+boxSize, rect2Y+boxSize, "black", 1, 1),};
    line[line.length] = {line: makeLine(rect1X, rect1Y, rect2X+boxSize, rect2Y+boxSize, "beige", 0.7, 1),};
  }
  else if(subject == "diagonal2"){  
    line[line.length] = {line: makeLine(rect1X, rect1Y+boxSize, rect2X+boxSize, rect2Y, "black", 1, 1),};
    line[line.length] = {line: makeLine(rect1X, rect1Y+boxSize, rect2X+boxSize, rect2Y, "beige", 0.7, 1),};  
  }
  line[line.length-2].direction = subject;
  line[line.length-2].inARow = inARowRecord;
  line[line.length-2].turn = playerTurn;
  player[playerTurn.replace("player", "")].score += 1;
  document.getElementById("score" + playerTurn.replace("player", "")).innerHTML = "Score: " + player[playerTurn.replace("player", "")].score;  
}

function tetrisTime(){
  console.log((symbol[symbol.length-1].split("*").length-1)*2)  
  for(var substract=2, length=(symbol[symbol.length-1].split("*").length-1)*2; substract<=length; substract+=2){ 
    console.log("Time" + substract);  
    line[line.length-substract].line.setAttribute("style", "display: none;");
    line[line.length-substract+1].line.setAttribute("style", "display: none;");
    var lineX = Math.floor(Number(line[line.length-substract].line.getAttribute("x1"))/boxSize);
    var lineY = Math.floor(Number(line[line.length-substract].line.getAttribute("y1"))/boxSize);
    var lineInARow = line[line.length-substract].inARow;
    var lineDirection = line[line.length-substract].direction;
    var lineInARow = line[line.length-substract].inARow;
    var lineTurn = line[line.length-substract].turn;  
    console.log(lineInARow)
  
    symbolId = symbol[symbol.length-1].split("&&");
    symbolId = symbolId[0].replace("symbol", "");     
  
    if(lineDirection == "horizontal"){   
      for(var i=0; i<lineInARow; i++){
        var curId = (lineX+i) + "_" + lineY;  
        if(curId != symbolId){  
          document.getElementById("symbol" + curId).remove();
          document.getElementById("box" + curId).classList = "neutral";
        }
      }  
    }
  
    else if(lineDirection == "vertical"){   
      for(var i=0; i<lineInARow; i++){
        var curId = lineX + "_" + (lineY+i);  
        if(curId != symbolId){   
          document.getElementById("symbol" + curId).remove();
          document.getElementById("box" + curId).classList = "neutral";
        }
      }
    }
    
    else if(lineDirection == "diagonal1"){   
      for(var i=0; i<lineInARow; i++){
        var curId = (lineX+i) + "_" + (lineY+i);  
        if(curId != symbolId){  
          document.getElementById("symbol" + curId).remove();
          document.getElementById("box" + curId).classList = "neutral";
        }
      }
    }
  
    else if(lineDirection == "diagonal2"){   
      for(var i=0; i<lineInARow; i++){  
        //console.log((lineX+i) + "_" + (lineY-i))  
       var curId = (lineX+i) + "_" + (lineY-i-1);  
         if(curId != symbolId){  
          document.getElementById("symbol" + curId).remove();
          document.getElementById("box" + curId).classList = "neutral";
        }
      }  
    }
  }
  document.getElementById("symbol" + symbolId).remove();
  document.getElementById("box" + symbolId).classList = "neutral";
}

// This is to Delete Symbol
function removeSymbol(){
  if(symbol.length > 0){    
    if(playerTurn == "player1"){playerTurn = "player2";}   
    else if(playerTurn == "player2"){playerTurn = "player1";}
    symbolId = symbol[symbol.length-1].split("&&"); 
    if(document.getElementById(symbolId[0])){  
      symbolX = Math.floor(document.getElementById(symbolId[0]).getAttribute("x")/boxSize);
      symbolY = Math.floor(document.getElementById(symbolId[0]).getAttribute("y")/boxSize);
    }
    else{
      var miscellaneous = symbolId[0].split("_");
      symbolX = Number(miscellaneous[0].replace("symbol", ""));  
      symbolY = Number(miscellaneous[1]);  
    }
    console.log(symbolX)
    console.log(symbolY)  
    if(gameMode == "Tetris-Style" && symbol[symbol.length-1].includes("*")){reestablishLine();}  
    checkForLoser(playerTurn, symbolX, symbolY);  
    document.getElementById("box" + symbolX + "_" + symbolY).classList = "neutral";
    //symbol[symbol.length-1].remove();
    console.log(symbolId[0])  
    if(document.getElementById(symbolId[0])){  
      document.getElementById(symbolId[0]).remove();  
    }
    symbol.pop();  
    gameTurn -= 1;
    document.getElementById("turnSpace").innerHTML = "Turn: " + gameTurn;
  }
}

function reestablishLine(){
  for(var substract=2, length=(symbol[symbol.length-1].split("*").length-1)*2; substract<=length; substract+=2){ 
    var lineX = Math.floor(Number(line[line.length-substract].line.getAttribute("x1"))/boxSize);
    var lineY = Math.floor(Number(line[line.length-substract].line.getAttribute("y1"))/boxSize);
    var lineInARow = line[line.length-substract].inARow;
    var lineDirection = line[line.length-substract].direction;
    var lineInARow = line[line.length-substract].inARow;
    var lineTurn = line[line.length-substract].turn;  
    //console.log(lineInARow)
    
    symbolId = symbol[symbol.length-1].split("&&");
    symbolId = symbolId[0].replace("symbol", "");     
      
    if(lineDirection == "horizontal"){   
      for(var i=0; i<lineInARow; i++){
        var curId = (lineX+i) + "_" + lineY;  
        if(curId != symbolId){  
          symbol[symbol.length] = makeImage(player[lineTurn.replace("player", "")].symbol, (lineX+i)*boxSize, lineY*boxSize, boxSize, boxSize, 1);
          symbol[symbol.length-1].setAttribute("id", "symbol" + curId);  
          symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects);
          symbol[symbol.length-1] = "";  
          symbol.pop();
          document.getElementById("box" + curId).classList = lineTurn;
        }
      }
    }
  
    else if(lineDirection == "vertical"){   
      for(var i=0; i<lineInARow; i++){
        var curId = lineX + "_" + (lineY+i);  
        if(curId != symbolId){  
          symbol[symbol.length] = makeImage(player[lineTurn.replace("player", "")].symbol, lineX*boxSize, (lineY+i)*boxSize, boxSize, boxSize, 1);
          symbol[symbol.length-1].setAttribute("id", "symbol" + curId);  
          symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects);    
          symbol[symbol.length-1] = "";  
          symbol.pop();
          document.getElementById("box" + curId).classList = lineTurn;
        }
      }
    }
   
    else if(lineDirection == "diagonal1"){   
      for(var i=0; i<lineInARow; i++){
        var curId = (lineX+i) + "_" + (lineY+i);  
        if(curId != symbolId){  
          symbol[symbol.length] = makeImage(player[lineTurn.replace("player", "")].symbol, (lineX+i)*boxSize, (lineY+i)*boxSize, boxSize, boxSize, 1);
          symbol[symbol.length-1].setAttribute("id", "symbol" + curId);  
          symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects);    
          symbol[symbol.length-1] = "";  
          symbol.pop();
          document.getElementById("box" + curId).classList = lineTurn;
        }
      } 
    }
  
    else if(lineDirection == "diagonal2"){   
      for(var i=0; i<lineInARow; i++){  
        var curId = (lineX+i) + "_" + (lineY-i-1);  
        if(curId != symbolId){  
          symbol[symbol.length] = makeImage(player[lineTurn.replace("player", "")].symbol, (lineX+i)*boxSize, (lineY-i-1)*boxSize, boxSize, boxSize, 1);
          symbol[symbol.length-1].setAttribute("id", "symbol" + curId);  
          symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects);    
          symbol[symbol.length-1] = "";  
          symbol.pop();
          document.getElementById("box" + curId).classList = lineTurn;
        }
      }
    }
  }  
  symbolId = symbol[symbol.length-1].split("&&");
  console.log(symbolId[0])  
  symbol[symbol.length] = makeImage(player[lineTurn.replace("player", "")].symbol, symbolX*boxSize, symbolY*boxSize, boxSize, boxSize, 1);  
  symbol[symbol.length-1].setAttribute("id", symbolId[0]);  
  symbol[symbol.length-1].addEventListener('mouseenter', hoverEffects);      
  symbol[symbol.length-1] = "";
  symbol.pop();
  document.getElementById("box" + symbolId[0].replace("symbol", "")).classList = lineTurn;
}

function checkForLoser(subject, x, y){
  var rectX = ((x+1/2)*boxSize).toFixed(2);
  var rectY = ((y+1/2)*boxSize).toFixed(2);
  var length = line.length-8;  
  if(gameMode == "Tetris-Style"){length = line.length - ((symbol[symbol.length-1].split("*").length-1)*2);}
    
  for(var i=line.length-2; i>=length; i-=2){
    if(i >= 0){  
      var lineX = line[i].line.getAttribute("x2") - line[i].line.getAttribute("x1");
      var lineY = line[i].line.getAttribute("y2") - line[i].line.getAttribute("y1"); 
      //console.log("LineY: " + lineY + "  && RectY: " + rectY); 
      //console.log("LineX: " + lineX + "  && RectX: " + rectX);  
      var distance = (Math.sqrt(Math.pow(lineX, 2) + Math.pow(lineY, 2))/boxSize).toFixed(2);
      //console.log(distance);  
      if(distance == 5 || distance == 7.07){var square = 5;}  
      if(distance == 6 || distance == 8.49){var square = 6;}  
      if(distance == 7 || distance == 9.89){var square = 7;}  
      if(distance == 8 || distance == 11.31){var square = 8;}  
      if(distance == 9 || distance == 12.73){var square = 9;}
      
      for(n=0; n<square; n++){
        if(line[i]){  
          //console.log("LineX = " + (Number(line[i].line.getAttribute("x1")) + (lineX*((1/square/2)+(n/square)))));
          //console.log("LineY = " + (Number(line[i].line.getAttribute("y1")) + (lineY*((1/square/2)+(n/square)))));
          //console.log("RectX = " + rectX);
          //console.log("RectY = " + rectY);
          if(Math.floor(Number(line[i].line.getAttribute("x1")) + (lineX*((1/square/2)+(n/square)))).toFixed(2) == Math.floor(rectX).toFixed(2) &&   Math.floor(Number(line[i].line.getAttribute("y1")) + (lineY*((1/square/2)+(n/square)))).toFixed(2) == Math.floor(rectY).toFixed(2)){
            //if((lineX*1/10) == rectX && (lineY*1/10) == rectY ||{
            line[i].line.remove();  
            line.splice(i, 1);
            line[i].line.remove();  
            line.splice(i, 1);
            player[playerTurn.replace("player", "")].score -= 1;
            document.getElementById("score" + playerTurn.replace("player", "")).innerHTML = "Score: " + player[playerTurn.replace("player", "")].score;
          }
        }
      }
    }
  }
}



// Game Buttons

document.addEventListener('keyup', checkForSpace);
function checkForSpace(event){
  if(event.keyCode == 32){
    restart();  
  }
}

function restart(){
  for(var i=0, length=line.length; i<length; i++){
    line[i].line.remove();  
  }
  for(var x=Math.ceil(-1*boxX); x<Math.ceil(boxX); x++){
    for(var y=Math.ceil(-1*boxY); y<Math.ceil(boxY); y++){
      if(document.getElementById("box" + x + "_" + y).classList != "neutral"){  
        document.getElementById("symbol" + x + "_" + y).remove();
        document.getElementById("box" + x + "_" + y).classList = "neutral";  
      }
    }
  }
  line = [];
  symbol = [];  
  gameTurn = 0;
  document.getElementById("turnSpace").innerHTML = "Turn: 0";
  player[1].score = 0;
  document.getElementById("score1").innerHTML = "Score: 0";  
  player[2].score = 0;  
  document.getElementById("score2").innerHTML = "Score: 0";
  playerTurn = "player1";
}

function displayTutorialAgain(){
  document.getElementById("tutorialSpace").setAttribute("style", "display: inline; top: 50%; left: 50%; transform: (-50%, -50%);");  
  slide = 1;  
  displayNextSlide();
}

function hideTutorialSpace(){
  document.getElementById("tutorialSpace").setAttribute("style", "display: none;");    
}

var slide=1;
function displayNextSlide(){
  if(slide == 1){
    document.getElementById("tutorialText").innerHTML = "<h2><u>Background</u></h2><br><p>&emsp; This game is Caro. A game native to graph papers. The main objective is to be the first to get 5-in-a-row. Very similar to Tic-Tac-Toe, but more open, possiblity-wise. Naturally, it is a 2-players game. I hope you have fun because I did, when I was young.</p><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 
    slide = 2;
  }
  else if(slide ==2){
    if(gameMode == "Tetris-Style"){
      document.getElementById("tutorialText").innerHTML = "<h2><u>Tetris-Style:</u></h2><br><p>&emsp; Tetris-Style is a self-made idea and does not exist normally. This is an experiment to see how gameplay will be affected if winning streaks dispapear to minimize space. Hence, Tetris. The inspiration came from Mr. Van Ackeren at Pasadena High School so you can thank him for this.</p><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>";  
      slide = 3;   
    }  
    else{
      document.getElementById("tutorialText").innerHTML = "<h2><u>Keyboard</u></h2><br><ul><li>W = Move ViewBox Up</li><li>A = Move ViewBox Left</li><li>S = Move ViewBox Down</li><li>D = Move ViewBox Right</li><li>Z = Zoom In</li><li>X = Zoom Out</li><li>Space = Restart</li></ul><h2><u>Mouse</u></h2><br><ul><li>Click = Add/Remove Symbols</li></ul><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 
      slide = 1;
    }  
  }
  else if(slide == 3){
    document.getElementById("tutorialText").innerHTML = "<h2><u>Keyboard</u></h2><br><ul><li>W = Move ViewBox Up</li><li>A = Move ViewBox Left</li><li>S = Move ViewBox Down</li><li>D = Move ViewBox Right</li><li>Z = Zoom In</li><li>X = Zoom Out</li><li>Space = Restart</li></ul><h2><u>Mouse</u></h2><br><ul><li>Click = Add/Remove Symbols</li></ul><button class='nextButton' onclick='displayNextSlide()'>Next: <i class='arrow right'></i></button>"; 
    slide = 1;
  }
}



// Update Input

var focusInput = false;
function updateName(subject){
  if(Number(document.getElementById(subject + "Name").value) != 0){  
    player[subject.replace("player", "")].name = document.getElementById(subject + "Name").value;  
  }
  else{
    player[subject.replace("player", "")].name = subject.replace("player", "Player ");
    document.getElementById(subject + "Name").value = subject.replace("player", "Player ");  
  }
  focusInput = false;  
}

var curSymbol = [undefined, 1, 2,];
function updateSymbol(subject, option){  
  document.getElementById("option" + subject + "_" + curSymbol[subject]).classList = "symbol inactive";    
  player[subject].symbol = document.getElementById("option" + subject + "_" + option + "Image").getAttribute("src");
  document.getElementById("option" + subject + "_" + option).classList = "symbol active" + subject;  
  curSymbol[subject] = option;  
  document.getElementById("symbol" + subject).setAttribute("src", player[subject].symbol);  
}

function eraseInput(subject){
  document.getElementById(subject).value = "";  
  if(subject.includes("Name")){focusInput = true;}  
}




// Display Symbols Selections

displaySymbols("Box", 1);
displaySymbols("Box", 2);
function displaySymbols(subject, option){  
  for(var i=1; i<symbolOptions.length; i++){ 
    if(i == curSymbol[option]){
      document.getElementById("symbol" + subject + option).innerHTML += "<center><div class='symbol active" + option + "' id='option" + option + "_" + i + "' onclick='updateSymbol(" + option + ", " + i + ")'><img id='option" + option + "_" + i + "Image' src='Images/Symbol/" + symbolOptions[i].replace('"', "") + "'></div></center>";  
    }
    else{ 
      document.getElementById("symbol" + subject + option).innerHTML += "<center><div class='symbol inactive' id='option" + option + "_" + i + "' onclick='updateSymbol(" + option + ", " + i + ")'><img id='option" + option + "_" + i + "Image' src='Images/Symbol/" + symbolOptions[i].replace('"', "") + "'></div></center>";  
    }
  }
}

function displaySymbolSpace(){
  document.getElementById("canvasSpace").setAttribute("style", "display: none;");
  document.getElementById("symbolSpace").setAttribute("style", "display: inline;");
  document.getElementById("symbol1Div").setAttribute("onclick", "hideSymbolSpace()");
  document.getElementById("symbol2Div").setAttribute("onclick", "hideSymbolSpace()");  
}

function hideSymbolSpace(){
  document.getElementById("canvasSpace").setAttribute("style", "display: inline;");
  document.getElementById("symbolSpace").setAttribute("style", "display: none;");
  document.getElementById("symbol1Div").setAttribute("onclick", "displaySymbolSpace()");
  document.getElementById("symbol2Div").setAttribute("onclick", "displaySymbolSpace()");  

  for(var x=Math.ceil(-1*boxX); x<Math.ceil(boxX); x++){
    for(var y=Math.ceil(-1*boxY); y<Math.ceil(boxY); y++){  
      var className = document.getElementById("box" + x + "_" + y).classList; 
      if(className == "player1"){  
       document.getElementById("symbol" + x + "_" + y).setAttribute("xlink:href", player[1].symbol);
      }
      else if(className == "player2"){  
       document.getElementById("symbol" + x + "_" + y).setAttribute("xlink:href", player[2].symbol);
      }
    }
  }
    
}




// Call the moveBox function

var keys = [];

var centerX = 0; // Center Point on the Screen
var centerY = 0;

var width = 100; // Size of the Canvas
var height = 50;

var scaleFactor = 1; // Zoom in/out
var scrollingSpeed = 0.6; // Speed of ViewBox

var originX = centerX; // Original Position of Center Point. Read only.
var originY = centerY;

canvas.setAttribute("viewBox", (centerX-(width*scaleFactor/2)) + " " + (centerY-(height*scaleFactor/2)) + " " + (width*scaleFactor) + " " + (height*scaleFactor));

var centerLocatorX = 20;
var centerLocatorY = 10;
var centerLocator = makeImage("Images/Scroll Icon/+.png", centerX-(centerLocatorX*scaleFactor/2), centerY-(centerLocatorY*scaleFactor/2), centerLocatorX*scaleFactor, centerLocatorY*scaleFactor, 1);

document.addEventListener('keyup', keyRelease); // Record which keys are not pressed.
function keyRelease(event){ 
  keys[event.keyCode] = false;
}

document.addEventListener('keydown', keyPress); // Record which keys are pressed.
function keyPress(event){
  keys[event.keyCode] = true;
  //console.log(event.keyCode);  
}

function scrollViewBox(){ 
  if(focusInput == true && keys[13]){
    document.getElementById("player1Name").blur();
    document.getElementById("player2Name").blur();
  }
  else if(focusInput == false){  
    if(keys[65] || keys[37]){    // A Key
      centerX -= scrollingSpeed*scaleFactor;
	}
    else if(keys[68] || keys[39]){    // D Key
      centerX += scrollingSpeed*scaleFactor;
	} 
    if(keys[87] || keys[38]){    // W Key
      centerY -= scrollingSpeed*scaleFactor;
	}
    else if(keys[83] || keys[40]){    // S Key
      centerY += scrollingSpeed*scaleFactor;
	}
    if(keys[90]){    // z Key
	  scaleFactor = scaleFactor / 1.05;
	}
    else if(keys[88]){    // x Key
      scaleFactor = scaleFactor * 1.05;
	}
	
	if(centerX < (-1*boxX*boxSize)){ // Set Boundary
      centerX = (-1*boxX*boxSize);
	}
	else if(centerX > (boxX*boxSize)){
      centerX = (boxX*boxSize);
	}
	if(centerY < (-1*boxY*boxSize)){
      centerY = (-1*boxY*boxSize);
	}
	else if(centerY > (boxY*boxSize)){
      centerY = (boxY*boxSize);
	}
	if(scaleFactor > Math.pow(1.05, 18)){
      scaleFactor = Math.pow(1.05, 18);
	}
	else if(scaleFactor < Math.pow(1.05, -18)){
      scaleFactor = Math.pow(1.05, -18);
	}
    
    if(centerLocator){
      centerLocator.remove();  
    }
    if(keys[65] || keys[37] || keys[68] || keys[39] || keys[87] || keys[38] || keys[83] || keys[40] || keys[90] || keys[88]){
      centerLocator = makeImage("Images/Scroll Icon/+.png", centerX-(centerLocatorX*scaleFactor/2), centerY-(centerLocatorY*scaleFactor/2), centerLocatorX*scaleFactor, centerLocatorY*scaleFactor, 1);
    }
    
	canvas.setAttribute("viewBox", (centerX-(width*scaleFactor/2)) + " " + (centerY-(height*scaleFactor/2)) + " " + (width*scaleFactor) + " " + (height*scaleFactor));
    /*
    centerLocator.setAttribute("x", centerX-(centerLocatorX*scaleFactor/2));
    centerLocator.setAttribute("y", centerY-(centerLocatorY*scaleFactor/2));
    centerLocator.setAttribute("width", (centerLocatorX*scaleFactor));
    centerLocator.setAttribute("height", (centerLocatorY*scaleFactor));
    */
  }
  requestAnimationFrame(scrollViewBox);  // Loop the function.
}


//Used W3School
//Draggable Tutorial

dragElement(document.getElementById("tutorialSpace"));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




// DO NOT EDIT CODE BELOW THIS LINE!
function getX(shape) {
  if (shape.hasAttribute("x")) {
    return parseFloat(shape.getAttribute("x"))
  } else {
    return parseFloat(shape.getAttribute("cx"))
  }  
}

function getY(shape) {
  if (shape.hasAttribute("y")) {
    return parseFloat(shape.getAttribute("y"))
  } else {
    return parseFloat(shape.getAttribute("cy"))
  }   
}

function setX(shape, x) {
  if (shape.hasAttribute("x")) {
    shape.setAttribute("x", x)
  } else {
    shape.setAttribute("cx", x)
  } 
}

function setY(shape, y) {
  if (shape.hasAttribute("y")) {
    shape.setAttribute("y", y)
  } else {
    shape.setAttribute("cy", y)
  } 
}

function move(shape, dx, dy) {
  if (shape.hasAttribute("x") && shape.hasAttribute("y")) {
    var x = parseFloat(shape.getAttribute("x"))
    var y = parseFloat(shape.getAttribute("y"))
    shape.setAttribute("x", x + dx)
    shape.setAttribute("y", y + dy)
  } else {
    var cx = parseFloat(shape.getAttribute("cx"))
    var cy = parseFloat(shape.getAttribute("cy"))
    shape.setAttribute("cx", cx + dx)
    shape.setAttribute("cy", cy + dy)
  }
}

function makeCircle(cx, cy, r, fill, opacity) {
  var circle = document.createElementNS(namespace, "circle")
  circle.setAttribute("cx", cx)
  circle.setAttribute("cy", cy)
  circle.setAttribute("r", r)
  circle.setAttribute("fill", fill)
  circle.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(circle)
  return circle
}

function makeRect(x, y, width, height, fill, opacity) {
  var rect = document.createElementNS(namespace, "rect")
  rect.setAttribute("x", x)
  rect.setAttribute("y", y)
  rect.setAttribute("width", width)
  rect.setAttribute("height", height)
  rect.setAttribute("fill", fill)
  rect.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(rect)
  return rect
}

function makeEllipse(cx, cy, rx, ry, fill, opacity) {
  var ellipse = document.createElementNS(namespace, "ellipse")
  ellipse.setAttribute("cx", cx)
  ellipse.setAttribute("cy", cy)
  ellipse.setAttribute("rx", rx)
  ellipse.setAttribute("ry", ry)
  ellipse.setAttribute("fill", fill)
  ellipse.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(ellipse)
  return ellipse
}

function makeLine(x1, y1, x2, y2, stroke, strokeWidth, opacity) {
  var line = document.createElementNS(namespace, "line")
  line.setAttribute("x1", x1)
  line.setAttribute("y1", y1)
  line.setAttribute("x2", x2)
  line.setAttribute("y2", y2)
  line.setAttribute("stroke", stroke)
  line.setAttribute("stroke-width", strokeWidth)
  line.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(line)
  return line
}

function makePolyline(points, stroke, strokeWidth, opacity) {
  var polyline = document.createElementNS(namespace, "polyline")
  polyline.setAttribute("points", points)
  polyline.setAttribute("stroke", stroke)
  polyline.setAttribute("stroke-width", strokeWidth)
  polyline.setAttribute("opacity", opacity)
  polyline.setAttribute("fill", "none")
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(polyline)
  return polyline
}

function makePolygon(points, fill, opacity) {
  var polygon = document.createElementNS(namespace, "polygon")
  polygon.setAttribute("points", points)
  polygon.setAttribute("opacity", opacity)
  polygon.setAttribute("fill", fill)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(polygon)
  return polygon
}

function makeText(message, x, y, fontSize, fontFamily, fill, opacity) {
  var text = document.createElementNS(namespace, "text")
  text.innerHTML = message
  text.setAttribute("x", x)
  text.setAttribute("y", y)
  text.setAttribute("font-size", fontSize)
  text.setAttribute("font-family", fontFamily)
  text.setAttribute("fill", fill)
  text.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(text)
  return text
}

function makeImage(url, x, y, width, height, opacity) {
  var image = document.createElementNS(namespace, "image")
  image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url)
  image.setAttribute("x", x)
  image.setAttribute("y", y)
  image.setAttribute("width", width)
  image.setAttribute("height", height)
  image.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(image)
  return image
}

function collides(rect1, rect2) {
  var centerX = getX(rect1) + parseFloat(rect1.getAttribute("width"))/2
  var centerY = getY(rect1) + parseFloat(rect1.getAttribute("height"))/2
  return (centerX > getX(rect2) && 
          centerX < getX(rect2) + parseFloat(rect2.getAttribute("width")) &&
         centerY > getY(rect2) &&
         centerY < getY(rect2) + parseFloat(rect2.getAttribute("height")))
}
