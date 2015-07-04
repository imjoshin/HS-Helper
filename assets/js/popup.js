$(document).ready(function(){
  var cards;

  $("#search").on("click", function(){
    /*
    var url;
    $.ajax({
      type: 'GET',
      url: 'http://joshjohnson.io/misc/hs-helper/getCard.php',
      async: false,
      data: {
        "search": $("#query").val()
      }, 
      success: function(output){
        url = output;
      }
    });

    console.log(url);
    */
    $("html").css("height", "auto");
    $("#content").slideDown(300, function(){
      
      showData();
    });
  });

  function showData(){

    $("#info").slideUp(500, function(){

      var chars = [" ", "!", ".", "'", ":"];
      var charReplace = ["_", "", "", "", ""];

      file = $("#query").val().toLowerCase();
      console.log("file before: " + file);
      file = file.replaceArray(chars, charReplace);
      console.log("file after: " + file);

      $("#card").slideUp(500, function(){
        $("#card").css("background-image", "url(http:/joshjohnson.io/misc/hs-helper/images/" + file + ".png)");
      });

      $("#info").html("");
      $.ajax({
        url: 'assets/cards/' + file + '.json',
        type: 'GET',
        success: function(){
          $.getJSON('assets/cards/' + file + '.json', function(data) {         
            for(var k in data){
              $("#info").append("<b>" + processKey(k) + "</b>: " + data[k] +"<br/>");
            }
          });
        }
      });

      $("#card").slideDown(500, function(){
        $("#info").slideDown(500);
      });
    }); 
  }

  function processKey(k){
    if(k == "id") return "ID";
    return k.replace( /([a-z])([A-Z])/g, "$1 $2").replace(/^./, function (match) {return match.toUpperCase()});
  }

  String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    for (var i = 0; i < find.length; i++) {
      replaceString = replaceString.replace(find[i], replace[i]);
    }
    return replaceString;
  };


  $("#query").keyup(function(event){
    if(event.keyCode == 13){
        $("#search").click();
    }
  });
});