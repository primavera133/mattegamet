'use strict';

/* jasmine specs for controllers go here */

describe('MatteCtrl', function($scope){
  var scope, ctrl, $httpBackend;

  beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;

    scope = $rootScope.$new();
    ctrl = $controller(MatteCtrl, {$scope: scope});
  }));

//BOARD GENERATING
  it('should generate correct amount of rows', function() {    
    var rows = Math.sqrt(scope.boardSize);    
    scope.generateBoard();
    expect(scope.board.length).toBe(rows);

  });

  it('should generate correct amount of cells', function() {
    var cells = Math.sqrt(scope.boardSize);
    scope.generateBoard();
    expect(scope.board[0].length).toBe(cells);
  });

  it('a cell should have a question', function() {
    scope.generateBoard();
    expect(scope.board[0][0].question).toBeDefined();    
  });

  it('a cell should have an number parts', function() {
    scope.generateBoard();
    expect(scope.board[0][0].question.firstNumber).toBeDefined();    
    expect(scope.board[0][0].question.secondNumber).toBeDefined();    
  });

  it('a cell should have an answer', function() {
    scope.generateBoard();
    expect(scope.board[0][0].question.answer).toBeDefined();    
  });

  it('should be correct answer', function() {
    scope.generateBoard();
    var question = scope.board[0][0].question;
    expect(question.firstNumber * question.secondNumber).toBe(question.answer);
  });

  it('should generate correct tables from checkboxes', function(done) {
    scope.form.tables = {
      1:true,
      2:false,
      3:false,
      4:false,
      5:false,
      6:false,
      7:false,
      8:false,
      9:false,
      10:false
    }
    scope.generateBoard();

    expect(scope.board[0][0].question.secondNumber).toBe(1);
  })


  //$scope.pickRandomCell()

  it('should return a cell', function() {
    scope.generateBoard();

    var cell = scope.pickRandomCell();

    expect(cell.question).toBeDefined();
  });


  //$scope.getQuestion()
  it('should pick different cells', function() {
    var cells = [];
    scope.generateBoard();
    for(var x=0, l=scope.boardSize; x<l; x++) {
      cells.push(scope.getQuestion());
    }
    for(var x=1, l=scope.boardSize; x<l; x++) {
      expect(cells[0].index).not.toBe(cells[x].index);
    }
  });

  it('should not pick done cells', function() {
    var cells = [];
    scope.generateBoard();
    scope.board.length = 1;
    var cells = scope.board[0];

    //set all but first to done
    for(var x=1, l=cells.length; x<l; x++) {
      cells[x].picked = true;
    }

    var question = scope.getQuestion();

    expect(question.index).toBe(cells[0].question.index);

  });


  //$scope.displayQuestion()
  it('should update the model for questions', function() {
    scope.generateBoard();
    var q = scope.getQuestion();
    scope.displayQuestion(q);

    expect(scope.question.firstNumber).toBe("" + q.firstNumber);
    expect(scope.question.secondNumber).toBe("" + q.secondNumber);

  });


  //$scope.nextPlayer()
  it('should change selected player', function() {
    scope.whatPlayer = "1";
    scope.nextPlayer();
    expect(scope.whatPlayer).toBe("2");
    scope.nextPlayer();
    expect(scope.whatPlayer).toBe("1");
  });


  //$scope.checkAnswer()
  it('should check the answer', function() {
    var cell = {
      question: {
        firstNumber: 1,
        secondNumber: 2
      }
    }

    scope.question.firstNumber = 1;
    scope.question.secondNumber = 2;

    var retVal = scope.checkAnswer(cell);
    expect(retVal).toBe(true);

    cell.question.firstNumber = 3;

    retVal = scope.checkAnswer(cell);
    expect(retVal).toBe(false);

  })



  //$scope.getHorizontalCheckArray
  it('should add all horizontal rows', function() {
    scope.generateBoard();
    var arr = scope.getHorizontalCheckArray();
    var sideLength = Math.sqrt(scope.boardSize);
    expect(arr.length).toBe(sideLength);
    //first row should be 0
    expect(arr[0][0][0]).toBe(0);
    //first cell should be 0
    expect(arr[0][0][1]).toBe(0);
    //last row last cell rowIdx should be max
    expect(arr[sideLength-1][sideLength-1][0]).toBe(sideLength-1);
    //last row last cell cellIdx should be max
    expect(arr[sideLength-1][sideLength-1][1]).toBe(sideLength-1);
  });


  //$scope.getVerticalCheckArray
  it('should add all vertical rows', function() {
    scope.generateBoard();
    var arr = scope.getVerticalCheckArray();
    var sideLength = Math.sqrt(scope.boardSize);
    expect(arr.length).toBe(sideLength);
    //first row should be 0
    expect(arr[0][0][0]).toBe(0);
    //first cell should be 0
    expect(arr[0][0][1]).toBe(0);
    //last row first cell rowIdx should be 0
    expect(arr[sideLength-1][0][0]).toBe(0);
    //last row first cell cellIdx should be max
    expect(arr[sideLength-1][0][1]).toBe(sideLength-1);

  });

  //$scope.getSlashWiseCheckArray
  it('should check slashwise checkArray', function(done) {
    scope.generateBoard();
    var arr = scope.getSlashWiseCheckArray();
    var sideLength = Math.sqrt(scope.boardSize);
    expect(arr.length).toBe(((sideLength-scope.inARow +1)*2) - 1);

    //first rowIdx should be 0
    expect(arr[0][0][0]).toBe(0);
    //first cellIdx should be 3 if inARow is 4
    expect(arr[0][0][1]).toBe(scope.inARow-1);

    //first cellIndex in first row should be one less than first cellIndex in next row
    expect(arr[0][0][1] + 1).toBe(arr[1][0][1])

  });

  //$scope.getBackSlashWiseCheckArray
  it('should check backslashwise checkArray', function(done) {
    scope.generateBoard();
    var arr = scope.getBackSlashWiseCheckArray();
    var sideLength = Math.sqrt(scope.boardSize);
    expect(arr.length).toBe(((sideLength-scope.inARow +1)*2) - 1);

    //first rowIdx should be max
    expect(arr[0][0][0]).toBe(sideLength-1);
    //first cellIdx should be 3 if inARow is 4
    expect(arr[0][0][1]).toBe(scope.inARow-1);

    //first cellIndex in first row should be one less than first cellIndex in next row
    expect(arr[0][0][1] + 1).toBe(arr[1][0][1])

  });

  //$scope.generateWinnerCheckArray
  it('should check total checkArray', function(done) {
    scope.generateBoard();
    var horizontalArr = scope.getHorizontalCheckArray();
    var verticalArr = scope.getVerticalCheckArray();
    var slashwiseArr = scope.getSlashWiseCheckArray();
    var backslashwiseArr = scope.getBackSlashWiseCheckArray();

    scope.generateWinnerCheckArray();

    expect(scope.checkWinArr.length).toBe(horizontalArr.length + verticalArr.length + slashwiseArr.length + backslashwiseArr.length);
  })


  //$scope.checkWin
  it('should check if someone won', function(done) {
    scope.inARow = 2;
    scope.generateBoard();
    scope.generateWinnerCheckArray();

    var firstCellFirstRow = scope.board[0][0];
    var secondCellFirstRow = scope.board[0][1];
    var firstCellSecondRow = scope.board[1][0];
    var secondCellSecondRow = scope.board[1][1];

    //horizontal win
    firstCellFirstRow.player = 1;
    secondCellFirstRow.player = 1;
    expect(scope.checkWin()).toBe(true);

    firstCellFirstRow.player = 1;
    secondCellFirstRow.player = 2;
    expect(scope.checkWin()).toBe(false);

    //vertical win
    firstCellFirstRow.player = 1;
    secondCellFirstRow.player = null;
    firstCellSecondRow.player = 1;
    expect(scope.checkWin()).toBe(true);

    firstCellFirstRow.player = 1;
    secondCellFirstRow.player = null;
    firstCellSecondRow.player = 2;
    expect(scope.checkWin()).toBe(false);

    //slashwise win
    firstCellFirstRow.player = null;
    secondCellFirstRow.player = 1;
    firstCellSecondRow.player = 1;
    secondCellSecondRow.player = null;
    expect(scope.checkWin()).toBe(true);

    firstCellFirstRow.player = null;
    secondCellFirstRow.player = 1;
    firstCellSecondRow.player = 2;
    secondCellSecondRow.player = null;
    expect(scope.checkWin()).toBe(false);

    //backslashwise win
    firstCellFirstRow.player = 1;
    secondCellFirstRow.player = null;
    firstCellSecondRow.player = null;
    secondCellSecondRow.player = 1;
    expect(scope.checkWin()).toBe(true);

    firstCellFirstRow.player = 1;
    secondCellFirstRow.player = null;
    firstCellSecondRow.player = null;
    secondCellSecondRow.player = 2;
    expect(scope.checkWin()).toBe(false);


  });


