/**
    This javascript file deals only with the functionality of the Player Vs AI game.
    It includes functions to allow a user to place a square, as well as allowing the AI to do the same, as well as calculating who one the game, recording the score and reseting the game.
**/
//The following define the papers involved in the game.
var player1 = 'X';
var computer = 'O';
//The follow how data of the current state of the board.
var boardData;
var currentState;
//The following initalise the players score
var playerWins = 0;
var computerWins = 0;
var drawsScore = 0;
//The following variable stores each way a player can win the game.
var winCombos = [
    //Defines horizontal wins
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //Defines vertical wins
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //Defines diagonal wins
    [0, 4, 8],
    [6, 4, 2]
]

/**
    This constructor is used to reset the game to its original preferences. It is used at the end of the game, the set up and when a player presses the replay button.
**/
function constructorFunc() {
    document.getElementById("scoreCard").style.display = "none";
    boardData = document.querySelectorAll('.cell');
    currentState = Array.from(Array(9).keys());
    for (var i = 0; i < boardData.length; i++) {
        boardData[i].innerText = '';
        boardData[i].addEventListener('click', turnClick, false);
    }
}

/**
    This method is called when a player presses a button on the page. It calls another method and checks to see if a win or draw has been made.
**/
function turnClick(square) {
    turn(square.target.id, player1);
    if (checkWin(currentState, player1) == null && checkDraw() == false) {
        turn(search(currentState, computer).index, computer);
    }
}

/**
    This function selects the chosen square by a specific player. Then depending on a player the colour is turned red or green. Button click is disabled on choosen square and the check win method is called, if won the gameover method is called.
**/
function turn(chosenSquare, currentPlayer) {
    currentState[chosenSquare] = currentPlayer;
    document.getElementById(chosenSquare).innerText = currentPlayer;
    if (currentPlayer == 'X') {
        document.getElementById(chosenSquare).style.color = '#8dd14d'; //Was #ee5a3b
    } else if (currentPlayer == 'O') {
        document.getElementById(chosenSquare).style.color = '#f3823d';
    }
    document.getElementById(chosenSquare).removeEventListener('click', turnClick, false);
    var gameWinner = checkWin(currentState, currentPlayer)
    if (gameWinner != null) {
        gameOver(gameWinner);
    }
}

/**
    This method is the most important for the AI. It calculates the best possible square by making recursive call to this method, thus looking at further stages of the game to determine the best path.
**/
function search(lookAHeadBoard, currentPlayer) {
    var possibleSquares = emptySquares();

    if (checkWin(lookAHeadBoard, player1) != null) {
        return {
            score: -10
        }
    } else if (checkWin(lookAHeadBoard, computer) != null) {
        return {
            score: 10
        }
    } else if (possibleSquares.length == 0) {
        return {
            score: 0
        }
    }
    var moves = [];
    for (var i = 0; i < possibleSquares.length; i++) {
        var move = {};
        move.index = lookAHeadBoard[possibleSquares[i]];
        lookAHeadBoard[possibleSquares[i]] = currentPlayer;
        //Recursive calls to the search method (if statement - determines which players turn it is simulating)
        if (currentPlayer == computer) {
            var result = search(lookAHeadBoard, player1);
            move.score = result.score;
        } else {
            var result = search(lookAHeadBoard, computer);
            move.score = result.score;
        }
        //Determines the new board and adds the moves to the array, moves.
        lookAHeadBoard[possibleSquares[i]] = move.index;
        moves.push(move);
    }

    //If the currentPlayer equals the computer and a move in the moves array is less than the best score, then that best move is assigned to the bestMove.
    var bestMove;
    if (currentPlayer == computer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    //If the currentPlayer equals the player and a move in the moves array is more than the best score, then that best move is assigned to the bestMove.
    else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    //Returns the best possible move for the player at the current stage
    return moves[bestMove];
}

/**
    This checkWin method compares the board against the winCombos which are defined at the beginning of the file. If these match up then the gameWinner variable is assigned the winning player and returns that at the end of the method.
**/
function checkWin(board, currentPlayer) {
    var combos = board.reduce(
        function(arrA, arrB, arrC) {
            if (arrB == currentPlayer) {
                return arrA.concat(arrC);
            } else {
                return arrA;
            }
        }, [])
    var gameWinner = null;
    for (var [index, win] of winCombos.entries()) {
        if (win.every(function(i) {
                return combos.indexOf(i) > -1
            })) {
            gameWinner = {
                index: index,
                currentPlayer: currentPlayer
            };
            break;
        }
    }
    return gameWinner;
}

/**
    This method calls the emptySquares method to see if there are any free squares on the board. If not the tie game is prompted, scores are updated and the game is reset.
**/
function checkDraw() {
    if (emptySquares().length == 0) {
        promptResult("Tie Game!")
        drawsScore++;
        updateScore();
        setTimeout(constructorFunc, 2000);
        return true;
    }
    return false;
}

/**
    This method takes in a parameter which is printed in a stylish square on the website, thus prompting whether a player has won, lost or drawn.
**/
function promptResult(text) {
    document.getElementById("scoreCard").style.display = "block";
    document.getElementById("prompt").innerText = text;
}

/**
    This method updates an element on the website which indicates to the users what the current scores are of the games played.
**/
function updateScore() {
    document.getElementById("scores").innerHTML = "Scores: Player: " + playerWins + " Draws: " + drawsScore + " Computer: " + computerWins;
}

/**
    This method is called when the game is over. It first removes all the action listeners on the board, so the game is no longer playable. Scores are then updated, a prompt is then show on the website and the game is reset.
**/
function gameOver(gameWinner) {
    for (var i = 0; i < boardData.length; i++) {
        boardData[i].removeEventListener('click', turnClick, false);
    }
    if (gameWinner.player == 'X') {
        promptResult("Player wins!");
        playerWins++;
    } else if (gameWinner.player = 'O') {
        promptResult("Computer wins.")
        computerWins++;
    }
    updateScore();
    setTimeout(constructorFunc, 2000);

}

/**
    This method iterates through the current state of the board and assigns the available squares to a new array. This new array is then returned.
**/
function emptySquares() {
    var emptySquares = [];
    for (i = 0; i < currentState.length; i++) {
        if (currentState[i] == 'X' || currentState[i] == 'O') {

        } else {
            emptySquares.push(currentState[i]);
        }
    }
    return emptySquares;
}