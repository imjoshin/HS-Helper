<?php
  ini_set('display_errors', 'On');
  ini_set('memory_limit', '-1');

  $sym      = array(" ", ":");
  $symEquiv = array("%20", "%3A");

  $search = str_replace($sym, $symEquiv, $_GET["search"] . " hearthstone card");
  $http = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=$search";

  $req = file_get_contents($http);

  $json = json_decode($req, true);
  $results = $json["responseData"]["results"];

  $url = $results[0]["url"];
  foreach($results as $image){
  	if(strpos($image["url"], '.gif') === false){
  		$url = $image["url"];
  		break;
  	}
  }
  echo $url;
?>