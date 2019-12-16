<?php


// to run the tests from the browser...
////////////////////////////////////////////////////
////  http://localhost/3d_server/php/AJAXtest.php
////////////////////////////////////////////////////

define ('_KELLER',false);		  // AJAX.php and AJAXtest.PHP are the ONLY program that can be run
                                // other modules will die if this value isn't defined


// this is the server interface, mostly for serving database stuff

error_reporting( E_ALL );
ini_set('display_errors', 1);

require_once  "utilities.php";    // mostly debugging stuff
require_once  "database.php";
require_once  "filesystem.php";
require_once  "AJAXLibrary.php";

require_once "config.php";   // our own config file





$GLOBALS['logging'] = true;

$GLOBALS['debugON'] = true;     // true runs the tests, false for production
            			          // also runs other tests such as HTML verification
								                    // turns off all debugging tabs, etc.

$GLOBALS['logQueries'] = false;     // true runs the tests, false for production



$url = $_SERVER['REQUEST_URI'];
$aPath = explode('/',parse_url($url, PHP_URL_PATH));

runUnitTests();

?>
