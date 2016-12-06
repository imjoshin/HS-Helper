$(document).ready(function(){
  var chars = [" ", "!", ".", "'", ":"];
  var charReplace = ["_", "", "", "", ""];
  var file = "";
  var timer;

  var cards;
  $.ajaxSetup({ cache: false });

  if(localStorage.getItem('showGolden') == "true") $("#golden").attr('checked', true);
  else $("#golden").attr("checked", false);

  if(localStorage.getItem('onlyCollectible') == "true") $("#collectible").attr('checked', true);
  else $("#collectible").attr("checked", false);

  getCards();

  function getCards(){
    $.ajax({
      url: 'http://joshjohnson.io/misc/hs-helper/cards/all-' + ($("#collectible").is(':checked') ? 'collectible-' : "") + 'cards.json',
      dataType: 'json',
      async: false,
      success: function(data) {
        cards = data;
      }
    });
  }

  function showData(file){
    $("#content").slideDown(300, function(){

      $("#card, #info").slideUp(300, function(){

        $("#info").html("");
        $.ajax({
          url: 'http://joshjohnson.io/misc/hs-helper/cards/' + file + '.json',
          type: 'GET',
          success: function(){
            $.getJSON('http://joshjohnson.io/misc/hs-helper/cards/' + file + '.json', function(data) {

              $("#card").css("background-image", "url(" + (($("#golden").is(':checked')) ? data["gold"] : data["normal"]) + ")");
              $("#card").data("normal", data["normal"]);
              $("#card").data("gold", data["gold"]);

              if($("#info").html() == ""){
                for(var k in data){
                  if(k == "normal" || k == "gold" || k == "playRequirements") continue;
                  $("#info").append("<label class='attr'>" + processKey(k) + ":</label> <label class='" + getClass(k, data[k]) + "'>" + data[k] +"</label><br/>");
                }
              }

              if(data["normal"] != null){
                $("#card").slideDown(300, function(){
                  $("#info").slideDown(300);
                });
              }else{
                $("#card").hide();
                $("#info").slideDown(300);
              }

            });
          }
        });
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
    var str = this;
    for (var i = 0; i < find.length; i++) {
      str = str.replace(new RegExp('\\b'+find[i]+'\\b', 'g'), replace[i]);
    }
    return str;
  };

  function isValidImage(url) {
    var ret = true;
    $.ajax({url:url,type:'HEAD' ,async: false, error:function(){ret = false;}});
    return ret;
  }

  $(document).on("click", ".suggestion", function(){
    $(".suggestion").removeClass("current-suggestion");
    $(this).addClass("current-suggestion");
    showData($(this).data('id'));
  });

  $("#golden").on("change", function(){
    localStorage.setItem('showGolden', $(this).is(':checked'));
    $("#card").css("background-image", "url(" + (($(this).is(':checked')) ? $("#card").data("gold") : $("#card").data("normal")) + ")");
  });

  $("#collectible").on("change", function(){
    localStorage.setItem('onlyCollectible', $(this).is(':checked'));
    getCards();
    search();
  });

  $("#query").keyup(function(event){
    if(event.which == 13) {
        if($("#autocomp").length > 0){
          var current = $(".current-suggestion").length > 0 ? parseInt($(".current-suggestion").data("i")) : -1;
          var next = (current + 1) % $(".suggestion").length;
          $(".suggestion").eq(current).removeClass("current-suggestion");
          $(".suggestion").eq(next).addClass("current-suggestion");
          showData($("#autocomp").find(".current-suggestion").data("id"));
        }
        return;
    }
    if($.trim($("#query").val()).length <= 2) $("#autocomp").slideUp(300);
    else search();
  });

  function search(){
    var text = $.trim($("#query").val().toLowerCase());
    if(text.length <= 2) return;

    $("#autocomp").empty();

    var foundNext = false;
    var i = 0;
    $.each(cards, function(k, v){
      if(k.toLowerCase().indexOf(text) >= 0){
        $("#autocomp").append("<div class='suggestion' data-id='" + v + "' data-i='" + i + "'>" + k + "</div>");
        foundNext = true;
        i++;
      }
    });

    if($(".suggestion").length == 0)
      $("#autocomp").append("<div class='no-results'>No Results</div>");
    $("#autocomp").slideDown(300);
  }
});
