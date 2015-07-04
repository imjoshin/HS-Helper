$(document).ready(function(){
  var chars = [" ", "!", ".", "'", ":"];
  var charReplace = ["_", "", "", "", ""];
  var imageDir = "http:/joshjohnson.io/misc/hs-helper/images/";
  var file = "";
  var timer;

  var cards;
  $.getJSON('http://joshjohnson.io/misc/hs-helper/cards/all-cards.json', function(data) {         
    cards = data;
  });

  if(localStorage.getItem('showGolden') == "true") $("#golden").attr('checked', true); 
  else $("#golden").attr("checked", false);


  function showData(file){

    $("#info").slideUp(300);
    $("#card").slideUp(300, function(){

      $("#info").html("");
      $.ajax({
        url: 'http://joshjohnson.io/misc/hs-helper/cards/' + file + '.json',
        type: 'GET',
        success: function(){
          $.getJSON('http://joshjohnson.io/misc/hs-helper/cards/' + file + '.json', function(data) {         
            
            $("#card").css("background-image", "url(" + (($("#golden").is(':checked')) ? data["gold"] : data["normal"]) + ")");
            $("#card").data("normal", data["normal"]);
            $("#card").data("gold", data["gold"]);

            for(var k in data){
              if(k == "normal" || k == "gold") continue;
              $("#info").append("<label class='attr'>" + processKey(k) + ":</label> <label class='" + getClass(k, data[k]) + "'>" + data[k] +"</label><br/>");
            }
          });

          $("#card").slideDown(300, function(){
            $("#info").slideDown(300);
          });
        }
        
      });

      
    }); 
  }

  function getClass(k, v){
    if(k == "text" || k == "flavor" || k == "id" || k == "collectible" || k == "artist") return "";
    var c = (typeof v == "string") ? v.replaceArray(chars, charReplace) : "";
    return c.toLowerCase();
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
  function isValidImage(url) {
    var ret = true;
    $.ajax({url:url,type:'HEAD' ,async: false, error:function(){ret = false;}});
    return ret;
  }

  $(document).on("click", ".suggestion", function(){
    var t = this;
    $("#autocomp").slideUp(300, function(){
      $("#content").slideDown(300, function(){
        showData($(t).data('id'));
      });
    });
  });

  $("#golden").on("change", function(){
    localStorage.setItem('showGolden', $(this).is(':checked'));
    $("#card").css("background-image", "url(" + (($(this).is(':checked')) ? $("#card").data("gold") : $("#card").data("normal")) + ")");
  });

  $("#query").keyup(function(event){
    if (timer) {
        $("#autocomp").slideUp(300);
        clearTimeout(timer);
    }
    timer = setTimeout(search, 500);
  });
  function search(){
    var text = $.trim($("#query").val().toLowerCase());
    if(text.length <= 2) return;

    $("#autocomp").empty();

    $.each(cards, function(k, v){
      if(k.toLowerCase().indexOf(text) >= 0){
        $("#autocomp").append("<div class='suggestion' data-id='" + v + "'>" + k + "</div>");
      }
    });

    if($(".suggestion").length == 0)
      $("#autocomp").append("<div class='no-results'>No Results</div>");
    $("#autocomp").slideDown(300);
  }

  /* Old image function
  function getImage(base){
    return base + (($("#golden").is(':checked')) ? (((isValidImage(base + "-g.gif")) ? "-g.gif" : ((isValidImage(base + "-g.png")) ? "-g.png" : ".png"))) : ".png");
  }*/
});