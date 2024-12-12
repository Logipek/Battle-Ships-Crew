<?php

//Temp
$code = "a44506";
$player = 1;

require_once 'config.php';
require_once 'check_grid.php';

//Avoid duplicate requests
$stmt = $conn->prepare("SELECT COUNT(*) FROM game_board WHERE id_game = ? AND player = ?");
$stmt->execute([$code, $player]);
$exists = $stmt->fetchColumn() > 0;
if ($exists) {
    exit();
}

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

$stmt = $conn->prepare("SELECT id, nb_boats_2, nb_boats_3, nb_boats_4, nb_boats_5 FROM game_list WHERE code = ?");
$stmt->execute([$code]);
$result = $stmt->fetch();

$id = $result['id'];
$boats = [
    2 => $result['nb_boats_2'],
    3 => $result['nb_boats_3'],
    4 => $result['nb_boats_4'],
    5 => $result['nb_boats_5'],
];

if(!check_grid($grid, $boats)) {
    exit();
}

require_once 'build_grid.php';

$inserts = build_grid($grid);

$stmt = $conn->prepare("INSERT INTO game_board (id_game, player, boat_id, col, row) VALUES (:id_game, :player, :boat_id, :col, :row)");
foreach ($inserts as $insert) {
    print_r($insert);
    $stmt->execute([
        'id_game' => $id,
        'player' => $player,
        'boat_id' => $insert['boat_id'],
        'col' => $insert['col'],
        'row' => $insert['row'],
    ]);
}
