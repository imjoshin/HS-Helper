<?php
  ini_set('display_errors', 'On');
  ini_set('memory_limit', '-1');

  $json = json_decode(file_get_contents("cards.json"));

  $char = array(" ", "!", ".", "'", ":");
  $charReplace = array("_", "", "", "", "");

  foreach($json as $sName=>$section){
    echo "<b>$sName</b><br/>";
    foreach($section as $card){
      $card = json_decode(json_encode($card), true);
      //print_r($card); echo "<br/><br/>";
      if(is_array($card) && array_key_exists("name", $card) && $card["type"] != "Hero"){
        $filename = strtolower(str_replace($char, $charReplace, $card["name"])) . ".json";
        echo "cards/$filename<br/>";
        file_put_contents("cards/$filename", json_encode($card));
      }
    }
  }

  echo "Complete!";
?>