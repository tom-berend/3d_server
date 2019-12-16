<?php
// this is the server interface, mostly for serving database stuff

// test it directly in the browser, for example
//      http://localhost/gamecode/php/AJAX.php?cmd=getName&P1=503

define('_KELLER', true);   // or die;
////////////////////////////////////////////////////////////////////////////////
//// to check for parsing errors, run this from the browser line
////    http://localhost/3d_server/php/AJAX.php?cmd=test;
////////////////////////////////////////////////////////////////////////////////


require_once  "utilities.php";    // mostly debugging stuff
require_once  "database.php";
require_once  "filesystem.php";
require_once  "AJAXLibrary.php";

require_once "config.php";   // our own config file


error_reporting(E_ALL);
$GLOBALS['logging'] = true;

$GLOBALS['inCustomError'] = false;
function customError($errno, $errstr, $errfile, $errline=0)
{
    // if($GLOBALS['inCustomError']){
    //   echo "<br> Cannot report $errstr in $errfile($errline) because already processing an error";
    //   die;
    // }
    // $GLOBALS['inCustomError'] = true;

    echo json_encode(array('success'=>'0','errstr'=>$errstr,'errfile'=>$errfile,'errline'=>$errline));
    echo '<br><pre>';
    echo "<br>$errstr in $errfile($errline)";
    print_r(debug_backtrace());
    echo '</pre><br>';
    writeErrorLog("$errfile($errline)", $errstr);
    die;
}
set_error_handler("customError");                       //set error handler

// $stupidMsg = serialize($_POST);  // only for very early debugging
// writeErrorLog('hello world',$stupidMsg);


$GLOBALS['debugON'] = true;     // true runs the tests, false for production
                                  // also runs other tests such as HTML verification
                                  // turns off all debugging tabs, etc.



$GLOBALS['logQueries'] = true;

$GLOBALS['singleUser'] = false;     // true for android stand-alone, false for server

$GLOBALS['dbPrefix'] = 'games';

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


// ok, let's process this request

writeAJAXLog('received this $_REQUEST', $_REQUEST);
$result_array = dispatch($_REQUEST);

// ... send it back
echo json_encode($result_array);

// // ... and log at our leisure
if ($GLOBALS['logging']) {
    writeAJAXLog($_POST, $result_array);
}

die;




/////////////////////////////////
/////////////////////////////////

function dispatch($request)
{     // the request is really just $_POST

    if (!isset($request['cmd'])) {
        // we don't know what to do
        trigger_error("cmd not set for AJAX request ".serialize($request));
        return(false);
    }

    $cmd = $request['cmd'];
    $cmd = str_replace("\\", "", $cmd);  // strip out slashes

    $P1 = isset($request['P1'])?$request['P1']:"";
    $P2 = isset($request['P2'])?$request['P2']:"";
    $P3 = isset($request['P3'])?$request['P3']:"";

    $AJAX = new AJAXLibrary();

    $result = $AJAX->cmd($cmd, $P1, $P2, $P3);
    return($result);
}

///////////////////////////////////////////
///////////////////////////////////////////
