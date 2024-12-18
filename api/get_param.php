<?php

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['code']) || !isset($data['uid'])) {
    $error = "Pas de données";
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

$code = htmlspecialchars(strtoupper($data['code']));
$uid = htmlspecialchars($data['uid']);

require_once 'config.php';

//Get game parameters
error_log("code: $code, uid: $uid");
$stmt = $conn->prepare("SELECT nb_boats_2, nb_boats_3, nb_boats_4, nb_boats_5 FROM game_list l
                        INNER JOIN players p1 ON l.player_1 = p1.id_player
                        INNER JOIN players p2 ON l.player_2 = p2.id_player
                        WHERE code = ? AND (p1.uid = ? OR p2.uid = ?)");
$stmt->execute([$code, $uid, $uid]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    $error = "Erreur lors de la récupération des paramètres";
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

if ($result['nb_boats_2'] == null || $result['nb_boats_3'] == null || $result['nb_boats_4'] == null || $result['nb_boats_5'] == null) {
    //Paramètres non définis
    echo json_encode(['success' => false]);
    exit();
}

echo json_encode(['success' => true, 'sizeTwo' => $result['nb_boats_2'], 'sizeThree' => $result['nb_boats_3'], 'sizeFour' => $result['nb_boats_4'], 'sizeFive' => $result['nb_boats_5']]);
exit();