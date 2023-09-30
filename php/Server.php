<?php
require_once('Argument.php');
require_once('Validator.php');
require_once('HtmlPacker.php');
$start = microtime(true);
date_default_timezone_set('Europe/Moscow');

set_error_handler(function () {
    sendErrorMessage("Uncorrected input");
    die;
}, E_WARNING);

$jsonData = file_get_contents('php://input');
$postData = json_decode($jsonData, true);

$x = $postData['x'];
$y = $postData['y'];
$r = $postData['r'];

$check_x = function ($x) {
    if (!($x == -2 || $x == -1.5 || $x == -1 || $x == -0.5 || $x == 0 ||
        $x == 0.5 || $x == 1 || $x == 1.5 || $x == 2)) {
        throw new InvalidArgumentException("X isn't valid: $x");
    }
};
$check_y = function ($y) {
    $regex = '/^-?(?:3(?:\.0+)?|[0-2](?:\.[0-9]+)?|\.[0-9]+)$/';
    if (!preg_match($regex, $y)) {
        throw new InvalidArgumentException("Y isn't valid: $y");
    }
};
$check_r = function ($r) {
    if (!($r == 1 || $r == 1.5 || $r == 2 || $r == 2.5 || $r == 3)) {
        throw new InvalidArgumentException("R isn't valid: $r");
    }
};
try {
    $array = [new Argument('X', $x, $check_x), new Argument('Y', $y, $check_y), new Argument('R', $r, $check_r)];
    $validator = new Validator();
    sendData($validator->validate($x, $y, $r), $array, $start);
} catch (InvalidArgumentException $exception) {
    sendErrorMessage($exception->getMessage());
}
function sendErrorMessage($message): void
{
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $message]);
}

function sendData($flag, $array, $start): void
{
    $response_time = round((microtime(true) - $start) * 1000, 3);
    $current_time = date('Y/m/d H:i:s');
    $str_boolean = $flag ? "true" : "false";
    $packer = new HtmlPacker("tr", "td", $response_time, $current_time, $str_boolean, $array);
    echo json_encode(['status' => 'success', 'message' => $packer->getHtml()]);
}

