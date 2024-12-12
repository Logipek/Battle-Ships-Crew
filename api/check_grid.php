<?php

function check_grid($grid, $nb_boats) {
    $sizes = [
        2 => 0,
        3 => 0,
        4 => 0,
        5 => 0,
    ];

    //Clone grid and set every values to 0 for further verifications
    $rebuilt_grid = [];
    for ($col = 0; $col < sizeof($grid); $col++) {
        array_push($rebuilt_grid, []);
        for ($row = 0; $row < sizeof($grid[$col]); $row++) {
            array_push($rebuilt_grid[$col], 0);
        }
    }

    $boat_id = 1;

    do {
        $size = 0;
        //Look for the boat id from right to left then top to bottom
        for ($col = 0; $col < sizeof($grid); $col++) {
            for ($row = 0; $row < sizeof($grid[$col]); $row++) {
                //If found, set its size to 1
                if ($grid[$col][$row] === $boat_id) {
                    $size = 1;
                    //Rebuild the other grid with the boat id
                    $rebuilt_grid[$col][$row] = $boat_id;
                    break;
                }
            }
            //If size = 1, boat have been found
            if ($size !== 0) {
                break;
            }
        }

        if ($col === sizeof($grid)) { break; }

        //Look for a horizontal boat
        if (sizeof($grid[$col]) > $row + 1) {
            while ($grid[$col][$row + 1] === $boat_id) {
                $size++;
                $row++;
                $rebuilt_grid[$col][$row] = $boat_id;
                if (sizeof($grid[$col]) === $row) {
                    break;
                }
            }
        }
        //Look for a vertical boat
        if (sizeof($grid) > $col && $size === 1) {
            while ($grid[$col + 1][$row] === $boat_id) {
                $size++;
                $col++;
                $rebuilt_grid[$col][$row] = $boat_id;
                if (sizeof($grid) === $col) {
                    break;
                }
            }
        }

        //Check if the boat size is between 2 and 5 included
        if ($size < 2 || $size > 5) {
            return false;
        }

        $sizes[$size]++;
        $boat_id++;
    } while ($size !== 0);

    //Original grid and rebuilt grid must match
    //It won't match if there's multiple boats with the same id
    if ($grid !== $rebuilt_grid) {
        return false;
    }

    //Check if the number of boats is correct
    if ($sizes != $nb_boats) {
        return false;
    }

    //If everything is correct, return true
    return true;
}