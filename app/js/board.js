// Board funcs
///////////////////////////////////////////////////////////////////////////////

var Board = Board || {};

Board.boardSize = 64;
Board.amountToWin = 4;
Board.board = [];

Board.generateBoard = function(){


	Board.board = [];

	var rowSize = cellSize = Math.sqrt(Board.boardSize);
	var row = [];

	for(var rows = 0; rows < rowSize; rows++) {
		for (var cells = 0; cells < cellSize; cells++) {
			var cell = {
				question: Board.generateAnswer(),
				state: 0,
				player: null
			}
			row.push(cell);
		}
		Board.board.push(row);
		row = [];
	}


};


Board.generateAnswer = function(){
		var lowerNumber = Board.lower;
		var higherNumber = Board.upper;
		var diff = higherNumber - lowerNumber;

		var firstNumber = Math.round( Math.random() * 9) + 1;
		var secondNumber = Math.round(Math.random() * diff) + lowerNumber;

		return {
			firstNumber: firstNumber,
			secondNumber: secondNumber,
			answer: firstNumber * secondNumber
		};
	}