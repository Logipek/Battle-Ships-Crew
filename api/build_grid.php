<?php

function build_grid($grid) {
    $inserts = [];

    for ($col = 0; $col < sizeof($grid); $col++) {
        for ($row = 0; $row < sizeof($grid[$col]); $row++) {
            if ($grid[$col][$row] !== 0) {
                $inserts[] = [
                    'boat_id' => $grid[$col][$row],
                    'col' => $col,
                    'row' => $row,
                ];
            }
        }
    }

    return $inserts;
}