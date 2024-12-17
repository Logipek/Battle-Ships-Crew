<?php

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['pseudo'])) {
    $error = "Pas de données";
    json_encode(['success' => false, 'error' => $error]);
    exit();
}

$code = htmlspecialchars(strtoupper($data['code']));
$pseudo = htmlspecialchars($data['pseudo']);

require_once 'config.php';
require_once 'new_player.php';

if (!isset($_GET['room'])) {
    //Generate a unique room code
    do {
        $code = strtoupper(bin2hex(random_bytes(3)));

        $stmt = $conn->prepare("SELECT COUNT(*) FROM game_list WHERE code = ?");
        $stmt->execute([$code]);

        $exists = $stmt->fetchColumn() > 0;
    } while ($exists);

    //Create the player
    $uid = new_player($conn, $pseudo);

    //Decide which player starts
    //1 = player 1 starts, 0 = player 2 starts
    $player_1_starts = rand(0, 1);
    
    $stmt = $conn->prepare("INSERT INTO game_list (code, player_1, player_1_starts) SELECT ?, id_player, ? FROM players WHERE uid = ?");
    $stmt->execute([$code, $player_1_starts, $uid]);

    echo json_encode(['success' => true, 'code' => $code, 'uid' => $uid]);

    exit();
}

$code = htmlspecialchars(strtoupper($_GET['room']));

$stmt = $conn->prepare("SELECT COUNT(*) FROM game_list WHERE code = ? AND player_2 IS NULL");
$stmt->execute([$code]);
$exists = $stmt->fetchColumn() > 0;

if (!$exists) {
    $error = "La salle n'existe pas ou est déjà pleine";
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

$uid = new_player($conn, $pseudo);

$stmt = $conn->prepare("UPDATE game_list SET player_2 = (SELECT id_player FROM players WHERE uid = ?) WHERE code = ?");
$stmt->execute([$uid, $code]);

echo json_encode(['success' => true, 'uid' => $uid]);
exit();