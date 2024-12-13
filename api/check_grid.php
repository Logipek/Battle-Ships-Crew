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
    for ($row = 0; $row < sizeof($grid); $row++) {
        array_push($rebuilt_grid, []);
        for ($col = 0; $col < sizeof($grid[$row]); $col++) {
            array_push($rebuilt_grid[$row], 0);
        }
    }

    //Id 0 reserved for misses (cells colored in blue)
    //Id 1 reserved for empty cells (cells colored in white)
    //Id 2 reserved for hits (cells colored in red/yellow)
    //Ids higher than 3 are for revealed boats
    $boat_id = 3;

    do {
        $found = true;
        $size = 0;
        $row = 0;
        $col = 0;
        
        //Look for the boat id from right to left then top to bottom
        while ($grid[$row][$col] !== $boat_id) {
            $col++;
            if (sizeof($grid[$row]) === $col) {
                $col = 0;
                $row++;
            }
            if (sizeof($grid) === $row) {
                $found = false;
                break;
            }
        }

        if (!$found) {
            break;
        }

        $rebuilt_grid[$row][$col] = $boat_id;
        $size++;

        //Look for a horizontal boat
        ////echo $col . " " . $row . "\n";
        if (sizeof($grid[$row]) > $col + 1) { //10 > 8
            while ($grid[$row][$col + 1] === $boat_id) {
                ////echo "Ligne " . $col . " " . $row . "\n";
                $size++;
                $col++;
                $rebuilt_grid[$row][$col] = $boat_id;
                if (sizeof($grid[$row]) === $col + 1) {
                    break;
                }
            }
        }
        //Look for a vertical boat
        if ($size === 1) {
            while ($grid[$row + 1][$col] === $boat_id) {
                ////echo "Colonne " . $col . " " . $row . "\n";
                $size++;
                $row++;
                $rebuilt_grid[$row][$col] = $boat_id;
                if (sizeof($grid) === $row + 1) {
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
    } while ($found);

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