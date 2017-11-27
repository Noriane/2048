<?php 
	header("Content-Type: application/json; charset=UTF-8");
	include_once 'Query.php';
	ini_set('display_errors',1);
	error_reporting(E_ALL);

	if ($_SERVER["REQUEST_METHOD"] == "GET")
	{
		if ($_GET["option"] == "id")
		{
			$queryId = "SELECT id FROM users WHERE id=LAST_INSERT_ID()";
			$query = new Query($queryId);
			$result_id = $query->SQLquery(false);//FetchAll
			
			if(empty($result_id))
			{
			 	$result_id = NULL;
			}else
			{
				$result_id = $result_id[0];
			}
			$id = json_encode($result_id);
			echo $id;
			
		}
		if ($_GET["option"] == "score")
		{
			$queryScore = "SELECT score_max FROM users WHERE id=(?)";
			$query = new Query($queryScore, [$_COOKIE['id']]);
			$result = $query->SQLquery();//FetchAll
			if(empty($result))
			{
			 	$result = NULL;
			}else
			{
				$result = $result[0];
			}
			$score = json_encode($result);
			echo $score;
		}
	}

	if ($_SERVER["REQUEST_METHOD"] == "POST")
	{	
		if (isset($_POST["score"]))
		{
			$queryToBdd = "INSERT INTO users (score, score_max) VALUES (?, ?)";
			$varArr = array($_POST['score'], $_POST['score']);
			$query = new Query($queryToBdd, $varArr);
			$result = $query->SQLquery(False);

			setCookie("id", $result, time() + (3600*24));
			echo json_encode(["id"=> $result]);
		}
		if (isset($_POST["score_max"]))
		{
			$queryToBdd = "UPDATE Users SET score_max=(?)  WHERE id =(?) AND score_max < (?)";
			$varArr = array($_POST['score_max'], $_COOKIE['id'], $_POST["score_max"]);
			$query = new Query($queryToBdd, $varArr);
			$result = $query->SQLquery(False);
		}

	}
?>