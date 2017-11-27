<?php

	class Query
	{
	    private $_query;
	    private $_pdo;
	    private $_variable;
	    private $_ddbName = "game";

	    public function __construct($query, $variable = array())
	    {
	        $this->_pdo = $this->connect_db($this->_ddbName);
	        $this->_pdo->setAttribute( \PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING );
	        $this->_query = $query;
	        $this->_variable = $variable;
	    }

	    public function SQLquery($fetch = True)
	    {
	        $res = $this->_pdo->prepare($this->_query);
	        $res->execute($this->_variable);
	        if($fetch)
	        {
	        	$result = $res->fetchAll();
	       	 	return($result);
	        }
	        return $this->_pdo->lastInsertId();
	        
	    }

        private function connect_db($db = FALSE, $host = "127.0.0.1", $username = "root", $password ="root", $port = FALSE)
	    {
            $pdo = new PDO("mysql:host=".$host.";dbname=".$db, $username, $password);
            return($pdo);
	    }
	    public function getErrors()
	    {
	    	return $this->_pdo->errorInfo();
	    }
	}
?>