<?php

class Validator
{
    public function validate($x, $y, $r): bool
    {
        return $x > 0 && $y >= 0 && $x * $x + $y * $y <= $r * $r ||
            $y > 0 && $x <= 0 && abs($x) <= $r && abs($y) <= $r ||
            $x <= 0 && $y <= 0 && $y >= -0.5 * ($x + $r);
    }
}