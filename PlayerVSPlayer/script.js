/**
    This javascript file deals only with the functionality of the player vs player game.
    Some of its major functions are: selecting a square, updating the array, making the table for each mode,
    calculating the result, declaring the winner, recording the score and resetting the entire game.
**/

//The following 2 variables initalie the players involved in the game.
var player1 = {
    name: "Player 1",
    value: "X",
    score: 0
};
var player2 = {
    name: "Player 2",
    value: "O",
    score: 0
};
//The following are global variables that determine players and properties of the board
var boardWidth;
var currentPlayer;
var boardData;
var drawsScore = 0;

/**
*   This is the constructor for the file. It completely resets and updates all components of the game.
*   This function is also called if the player presses the reset button.
**/
function constructorFunc() {
    deleteRows();
    gameType = document.getElementById('gameChoice').options[document.getElementById('gameChoice').selectedIndex].value;
    if (gameType == 1) {
        boardWidth = 19;
        document.getElementById('gameTable').style.width = '90vw';
        document.getElementById('gameTable').style.height = '60vw';
    } else {
        boardWidth = 3;
        document.getElementById('gameTable').style.width = '25vw';
        document.getElementById('gameTable').style.height = '25vw';
    }
    togglePlayer();
    makeArray();
    makeTable();
    updateScore();
}

/**
    This method makes a 2d array based on whatever the game mode is selected (19x19 or 3x3)
**/
function makeArray() {
    boardData = new Array(boardWidth);
    for (i = 0; i < boardWidth; i++) {
        boardData[i] = new Array(boardWidth);
    }
}

/**
    This method makes a table on the html determines on the size of the game mode (19x19 or 3x3).
    It achieves this through for loop calls.
**/
function makeTable() {
    var table = document.getElementById('gameTable');
    for (j = boardWidth - 1; j >= 0; j--) {
        var tr = document.createElement('tr');
        var tableString = "";
        for (i = 0; i < boardWidth; i++) {
            var id = j + ',' + i;
            tableString += '<td class="cells" id="td=' + id + '" x="' + j + '" y="' + i + '" onclick="select(this);"></td>';
        }
        tr.innerHTML = tableString;
        table.appendChild(tr);
    }
}

/**
    This method is called when a player selects an empty square on a baord. The primarly goal of this method is to update the board and table to include the next character selected. But it also makes calls to check if the player has won and either updates the score or changes the player.
**/
function select(ele) {
    document.querySelector(".scoreCard").style.display = "none";
    if (ele.innerText == 'X' || ele.innerText == 'O') {} else {
        document.getElementById(ele.id).innerHTML = currentPlayer.value; //Add current player value to element
        if (currentPlayer.value == 'X') {
            document.getElementById(ele.id).style.color = '#8dd14d'; //Was #ee5a3b
        } else if (currentPlayer.value == 'O') {
            document.getElementById(ele.id).style.color = '#f3823d';
        }
        ele.getAttribute("onclick")
        updateArray(ele.getAttribute("x"), ele.getAttribute("y"), currentPlayer.value);
        document.getElementById(ele.id).disabled = 'true';
        checkWin();
        updateScore();
        togglePlayer();
    }
}

/**
    This method is used to update a value in the array. It takes in the coordinates of the element and adds that's value to the array.
**/
function updateArray(x, y, value) {
    boardData[x][y] = value;
}

/**
    This method's purpose is to change the currentPlayer variable to either player 1 or player 2. This method also updates the text element which prompts the players whose turn it is.
**/
function togglePlayer() {
    if (currentPlayer == "undefined") {
        currentPlayer == player1;
    } else if (currentPlayer == player1) {
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }
    document.getElementById("instructions").style.fontWeight = "0";
    document.getElementById("instructions").innerHTML = currentPlayer.name + "(" + currentPlayer.value + "): it's your turn";
}

/**
    This method is used to check whether a player of the game has won or draw. This method in particular, checks the boardsize, therefore determining if the win size is equal to 3 or 5. Then it uses a for loop to iterate through all of the square on the board and checks the horizontal, vertical and diagonal lines to check a win. It also makes a call to the check draw method.
**/
function checkWin() {
    var winSize;
    if (boardWidth == 3) {
        winSize = 3;
    } else {
        winSize = 5;
    }
    for (i = 0; i < boardData.length; i++) {
        for (j = 0; j < boardData.length; j++) {
            checkRowWin(i, j, winSize); //Works for both
            checkColWin(i, j, winSize); //Works for both
            checkRightUpDiaWin(i, j, winSize); //Works for both
            checkLeftUpDiaWin(i, j, winSize); //Works for both
        }
    }
    checkDraw();
}

