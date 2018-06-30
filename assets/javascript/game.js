 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyBpx1g7X1fo-yjsr1PbAxm1_B494fgvGfY",
  authDomain: "rps-game-6b95c.firebaseapp.com",
  databaseURL: "https://rps-game-6b95c.firebaseio.com",
  projectId: "rps-game-6b95c",
  storageBucket: "",
  messagingSenderId: "518692013614"
};
firebase.initializeApp(config);

var database = firebase.database();

var Connections = database.ref("/connections");
var onConnected = database.ref(".info/connected");
var playerOneChoiceWatch = database.ref("/players/1/selection");
var playerTwoChoiceWatch = database.ref("/players/2/selection");
var currentPlayerWatch = database.ref("CurrentPlayer");

var pictureList = ["chimchar-foreground.png","piplup-foreground.png","turwig-foreground.png"]

var numUsers = 0;
var playernum = 0;
var playerOneChoice = -1;
var playerTwoChoice = -1;
var myChoice = -1;
var currentPlayer = 0;


onConnected.on("value", function(snap) 
{
  // If they are connected..
  if (snap.val()) 
  {
    // Add user to the connections list.
    var con = Connections.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

function LoadInCharacter(characterName)
{
  database.ref('/players/' + playernum).set({
    losses: 0,
    wins: 0,
    name: characterName,
    selection: -1
  });
}

function playerOneVictory()
{
  console.log("playerOneWON");
}

function playerTwoVictory()
{
  console.log("playerTwoWON");
}

function resetGame()
{

}

$(window).on('load', function(){ 
  $("#myModal").show();
});

$(document).ready(function($) {


  $(".closebtn").on("click",function(){
    characterName = $("#nameSubmission").val();
    LoadInCharacter(characterName);
    console.log(numUsers);
    $("#myModal").hide();
    if(playernum === 1)
    {
      $("#InstructionText").text("Please Select Your Starter Pokemon!");
      $("#InstructionText").css('visibility', 'visible');
    }
    else if(playernum === 2)
    {
      $("#InstructionText").text("Waiting for other Player");
      $("#InstructionText").css('visibility', 'visible');
    }
  });

  $(".SelectionArea").on("click",function()
  {
      console.log("selection!!")
      if(playernum === 1 && myChoice === -1)
      {
        myChoice = $(this).attr("data-id");
        database.ref("/players/" + playernum  + "/selection").set(myChoice);
      }

      if(playernum === 2 && myChoice === -1)
      {
        myChoice = $(this).attr("data-id");
        database.ref("/players/" + playernum  + "/selection").set(myChoice);
      }
  });



playerOneChoiceWatch.on("value",function(snap)
{
    if(playernum === 1)
    {
      // if(myChoice !== -1)
      // {
      //   var url = "url(../RPS-Multiplayer/assets/images/";
      //   url += pictureList[parseInt(snap.val())];
      //   url += " )";
      //   $("#player1infoBackground").css("background-image",url);
      // }
      // myChoice = snap.val();
      $("#InstructionText").text("Waiting for other Player");
    }
    console.log("player one: " + playerOneChoice);
    console.log("player two: " + playerTwoChoice);
    playerOneChoice = snap.val();
    
    database.ref(currentPlayerWatch).set(2);
});

  playerTwoChoiceWatch.on("value",function(snap)
  {
    if(playernum === 2)
    {
      // if(myChoice !== -1)
      // {
      //   var url = "url(../RPS-Multiplayer/assets/images/";
      //   url += pictureList[parseInt(snap.val())];
      //   url += " )";
      //   $("#player2infoBackground").css("background-image",url);
      // }
      myChoice = snap.val();
    }
    console.log("player one: " + playerOneChoice);
    console.log("player two: " + playerTwoChoice);
    playerTwoChoice = snap.val();
    database.ref(currentPlayerWatch).set(1);
  });



  currentPlayerWatch.on("value",function(snap)
  {
    currentPlayer = snap.val();
    console.log("playerWatchChanged");
      console.log("winner watch");
      console.log("player one: " + playerOneChoice);
      console.log("player two: " + playerTwoChoice);
      if(playerOneChoice === 0)
      {
        console.log("player one: " + playerOneChoice);
      }
      if(playerTwoChoice === 1)
      {
        console.log("player two: " + playerTwoChoice);
      }
      //the second player has made a choice and we both need to determine a winner and then reset the game.
      if ((playerOneChoice === 0) && (playerTwoChoice === 2))
      {
        playerOneVictory();
      }
      else if ((playerOneChoice === 0) && (playerTwoChoice === 1))
      {
        console.log("winner");
        console.log("playerTwoVictory");
        playerTwoVictory();
      }
      else if ((playerOneChoice === 2) && (playerTwoChoice === 0))
      {
        playerTwoVictory();
      }
      else if ((playerOneChoice === 2) && (playerTwoChoice === 1))
      {
        playerOneVictory();
      }
      else if ((playerOneChoice === 2) && (playerTwoChoice === 0))
      {
        playerOneVictory();
      }
      else if ((playerOneChoice === 1) && (playerTwoChoice === 1))
      {
        playerTwoVictory();
      }
      else if (playerOneChoice === playerTwoChoice)
      {
        resetGame();
        console.log("resetGame");
      }

  });

});

  



Connections.on("value", function(snap) {
  console.log("snap!");
  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  numUsers = snap.numChildren();
  console.log(numUsers);
  console.log(playernum);
  if(playernum === 1 || playernum === 2)
  {
    console.log("returning");
    return;
  }
  if(numUsers === 1 && playernum === 0)
  {
    $("#myModal").show();
    console.log("first player")
    playernum = 1;
  }
  else if(numUsers === 2 && playernum === 0)
  {
    $("#myModal").show();
    console.log("second player")
    playernum = 2;
  }
  else if(playernum !== 1 || playernum !== 2 && numUsers > 2 )
  {
    console.log("watcher")
    playernum = 0;
    $("#myModal").hide();
  }
  console.log(playernum)
});