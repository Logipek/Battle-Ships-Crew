<?php

require_once 'config.php';
require_once 'check_grid.php';

$grid = [
    [1, 0, 0, 0, 0, 0, 0, 2, 2, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
    [6, 6, 6, 0, 0, 5, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 7, 7, 7, 7, 0],
];



if(check_grid($grid)) {
    echo "Test OK !\n";
}