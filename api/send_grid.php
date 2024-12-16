<?php

//Temp
$code = "a44506";
$uid = '6de0dc62da51ecd09a3b2f1440540799';
$grid = [
    [0, 0, 0, 3, 0, 8, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 8, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 8, 0, 0, 0, 9],
    [0, 6, 0, 0, 0, 8, 0, 0, 0, 9],
    [0, 6, 0, 0, 0, 8, 0, 0, 0, 9],
    [0, 6, 0, 0, 0, 0, 0, 0, 0, 9],
    [0, 6, 0, 0, 0, 0, 0, 0, 0, 9],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 0, 0, 4, 4, 4],
    [0, 7, 0, 0, 0, 5, 5, 0, 0, 0],
];

require_once 'config.php';
require_once 'check_grid.php';

//Get game id
$stmt = $conn->prepare("SELECT id FROM game_list WHERE code = ?");
$stmt->execute([$code]);
$id = $stmt->fetchColumn();

//Avoid duplicate requests
$stmt = $conn->prepare("SELECT COUNT(*) FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player WHERE id_game = ? AND uid = ?");
$stmt->execute([$id, $uid]);
$exists = $stmt->fetchColumn() > 0;
if ($exists) {
    echo "Grid already sent";
    exit();
}

$stmt = $conn->prepare("SELECT nb_boats_2, nb_boats_3, nb_boats_4, nb_boats_5 FROM game_list WHERE code = ?");
$stmt->execute([$code]);
$result = $stmt->fetch();
$boats = [
    2 => $result['nb_boats_2'],
    3 => $result['nb_boats_3'],
    4 => $result['nb_boats_4'],
    5 => $result['nb_boats_5'],
];

if(!check_grid($grid, $boats)) {
    echo "Invalid grid";
    exit();
}

require_once 'build_grid.php';

$inserts = build_grid($grid);

$stmt = $conn->prepare("INSERT INTO game_board (id_game, id_player, boat_id, col, row)
                        SELECT :id_game, id_player, :boat_id, :col, :row FROM players WHERE uid = :uid");
foreach ($inserts as $insert) {
    $stmt->execute([
        'id_game' => $id,
        'boat_id' => $insert['boat_id'],
        'col' => $insert['col'],
        'row' => $insert['row'],
        'uid' => $uid,
    ]);
}

echo "Grid sent";