/**
    This method takes in coordinates, from here these coordinates are used to check the horizontal elements next to it to determine if there are 3 or 5 of the same value in a line, thus winning a game; it then resets the game. Otherwise, it continues to play the game.
**/
function checkRowWin(x, y, ws) {
    var count = 0;
    var i;
    for (i = 0; i <= ws - 1; i++) {
        if (boardData[x][y + i] == currentPlayer.value) {
            count++;
        }
    }
    if (count == ws) {
        declareWinner(currentPlayer.name + ' wins!');
        currentPlayer.score++;
        updateScore();
        resetGame();
    }
}

/**
    This method takes in coordinates, from here these coordinates are used to check the vertical elements below it to determine if there are 3 or 5 of the same value in a line, thus winning a game, it then resets the game. Otherwise, it continues to play the game.
**/
function checkColWin(x, y, ws) {
    var count = 0;
    var i;
    for (i = 0; i <= ws - 1; i++) {
        var a = x + i;
        if (boardWidth <= a) {} else {
            if (boardData[x + i][y] == currentPlayer.value) {
                count++;
            } else {}
        }
    }
    if (count == ws) {
        declareWinner(currentPlayer.name + ' wins!');
        currentPlayer.score++;
        updateScore();
        resetGame();

    }
}

/**
    This method takes in coordinates, from here these coordinates are used to check the diagonal right upwards elements to determine if there are 3 or 5 of the same value in a line, thus winning a game, it then resets the game. Otherwise, it continues to play the game.
**/
function checkRightUpDiaWin(x, y, ws) {
    var count = 0;
    var i;
    for (i = 0; i <= ws - 1; i++) {
        var a = x + i;
        if (boardWidth <= a) {} else {
            if (boardData[x + i][y + i] == currentPlayer.value) {
                count++;
            } else {}
        }
    }
    if (count == ws) {
        declareWinner(currentPlayer.name + ' wins!');
        currentPlayer.score++;
        updateScore();
        resetGame();
    }
}

/**
    This method takes in coordinates, from here these coordinates are used to check the diagonal left upwards elements to determine if there are 3 or 5 of the same value in a line, thus winning a game, it then resets the game. Otherwise, it continues to play the game.
**/
function checkLeftUpDiaWin(x, y, ws) {
    var count = 0;
    var i;
    for (i = 0; i <= ws - 1; i++) {
        var a = x + i;
        if (boardWidth <= a) {} else {
            if (boardData[x + i][y - i] == currentPlayer.value) {
                count++;
            } else {}
        }
    }
    if (count == ws) {
        declareWinner(currentPlayer.name + ' wins!');
        currentPlayer.score++;
        updateScore();
        resetGame();

    }
}

/**
    This method checks the avaiable number of squares in the array. If there are no free squares the draws number is incremented, the scores are updated and a message is shown saying that there is a draw.
**/
function checkDraw() {
    var numOfAvalible = 0;
    for (i = 0; i < boardData.length; i++) {
        for (j = 0; j < boardData.length; j++) {
            if (boardData[i][j] == null) {
                numOfAvalible++;
            }
        }
    }
    if (numOfAvalible == 0) {
        drawsScore++;
        updateScore();
        declareWinner('Tie game!');
    }
}

/**
    This method takes in a parameter which is printed in a stylish square on the website, thus prompting whether a player has won, lost or drawn.
**/
function declareWinner(text) {
    document.querySelector(".scoreCard").style.display = "block";
    document.querySelector(".scoreCard .text").innerText = text;
}

/**
    This method updates an element on the website which indicates to the users what the current scores are of the games played.
**/
function updateScore() {
        document.getElementById("scores").innerHTML = "Scores: " + player1.name + ': ' + player1.score + "  Draws: " + drawsScore + " " + player2.name + ": " + player2.score;
}

/**
    This method deletes the rows of the table; this is neccesary when resetting the game, otherwise more rows will be added to the bottom and the current table will always stay on the website.
**/
function deleteRows() {
    var Parent = document.getElementById("gameTable");
    while (Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }
}

/**
    This method resets all the elements in the array to be empty; thus creating a whole new game.
**/
function resetGame() {
    for (i = 0; i < boardData.length; i++) {
        for (j = 0; j < boardData.length; j++) {
            boardData[i][j] = undefined;
        }
    }
    constructorFunc();
}