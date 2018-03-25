var original;
const huPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
var huWins = 0;
var aiWins = 0;
var tiesNo = 0;

var boardData = document.querySelectorAll('.cell');
constructorFunc();

function constructorFunc() {
	document.querySelector(".scoreCard").style.display = "none";
	original = Array.from(Array(9).keys());
	for (var i = 0; i < boardData.length; i++) {
		boardData[i].innerText = '';
		boardData[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof original[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(original, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	original[squareId] = player;
	document.getElementById(squareId).innerText = player;
    if(player == 'X'){
            document.getElementById(squareId).style.color = '#8dd14d'; //Was #ee5a3b
        }
        else if(player == 'O'){
            document.getElementById(squareId).style.color = '#f3823d';
        }
	let gameWon = checkWin(original, player)
	if (gameWon) gameOver(gameWon)
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

function updateScores(){
        document.getElementById("scores").innerHTML= "Scores: Player: " + huWins + " Draws: " + tiesNo + " Computer: " + aiWins;}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		//document.getElementById(index).style.backgroundColor =
			//gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < boardData.length; i++) {
		boardData[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "Player wins!" : "Computer wins.");
    console.log("Player win- " +gameWon.player);
    if(gameWon.player == 'X'){
        aiWins++;
    }
    else if(gameWon.player = 'O'){
        huWins++;
    }
    updateScores();
}

function declareWinner(who) {
	document.querySelector(".scoreCard").style.display = "block";
	document.querySelector(".scoreCard .text").innerText = who;
}

function emptySquares() {
	return original.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(original, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < boardData.length; i++) {
			//boardData[i].style.backgroundColor = "green";
			boardData[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
        tiesNo++;
        updateScores();
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
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