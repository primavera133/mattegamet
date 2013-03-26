'use strict';

/* Controllers */


function MatteCtrl($scope, $timeout) {

	$scope.inARow = 4;
	$scope.board = [];
	$scope.boardSize = 64;
	$scope.form = {
		tables : {
			"1": true,
			"2": true,
			"3": true,
			"4": true,
			"5": true,
			"6": true,
			"7": true,
			"8": true,
			"9": true,
			"10": true
		}
	};
	$scope.question = {};
	$scope.pickedQuestions = 0;
	$scope.game = {
		beforeStartedClass: "",
		startedClass : "hidden",
	}

	$scope.whatPlayer = "1";
	$scope.whatPlayerClass = "one";

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

		var table,
			tableSelected = false,
			firstNumber, secondNumber;

		while(tableSelected === false) {
			table = Math.round( Math.random() * 9) + 1
			tableSelected = $scope.form.tables[table];
		}
		 
		firstNumber = Math.round( Math.random() * 9) + 1; // 1 -10
		secondNumber = table;

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
			$scope.whatPlayerClass = "two";
		} else {
			$scope.whatPlayer = "1";
			$scope.whatPlayerClass = "one";
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

		if($scope.pickedQuestions >= $scope.boardSize) {
			return;
		}
		while (!haveQuestion) {
			cell = $scope.pickRandomCell();
			if(!cell.picked) {
				cell.picked = true;
				$scope.pickedQuestions++;
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

		return cell;

	}

	// Set cell to player
	$scope.setCorrectCell = function(cell) {
		cell.player = "player" + $scope.whatPlayer;

		if ($scope.checkWin()) {
			$scope.displayWinner();
		} else {
			$scope.nextPlayer();
			$scope.displayQuestion($scope.getQuestion());
			if($scope.game.type === 2 && $scope.whatPlayer === "2") {
				$scope.makeMovePromise = $timeout(function() {
	  				$scope.makeMove(2);
				}, 2000);
			}
		}
	}

	//receive cell click event
	$scope.clickCell = function(cell) {
		if($scope.game.type === 2 && $scope.whatPlayer === "2") {
			console.log("click cell return");
			return;
		}

		var isCorrect = $scope.checkAnswer(cell);

		if (isCorrect) {
			$scope.setCorrectCell(cell);
		}
	}

	//make computer generated move
	$scope.makeMove = function(player) {
		/*
		if(parseInt($scope.whatPlayer, 10) !== player) {
			return;
		}
		*/

		var correctAnswer = false;
		var cell;

  		while (!correctAnswer) {
			cell = $scope.pickRandomCell();

			if($scope.checkAnswer(cell) && cell.player === null) {
				correctAnswer = true;
			}
		}

		$scope.setCorrectCell(cell);
		return cell;
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
	$scope.initGame = function(gameType) {
		$scope.gameWon = false;
		$scope.generateBoard();	
		$scope.generateWinnerCheckArray();

		$scope.game.type = gameType;

		$scope.game.beforeStartedClass = "hidden";
		$scope.game.startedClass = "";

		$scope.displayQuestion($scope.getQuestion());
	}

	//Reset a game
	$scope.resetGame = function() {
		var doReset = false;

		if($scope.gameWon){
			doReset = true;
		} else {
			if(confirm("Vill du avsluta spelet?")) {
				doReset = true;
			}	
		}

		if(doReset) {
			$scope.generateBoard(true);
			$scope.game.beforeStartedClass = "";
			$scope.game.startedClass = "hidden";
		}
	}

	//init empty board at start
	$scope.generateBoard(true);

}

MatteCtrl.$inject = ['$scope','$timeout'];
