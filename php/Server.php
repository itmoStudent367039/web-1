<?php
$start = microtime(true);
date_default_timezone_set('Europe/Moscow');
$x = $_POST['x'];
$y = $_POST['y'];
$r = $_POST['r'];

if (!is_numeric($x) || !is_numeric($y) || !is_numeric($r)) {
    http_response_code(400);
    return;
}
if ($x > 0 && $y >= 0 && $x * $x + $y * $y <= $r * $r ||
    $y > 0 && $x <= 0 && abs($x) <= $r && abs($y) <= $r ||
    $x <= 0 && $y <= 0 && $y >= -0.5 * ($x + $r)) {

    $response_time = round((microtime(true) - $start) * 1000, 3);

    $data = ['x' => $x, 'y' => $y, 'r' => $r, 'boolean' => true, 'response_time' => $response_time, 'current_time' => date('Y/m/d H:i:s')];

} else {
    $response_time = round((microtime(true) - $start) * 1000, 3);
    $data = ['x' => $x, 'y' => $y, 'r' => $r, 'boolean' => false, 'response_time' => $response_time, 'current_time' => date('Y/m/d H:i:s')];
}
echo json_encode($data);