const x_class = "x";
const circle_class = "circle"
const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6],

]
const cells = $('.cell')
const board = $('#board')
let origBoard
let circleTurn
let withAI
let level

$('#restartButton').on('click', startGame)
$('#forTwoButton').on('click', createGame)
$('#withAIButton').on('click', createGame)

function createGame(e){
  if($(this).attr('id') == 'forTwoButton'){
    withAI = false;
    $('#board').removeClass('hide')
    $('.createGameMessage').addClass('hide')
    startGame();
  }else {
    $('.gameMod').addClass('hide')
    $('.level').removeClass('hide')
    $('.lvl').removeClass('hide')

    $('.lvl').on('click', e=>{
      // console.log(e.target.id)
      switch (e.target.id) {
        case 'Easy':
            level = 2;
          break;
        case 'Normal':
            level = 3;
          break;
        case 'Hard':
            level = 4;
          break;
      }
      $('#board').removeClass('hide')
      $('.createGameMessage').addClass('hide')
      withAI = true;
      startGame();
    })

  }

}

function startGame(){
  console.log('withAI ',withAI)
  // console.log(level ? ('level=',level) : 'level is not defined')
  level ? console.log('level ' + level) : console.log('level is not defined')
  origBoard = [0,1,2,3,4,5,6,7,8]
  circleTurn = false;
  $('#winningMesessage').removeClass('show')
  cells.removeClass(circle_class);
  cells.removeClass(x_class);
  cells.unbind('click', handleClick)
  cells.one('click', handleClick)
  setBoardHoverClass()
}

function emptyIndexies(board){
  return  board.filter(s => s != "O" && s != "X");
}

function handleClick(e){
  let cellID = Number($(this).attr('id'))

  let availableMove = emptyIndexies(origBoard).some(i =>{
    if (i == cellID) return true
  })

  if(availableMove){
    origBoard[cellID] = "X"
    let currentClass = circleTurn ? circle_class : x_class
    $(this).addClass(currentClass )

    if(checkWin(currentClass)){
      endGame(false)
    }else if(isDraw()){
      endGame(true)
    }else{
      swapTurns()
      setBoardHoverClass()
      withAI ? AI() :false
    }
  }
}

function setBoardHoverClass(){
  board.removeClass(x_class)
  board.removeClass(circle_class)
  if(circleTurn) {
    board.addClass(circle_class);
  }else{
    board.addClass(x_class);
  }
}

function swapTurns() {
  circleTurn = !circleTurn
}

function isDraw() {
  if (emptyIndexies(origBoard) == '') return true
}

function checkWin(currentClass) {
  return winningCombinations.some(combinations => {
    return combinations.every(index => {
      return cells[index].classList.contains(currentClass)
    })
  })
}

function endGame(draw) {
  if(draw){
    $('.data-winner-messege-text').html("Draw!")
  }else{
    $('.data-winner-messege-text').html((circleTurn ? "O's" : "X's") + " win!")
  }
  $('#winningMesessage').addClass('show')
}

function AI() {
  var huPlayer = "O"
  var aiPlayer = "X"
  function minimax(newBoard, player){
    var availSpots = emptyIndexies(newBoard);

    if (winning(newBoard, huPlayer)){
       return {score:-10};
    }
    else if (winning(newBoard, aiPlayer)){
      return {score:10};
    }
    else if (availSpots.length === 0){
      return {score:0};
    }

    var moves = [];

    for (var i = 0; i < availSpots.length; i++){
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == aiPlayer){
        var result = minimax(newBoard, huPlayer);
        move.score = result.score;
      }
      else{
        var result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    var bestMove;
    if(player === aiPlayer){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  function winning(board, player){
   if (
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
          ) {
          return true;
      } else {
          return false;
      }
  }

  var bestSpot = minimax(origBoard, huPlayer);
  console.log('bestSpot1=',bestSpot.index)

  let i = Math.floor(Math.random() * (level - 0 + 1) + 0)
  console.log('errorAI=',i)


  if(i==1){
    let bordAI = emptyIndexies(origBoard)
    let s = bordAI.some(it =>{
        if(it == bestSpot.index-1) return true

    });
    if (s) bestSpot.index=bestSpot.index-1
  }
  console.log('bestSpot2=',bestSpot.index)



  let currentClass = circleTurn ? circle_class : x_class
  cells[bestSpot.index].classList.add(currentClass);
  if(checkWin(currentClass)){
    endGame(false)
  }else if(isDraw()){
    endGame(true)
  }else{
    swapTurns()
    setBoardHoverClass()
    origBoard[bestSpot.index] = "O"
    console.log('origBoard=',origBoard)

  }


}
