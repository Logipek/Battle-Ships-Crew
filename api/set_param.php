<?php

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['sizeTwo']) || !isset($data['sizeThree']) || !isset($data['sizeFour']) || !isset($data['sizeFive']) || !isset($data['code']) || !isset($data['uid'])) {
    $error = "Pas de données";
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

$sizeTwo = htmlspecialchars($data['sizeTwo']);
$sizeThree = htmlspecialchars($data['sizeThree']);
$sizeFour = htmlspecialchars($data['sizeFour']);
$sizeFive = htmlspecialchars($data['sizeFive']);
$code = htmlspecialchars(strtoupper($data['code']));
$uid = htmlspecialchars($data['uid']);

require_once 'config.php';

//Check if player 1 is the one sending the parameters
$stmt = $conn->prepare("SELECT id FROM game_list l
                        INNER JOIN players p ON l.player_1 = p.id_player
                        WHERE code = ? AND uid = ?");
$stmt->execute([$code, $uid]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    $error = "Erreur lors de l'envoi des paramètres";
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

//Update game parameters
$stmt = $conn->prepare("UPDATE game_list SET nb_boats_2 = ?, nb_boats_3 = ?, nb_boats_4 = ?, nb_boats_5 = ? WHERE code = ?");
$stmt->execute([$sizeTwo, $sizeThree, $sizeFour, $sizeFive, $code]);

echo json_encode(['success' => true]);
exit();