//$scope.setCorrectCell
it('should set the cell to the player', function(done) {
  scope.generateBoard();
  scope.initGame();
  scope.whatPlayer = "2";
  var cell = scope.board[0][0];

  expect(cell.player).toBe(null);

  scope.setCorrectCell(cell);

  expect(cell.player).toBe("player2");
})


//$scope.makeMove
it('should pick an available cell and set it to the player', function(done) {
  for(var x=0, xl=10; x<xl;x++){


  scope.generateBoard();
  scope.generateWinnerCheckArray();

  //set all but first to done
  var rowSize = Math.sqrt(scope.boardSize);
  var cellSize = rowSize;
  for(var rows = 0; rows < rowSize; rows++) {
    for (var cells = 0; cells < cellSize; cells++) {
      if((rows === 0) && (cells === 0)){
        //skip first cell
      }else{
        scope.board[rows][cells].picked = true;
        scope.board[rows][cells].player = "player1";
      }
    }
  }

  scope.whatPlayer = "2";

  expect(scope.board[0][0].player).toBe(null);


  scope.question.firstNumber = scope.board[0][0].question.firstNumber;
  scope.question.secondNumber = scope.board[0][0].question.secondNumber;
  

  var cell = scope.makeMove(2);

  expect(scope.board[0][0].question.index).toBe(cell.question.index);
  expect(scope.board[0][0].player).toBe("player2");

} 
})



//make e2e tests instead
  //$scope.clickCell()
  //$scope.displayWinner
  //$scope.initGame()
  //$scope.resetGame
});


