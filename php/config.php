<?php

defined('_KELLER') or die;

/* name of the hostname */
//$host = "127.0.0.1";
$GLOBALS['host'] = "localhost";
$GLOBALS['user'] = "tom";
$GLOBALS['pswd'] = "99";
$GLOBALS['db'] = "math";

/* web site data */
$mail = "@communityReading.org" ;
$from = "Webmaster" ;


$GLOBALS['dbPrefix'] = 'games';


$GLOBALS['TableList'] = array();
$GLOBALS['TableList'][] = new TestTable();

$GLOBALS['TableList'][] = new Fdocuments(); // best to do documents table first, fewer errors
$GLOBALS['TableList'][] = new Fprojects();
$GLOBALS['TableList'][] = new Ffragments();
$GLOBALS['TableList'][] = new Fcollaborators();
$GLOBALS['TableList'][] = new Fhistory();

$GLOBALS['TableList'][] = new Users();   // actually ALL users


?>
