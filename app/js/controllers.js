'use strict';

/* Controllers */


function MatteCtrl($scope) {

	$scope.inARow = 4;
	$scope.board = [];
	$scope.boardSize = 64;
	$scope.form = {
		lower: 2,
		upper: 10
	};
	$scope.question = {};
	$scope.doneQuestions = 0;

	$scope.whatPlayer = "1";

	$scope.winner = {
		player1: null,
		player2: null
	}

	//convert answer to string
	$scope.getAnswerStr = function(cell) {
		return ""+cell.question.answer;
	}

	//generate model for board, could be empty or with questions
	$scope.generateBoard = function(doEmpty) {

		$scope.board = [];

		var rowSize = Math.sqrt($scope.boardSize);
		var cellSize = rowSize
		var row = [];
		var index = 0;

		for(var rows = 0; rows < rowSize; rows++) {
			for (var cells = 0; cells < cellSize; cells++) {
				var cell = {
					question: (doEmpty ? {answer: "&nbsp;"} : $scope.generateQuestion(index++)),
					state: 0,
					player: null,
				}
				row.push(cell);
			}
			$scope.board.push(row);
			row = [];
		}

	}

	//generate Question
	$scope.generateQuestion = function(index) {
  		var lowerNumber = $scope.form.lower;
		var higherNumber = $scope.form.upper;
		var diff = higherNumber - lowerNumber;

		var firstNumber = Math.round( Math.random() * 9) + 1; // 1 -10
		var secondNumber = Math.round(Math.random() * diff) + lowerNumber;

		return {
			firstNumber: firstNumber,
			secondNumber: secondNumber,
			answer: firstNumber * secondNumber,
			index: index
		};

	}

	//to check if someone has won we create arrays for horizontal, vertical and diagonal rows
	$scope.generateWinnerCheckArray = function() {
		var arr = $scope.getHorizontalCheckArray();
		arr = arr.concat($scope.getVerticalCheckArray());
		arr = arr.concat($scope.getSlashWiseCheckArray());
		arr = arr.concat($scope.getBackSlashWiseCheckArray());
		$scope.checkWinArr = arr;
	}

	//get index positions for each horizontal row
	$scope.getHorizontalCheckArray = function() {
		var tempArr = [];
		var tempChunk = [];
		var row, cell;
		var l = Math.sqrt($scope.boardSize);

		for(row=0; row<l; row++) {
			tempChunk = [];
			for(cell=0; cell<l; cell++) {
		  		tempChunk.push([row, cell]);
		  	}
		  	tempArr.push(tempChunk);
		}
		return tempArr;
	}

	//get index positions for each vertical row
	$scope.getVerticalCheckArray = function() {
		var tempArr = [];
		var tempChunk = [];
		var row, cell;
		var l = Math.sqrt($scope.boardSize);


				//add vertical
		var l = $scope.board.length;
		for(cell=0; cell<l; cell++) {
			tempChunk = [];
			for(row=0; row<l; row++) {
		  		tempChunk.push([row, cell]);
		  	}
		  	tempArr.push(tempChunk);
		}
		return tempArr;
	}

	//get index positions for each diagonal /-wise row, start att top left corner
	$scope.getSlashWiseCheckArray = function() {
		var tempArr = [];
		var tempChunk = [];
		var row, cell;
		var maxIdx = Math.sqrt($scope.boardSize)-1;

		var rowIdx = 0;
		var rowStart = 0;
		var cellIdx = 0;
		var cellStart = 0;

		for(var cell=0; cell<$scope.boardSize; cell++) {
			tempChunk.push([rowIdx, cellIdx])
			cellIdx--;
			rowIdx++;

			if(cellIdx < 0 || rowIdx > maxIdx) { //new diagonal chunk
				if(rowIdx > maxIdx) {
					rowStart++;
					rowIdx = rowStart;
					cellIdx =  maxIdx;
				} else  if(cellIdx < 0) {
					cellStart++;
					cellIdx = cellStart;
					rowIdx = 0;
				}
				if(tempChunk.length >= $scope.inARow) {
					tempArr.push(tempChunk);
				}
				tempChunk = [];
			}
		}	
		return tempArr;	
	}

	//get index positions for each diagonal \-wise row, start att top left corner
	$scope.getBackSlashWiseCheckArray = function() {
		var tempArr = [];
		var tempChunk = [];
		var row, cell;
		var maxIdx = Math.sqrt($scope.boardSize)-1;


		var rowIdx = maxIdx;
		var rowStart = maxIdx;
		var cellIdx = 0;
		var cellStart = 0;

		for(var cell=0; cell<$scope.boardSize; cell++) {
			tempChunk.push([rowIdx, cellIdx])

			cellIdx--;
			rowIdx--;

			if(cellIdx < 0 || rowIdx < 0) { //new diagonal chunk
				if(rowIdx < 0) {
					rowStart--;
					rowIdx = rowStart;
					cellIdx =  maxIdx;
				} else  if(cellIdx < 0) {
					cellStart++;
					cellIdx = cellStart;
					rowIdx = maxIdx;
				}
				if(tempChunk.length >= $scope.inARow) {
					tempArr.push(tempChunk);
				}
				tempChunk = [];
			}
		}
		return tempArr;
	}


	//change to the next player
	$scope.nextPlayer = function () {
		if ($scope.whatPlayer === "1") {
			$scope.whatPlayer = "2";
		} else {
			$scope.whatPlayer = "1";
		}
	}


	//display a new question
	$scope.displayQuestion = function(q) {  
	  $scope.question.firstNumber = "" + q.firstNumber;
	  $scope.question.secondNumber = "" + q.secondNumber;
	}


	//Get a question that has not been used before
	$scope.getQuestion = function () {
		var question, cell;
		var haveQuestion = false;

		if($scope.doneQuestions >= $scope.boardSize) {
			return;
		}
		while (!haveQuestion) {
			cell = $scope.pickRandomCell();
			if(cell) {
				haveQuestion = true;
			}
		}

		return cell.question;
	}


	// Pick a random cell
	$scope.pickRandomCell = function () {
		var rows = $scope.board.length -1; //0-based
		var rowIdx = Math.round(Math.random() * rows);
		var row = $scope.board[rowIdx];
		var cells = row.length-1; //0-based
		var cellIdx =  Math.round(Math.random() * cells);
		var cell = row[cellIdx];

		if (cell.done) {
			return false;
		} else {
			cell.done = true;
			$scope.doneQuestions++;
			return cell;
		}

	}

	//receive cell click event
	$scope.clickCell = function(cell) {
		var isCorrect = $scope.checkAnswer(cell);

		if (isCorrect) {
			cell.player = "player" + $scope.whatPlayer;

			if ($scope.checkWin()) {
				$scope.displayWinner();
			} else {
				$scope.nextPlayer();
				$scope.displayQuestion($scope.getQuestion());
			}

		}
	}

	//check if someone won the game
	$scope.checkWin = function() {
		var lastPlayer, chunk, rowIdx, cellIdx, cell;
		var inARow = 0;

		//loop over each chunk in checkWinArr
		for (var x=0, l=$scope.checkWinArr.length; x<l; x++) {
			chunk = $scope.checkWinArr[x];
			for (var y=0, yl=chunk.length; y<yl; y++) {
				rowIdx = chunk[y][0];
				cellIdx = chunk[y][1];

				cell = $scope.board[rowIdx][cellIdx];
				
				if(cell.player !== lastPlayer) { //reset 
					inARow = (cell.player !== null) ? 1 : 0;
				}

				if(cell.player !== null && cell.player === lastPlayer){
					inARow++;
				}

				lastPlayer = cell.player

				/*				
				if(x===0){
					console.log(rowIdx,cellIdx, cell.player, inARow);
				}
				*/
				if(inARow >= $scope.inARow) {
					return true;
				}
			}
		} 
		return false;
	}

	//
	$scope.displayWinner = function() {
		//display the winning player
		$scope.gameWon = "won";
		if($scope.whatPlayer === "1") {
			$scope.winner.player1 = "won";
			$scope.winner.player2 = null;
		} else {
			$scope.winner.player1 = null;
			$scope.winner.player2 = "won";

		}
	}


	//Check if answer is correct
	$scope.checkAnswer = function(cell) {
		var q = cell.question;
		var cellAnswer = cell.question.firstNumber * cell.question.secondNumber;
		var displayedQuestionAnswer = $scope.question.firstNumber * $scope.question.secondNumber;
		return (cellAnswer  === displayedQuestionAnswer) ;
	}


	//Init a new game
	$scope.initGame = function() {
		$scope.gameWon = false;
		$scope.generateBoard();	  
		$scope.displayQuestion($scope.getQuestion());
		$scope.generateWinnerCheckArray();
	}

	//init empty board at start
	$scope.generateBoard(true);

}

MatteCtrl.$inject = ['$scope'];
