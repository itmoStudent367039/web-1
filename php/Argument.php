<?php

class Argument
{
    private $value;

    public function __construct($name, $value, $fn)
    {
        if (!is_numeric($value)) {
            throw new InvalidArgumentException("$name isn't valid: $value");
        }
        $this->value = $value;
        $this->checkArgument($fn);
    }

    public function __toString()
    {
        return "$this->value";
    }

    public function checkArgument($fn): void
    {
        if (is_callable($fn)) {
            $fn($this->value);
        }
    }


}