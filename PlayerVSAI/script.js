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

var boardData = document.querySelectorAll('.cell');

function constructorFunc() {
	document.querySelector(".scoreCard").style.display = "none";
	currentState = Array.from(Array(9).keys());
	for (var i = 0; i < boardData.length; i++) {
		boardData[i].innerText = '';
		boardData[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof currentState[square.target.id] == 'number') {
		turn(square.target.id, player1)
		if (!checkWin(currentState, player1) && !checkTie()) turn(bestSpot(), computer);
	}
}

function turn(squareId, player) {
	currentState[squareId] = player;
	document.getElementById(squareId).innerText = player;
    if(player == 'X'){
            document.getElementById(squareId).style.color = '#8dd14d'; //Was #ee5a3b
        }
        else if(player == 'O'){
            document.getElementById(squareId).style.color = '#f3823d';
        }
	let gameWon = checkWin(currentState, player)
	if (gameWon) gameOver(gameWon)
}

function bestSpot() {
	return minimax(currentState, computer).index;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, player1)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, player1);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
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
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < boardData.length; i++) {
			boardData[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
        drawsScore++;
        updateScores();
		return true;
	}
	return false;
}

function declareWinner(who) {
	document.querySelector(".scoreCard").style.display = "block";
	document.querySelector(".scoreCard .text").innerText = who;
}

function updateScores(){
        document.getElementById("scores").innerHTML= "Scores: Player: " + playerWins + " Draws: " + drawsScore + " Computer: " + computerWins;}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
	for (var i = 0; i < boardData.length; i++) {
		boardData[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == player1 ? "Player wins!" : "Computer wins.");
}
    if(gameWon.player == 'X'){
        playerWins++;
    }
    else if(gameWon.player = 'O'){
        computerWins++;
    }
    updateScores();
}

function emptySquares() {
	return currentState.filter(s => typeof s == 'number');
}