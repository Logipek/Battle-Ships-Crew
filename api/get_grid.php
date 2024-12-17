<?php

//Temp
$code = 'a44506';
$uid = 'c6ad1bfde2218b7d4b9bb764f6bbe950';

require_once 'config.php';

//Get grid
$stmt = $conn->prepare("SELECT boat_id, col, row FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        INNER JOIN game_list l ON b.id_game = l.id
                        WHERE code = ? AND uid = ?");
$stmt->execute([$code, $uid]);
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$result) {
    $error = "Partie non trouvée";
    echo json_encode(['success' => false, 'error' => $error]);
    echo $error;
    exit();
}

echo json_encode(['success' => true, 'board' => $result]);
exit();