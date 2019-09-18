// Code your JavaScript / jQuery solution here
var turn =0;


function player(){
   if (turn%2 === 0){
       return 'X'
   } else {
       return 'O'
   }
}

function populateBoard(arr) {
    var bins = window.document.querySelectorAll('td');
    for (let i = 0; i < 9; i++) {
      bins[i].innerHTML = arr[i];
    }
}

function updateState(element){
    element.innerHTML=player();  
}

function setMessage(string){
    $("div#message").html(string);
}

function content(cell){
    return cell.innerHTML;
}

function resetBoard(){
    var bins = window.document.querySelectorAll('td');
    for (let i = 0; i < 9; i++) {
        bins[i].innerHTML = '';
    }
    turn = 0;
}

function getState(){
    var board = window.document.querySelectorAll('td');
    return [...board].map(content)
}

function checkWinner(){
    var winner = false;
    const state = getState();
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ]
    winCombos.some(combo => {
        if (state[combo[0]] != '' && state[combo[0]] === state[combo[1]] && state[combo[1]] === state[combo[2]]){
            setMessage(`Player ${state[combo[0]]} Won!`);
            winner = true;
        }
    });
    return winner;
}

function validMove(element) {
    if (checkWinner() || content(element) != ''){
        return false;
    } else {
        return true;
    }
}

function doTurn(element){
    updateState(element);
    if (checkWinner()) {
        resetBoard();
    } else {
        turn+=1;
        if(turn > 8) {
            setMessage('Tie game.');
            resetBoard();
        }
    }
}

function attachListeners(){
    $("td").click(function( event ) {
        if (validMove(event.target)) { 
            doTurn(event.target); 
        }
    });
} 

function saveGame(){
        var state =  getState();
        var gameId = $("#save").data("id");
        if (gameId === ''){
            $.post('/games', {state: state}, function(resp) {
                var id = resp.data.id;
                console.log('ID', id);
                $("#save").data("id", id);
            });
        } else {
            $.ajax({
                url: '/games/'+gameId,
                type: 'PUT',
                data: {state: state}               
              });
        }
     
  }

  function previousGames(){
      $.get('/games', function(resp){
        var gamesList = "";
        resp["data"].forEach(function(el){ 
            gamesList += '<li>' + "Game id: " + el["id"] + "   " +
            '<button class="game" onclick="getGame(' + el["id"] + ')" data-id="' + el["id"] + '">' + "Load" + '</button>' +
            '</li>';
        });
        $("#games").html(gamesList);    
      });
 }

 function getGame(id) {
     $.get("/games/" + id, function(resp) {
        var state = resp["data"]["attributes"]["state"]
        populateBoard(state)
     })
 }
  

