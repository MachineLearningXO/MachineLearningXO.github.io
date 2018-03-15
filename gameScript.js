// SCRIPT FOR THE GAME //
    var player1 = {name:"Player 1", value:"X", score:0};
    var player2 = {name:"Player 2", value:"O", score:0};
    var playerAI = {name:"Computer", value:"O", score:0};
    var boardWidth = 19;
    var playerType;
    var currentPlayer;
    var boardData;
  
    function updateGameType(){
        deleteRows();
        //playerType = document.getElementById('playerChoice').options[document.getElementById('playerChoice').selectedIndex].value;
        gameType = document.getElementById('gameChoice').options[document.getElementById('gameChoice').selectedIndex].value;
        if(playerType == 1){
            currentPlayer = playerAI;
        }
        if(gameType == 1){
            boardWidth = 19;
            document.getElementById('sampleTable').style.width = '90vw';
            document.getElementById('sampleTable').style.height = '60vw';
        }
        else{
            boardWidth = 3;
            document.getElementById('sampleTable').style.width = '25vw';
            document.getElementById('sampleTable').style.height = '25vw';
            //document.getElementsByClassName('cells').style.fontSize = "25px";
        }
        constructorFunc();
    }
    
    function constructorFunc(){
        if(playerType == 1){
            togglePlayerAI();
        }
        else{
            togglePlayer();
        }
        makeArray();
        makeTable();
        updateScore();
    }
    
    function deleteRows(){
        var Parent = document.getElementById("sampleTable");
            while(Parent.hasChildNodes()){
               Parent.removeChild(Parent.firstChild);
            }
    }
    
    function makeArray(){
        boardData = new Array(boardWidth);
        for (i=0; i <boardWidth; i++){
            boardData[i]=new Array(boardWidth);
        }
    }
    
    function makeTable(){
        var xTable=document.getElementById('sampleTable');
        for(j=boardWidth-1; j>=0; j--){
        var tr=document.createElement('tr');
          var tableString = "";
          for(i=0; i<boardWidth; i++){
              var id = j+','+i;
              tableString += '<td class="cells" id="td='+id+'" x="'+j+'" y="'+i+'" onclick="select(this);"></td>';
          }
        tr.innerHTML = tableString;
          xTable.appendChild(tr);
        }
    }
    
    function updateArray(x, y, value){
        boardData[x][y] = value;
    }
    
    function select(ele) {
        if(ele.innerText == 'X'|| ele.innerText == 'O'){
        }
        else{
        document.getElementById(ele.id).innerHTML = currentPlayer.value;        //Add current player value to element
        ele.getAttribute("onclick")
        updateArray(ele.getAttribute("x"), ele.getAttribute("y"), currentPlayer.value);
        document.getElementById(ele.id).disabled = 'true';
        checkWin();
        updateScore();
        if(playerType == 1){
            togglePlayerAI();
        }
        else if(playerType == -1){
            
        }
        else{
            togglePlayer();
        }
        }
  }
        
    function togglePlayer(){
        if(currentPlayer == "undefined"){
            currentPlayer == player1;
        }
        else if(currentPlayer == player1){
            currentPlayer = player2;
        }
        else{
            currentPlayer = player1;
        }
        document.getElementById("instructions").style.fontWeight = "0";
        document.getElementById("instructions").innerHTML= currentPlayer.name+"("+currentPlayer.value+"): it's your turn";
    }
    
    function togglePlayerAI(){
        if(currentPlayer == "undefined"){
            currentPlayer == player1;
        }
        else if(currentPlayer == player1){
            currentPlayer = playerAI;
            selectAI();
        }
        else{
            currentPlayer = player1;
        }
        document.getElementById("instructions").style.fontWeight = "0";
        document.getElementById("instructions").innerHTML= currentPlayer.name+"("+currentPlayer.value+"): it's your turn";
    }
    
    function selectAI(){
        var i = 0;
        var x;
        var y;
        
        while(i == 0){
            var a = Math.floor((Math.random() * boardWidth));
            var b = Math.floor((Math.random() * boardWidth));
            if(boardData[a][b] == undefined){
                x = a;
                y = b;
                i = 1;
            }
            else{
            }
        }
            var id = x+","+y;
            var selectedButton = document.getElementById(id);
            select(selectedButton);
        }
    
    function resetPage(){
        location.reload();
    }
    
    function resetGame(){
        for(i=0; i<boardData.length; i++){
            for(j=0; j<boardData.length; j++){
                boardData[i][j] = undefined;
            }
        }
        updateGameType();
    }


    
    function checkWin(){
        var winSize;
        if(boardWidth == 3){
            winSize = 3;
        }
        else{
            winSize = 5;
        }
        for(i=0; i<boardData.length; i++){
            for(j=0; j<boardData.length; j++){
                checkRowWin(i,j,winSize); //Works for both
                checkColWin(i,j,winSize); //Works for both
                checkRightUpDiaWin(i,j,winSize); //Works for both
                checkLeftUpDiaWin(i,j,winSize); //Works for both
            }
        }
    }
    
    function checkRowWin(x,y,ws){
        var count = 0;
        var i;
        for(i = 0; i <= ws-1; i++){
        if(boardData[x][y+i] == currentPlayer.value){
            count++;
            }
        }
        if(count == ws){
            alert(currentPlayer.name + ' wins!');
            currentPlayer.score++;
            updateScore();
            resetGame();
        }
    }
    
    function checkColWin(x,y,ws){
        var count = 0;
        var i;
        for(i = 0; i <= ws-1; i++){
            var a = x+i;
            if(boardWidth <= a){
                console.log("STOP");
            }
            else{
                if(boardData[x+i][y] == currentPlayer.value){
                    count++;
                }
                else{
                    console.log("FAIL");
                }
            }
        }
        if(count == ws){
            alert(currentPlayer.name + ' wins!');
            currentPlayer.score++;
            updateScore();
            resetGame();
            
        }
    }
    
    function checkRightUpDiaWin(x,y,ws){
        var count = 0;
        var i;
        for(i = 0; i <= ws-1; i++){
            var a = x+i;
            if(boardWidth <= a){
                console.log("STOP");
            }
            else{
                if(boardData[x+i][y+i] == currentPlayer.value){
                    count++;
                }
                else{
                    console.log("FAIL");
                }
            }
        }
        if(count == ws){
            alert(currentPlayer.name + ' wins!');
            currentPlayer.score++;
            updateScore();
            resetGame();
        }
    }
    
    function checkLeftUpDiaWin(x,y,ws){
        var count = 0;
        var i;
        for(i = 0; i <= ws-1; i++){
            var a = x+i;
            if(boardWidth <= a){
                console.log("STOP");
            }
            else{
                if(boardData[x+i][y-i] == currentPlayer.value){
                    count++;
                }
                else{
                    console.log("FAIL");
                }
            }
        }
        if(count == ws){
            alert(currentPlayer.name + ' wins!');
            currentPlayer.score++;
            updateScore();
            resetGame();
            
        }
    }
    
    function updateScore(){
        if(playerType == 1){
            document.getElementById("scores").innerHTML= "Scores: Player 1: " + huPlayer + " Computer: " + aiWins;
        }
        else{
        document.getElementById("scores" ).innerHTML= "Scores: "+ player1.name + ': ' + player1.score + " " + player2.name + ": " + player2.score;
        }
    }