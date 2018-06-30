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
  var numUsers = 0;
  var playernum = 0;
  var playerOneChoice = 0;
  var playerTwoChoice = 0;
  var characterName = "---";

  onConnected.on("value", function(snap) 
  {

    // If they are connected..
    if (snap.val()) 
    {
      // Add user to the connections list.
      var con = Connections.push(true);
      console.log(onConnected);
      console.log("player num = " + con);
      
      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
    }
  });

  function LoadInCharacter()
  {
    
  }

  $(window).on('load', function(){ 
    $("#myModal").show();
  });

  $(document).ready(function($) {

    $(".closebtn").on("click",function(){
      characterName = $("#nameSubmission").val();
      LoadInCharacter();
      console.log(numUsers);
      $("#myModal").hide();
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
      playerOneChoice = 0;
      playerTwoChoice = 0;
      database.ref("/playerData").set({
        playerOneChoice: playerOneChoice,
        playerTwoChoice: playerTwoChoice
      });
    }
    else if(numUsers === 2 && playernum === 0)
    {
      $("#myModal").show();
      console.log("second player")
      playernum = 2;
      playerTwoChoice = 0;
      playerOneChoice = 0;
      database.ref("/playerData").set({
        playerTwoChoice: playerTwoChoice,
        playerOneChoice: playerTwoChoice
      });
    }
    else if(playernum !== 1 || playernum !== 2 && numUsers > 2 )
    {
      console.log("watcher")
      playernum = 0;
      $("#myModal").hide();
    }
    console.log(playernum)
  });