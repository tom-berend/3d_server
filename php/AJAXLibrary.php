<?php

class AJAXLibrary extends UnitTestCase
{


    public function cmd($cmd, $P1 = "", $P2 = "", $P3 = "")
    {
        switch ($cmd) {

            case 'test':
                return (array("success" => "1", "msg" => "command $cmd received", "yourP1Was" => serialize($P1)));
                break;

            case 'saveLessonCode':
                // P1: userID,
                // P2: lesson,   (eg: "010")
                // P3: code
                //saveDocument($id, $projectName, $docName, $content='', $type='.js',$commit=false)
                $filesystem = new filesystem();
                return ($filesystem->saveDocument($P1, 'lessons', 'lesson' . $P2, $P3));
                break;

            default:
                assertTrue(false, "Unknown command '$cmd'");
                if ($GLOBALS['logging']) {
                    writeAJAXLog("Unknown command '$cmd'", $_POST);
                }
                return ("Unknown command '$cmd'");
        }
        assertTrue(false, "Should never get here....");
    }

    public function testAJAX()
    {
//        echo serialize($this->cmd('test'))
        assertTrue($this->cmd('test')['success'] == 1);

    }
}
