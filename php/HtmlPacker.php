<?php

class HtmlPacker
{
    private string $html;

    public function __construct($outer_tag, $inner_tag, ...$elements)
    {
        $this->html = $this->parseHtml($outer_tag, $inner_tag, $elements);
    }


    public function parseHtml($outer_tag, $inner_tag, $elements): string
    {
        $html = "<$outer_tag>";
        foreach ($elements as $item) {
            if (!is_array($item)) {
                $html = $html . "<$inner_tag>" . $item . "</$inner_tag>";
            } else {
                foreach ($item as $array_item) {
                    $html = $html . "<$inner_tag>" . $array_item . "</$inner_tag>";
                }
            }
        }
        $html .= "</$outer_tag>";
        return $html;
    }

    public function getHtml(): string
    {
        return $this->html;
    }

}