<?php

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['uid']) || !isset($data['code']) || !isset($data['grid'])) {
    $error = "Données manquantes";
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

$uid = htmlspecialchars($data['uid']);
$code = htmlspecialchars(strtoupper($data['code']));
$grid = $data['grid'];

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
    $error = "Grille déjà envoyée";
    echo json_encode(['success' => false, 'error' => $error]);
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
    $error = "Grille invalide";
    echo json_encode(['success' => false, 'error' => $error]);
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

echo json_encode(['success' => true]);
exit();