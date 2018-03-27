var boardData;
var currentState;
var player1 = 'X';
var computer = 'O';
var playerWins = 0;
var computerWins = 0;
var drawsScore = 0;
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

function constructorFunc() {
    document.getElementById("scoreCard").style.display = "none";
    boardData = document.querySelectorAll('.cell');
    currentState = Array.from(Array(9).keys());
    for (var i = 0; i < boardData.length; i++) {
        boardData[i].innerText = '';
        boardData[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
        turn(square.target.id, player1);
        if (checkWin(currentState, player1) == null && checkDraw() == false) {
            turn(search(currentState, computer).index, computer);
        }
}

function turn(chosenSquare, player) {
    currentState[chosenSquare] = player;
    document.getElementById(chosenSquare).innerText = player;
    if (player == 'X') {
        document.getElementById(chosenSquare).style.color = '#8dd14d'; //Was #ee5a3b
    } else if (player == 'O') {
        document.getElementById(chosenSquare).style.color = '#f3823d';
    }
    document.getElementById(chosenSquare).removeEventListener('click', turnClick, false);
    let gameWon = checkWin(currentState, player)
    if (gameWon != null) {
            gameOver(gameWon);
        }
}

function search(newBoard, player) {
    var possibleSquares = emptySquares();

    if (checkWin(newBoard, player1)) {
        return {
            score: -10
        }
    } 
    else if (checkWin(newBoard, computer)) {
        return {
            score: 10
        }
    } 
    else if (possibleSquares.length === 0) {
        return {
            score: 0
        }
    }
    var moves = [];
    for (var i = 0; i < possibleSquares.length; i++) {
        var move = {};
        move.index = newBoard[possibleSquares[i]];
        newBoard[possibleSquares[i]] = player;
        if (player == computer) {
            var result = search(newBoard, player1);
            move.score = result.score;
        } else {
            var result = search(newBoard, computer);
            move.score = result.score;
        }

        newBoard[possibleSquares[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === computer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } 
    else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {
                index: index,
                player: player
            };
            break;
        }
    }
    return gameWon;
}

function checkDraw() {
    if (emptySquares().length == 0) {
        promptResult("Tie Game!")
        drawsScore++;
        updateScore();
        return true;
    }
    return false;
}

function promptResult(text) {
    document.getElementById("scoreCard").style.display = "block";
    document.getElementById("prompt").innerText = text;
}

function updateScore() {
    document.getElementById("scores").innerHTML = "Scores: Player: " + playerWins + " Draws: " + drawsScore + " Computer: " + computerWins;
}

function gameOver(gameWon) {
        for (var i = 0; i < boardData.length; i++) {
            boardData[i].removeEventListener('click', turnClick, false);
        }
    if (gameWon.player == 'X') {
        promptResult("Player wins!");
        playerWins++;
    } else if (gameWon.player = 'O') {
        promptResult("Computer wins.")
        computerWins++;
    }
    updateScore();
    setTimeout(constructorFunc, 2000);
    
}

function emptySquares() {
    var emptySquares =[];
    for(i = 0; i < currentState.length; i++){
        if(currentState[i] == 'X' || currentState[i] == 'O'){
            
        }
        else{
            emptySquares.push(currentState[i]);
        }
    }
    return emptySquares;
}