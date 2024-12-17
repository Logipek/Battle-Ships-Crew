<?php

//Temp
$code = 'a44506';
$uid = 'c6ad1bfde2218b7d4b9bb764f6bbe950';
$col = 2;
$row = 4;

require_once 'config.php';

//Get game id and player order
$stmt = $conn->prepare("SELECT id, player_1_starts, uid FROM game_list l
                        INNER JOIN players p ON l.player_1 = p.id_player
                        WHERE code = ?");
$stmt->execute([$code]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    $error = "Partie non trouvée";
    //echo json_encode(['error' => $error]);
    echo $error;
    exit();
}

$id_game = $result['id'];
$player_1_starts = $result['player_1_starts'];
$player = ($uid == $result['uid']) ? 1 : 2;

//Avoid playing before the game starts
$stmt = $conn->prepare("SELECT * FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        INNER JOIN game_list l ON b.id_game = l.id
                        WHERE uid != ? AND code = ? LIMIT 1");
$stmt->execute([$uid, $code]);

if ($stmt->fetchColumn() == 0) {
    $error = "La partie n'a pas encore commencé";
    //echo json_encode(['error' => $error]);
    echo $error;
    exit();
}

//Avoid cheating by playing before its opponent
$stmt = $conn->prepare("SELECT uid, hit FROM game_inputs i
                        INNER JOIN players p ON i.id_player = p.id_player
                        INNER JOIN game_list l ON l.id = i.id_game
                        WHERE code = ? ORDER BY i.timestamp DESC LIMIT 1");
$stmt->execute([$code]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

//If it's the first input
if (!$result) {
    if ($player == 1 && !$player_1_starts) {
        $error = "Ce n'est pas encore à votre tour";
        //echo json_encode(['error' => $error]);
        echo $error;
        exit();
    }
    if ($player == 2 && $player_1_starts) {
        $error = "Ce n'est pas encore à votre tour";
        //echo json_encode(['error' => $error]);
        echo $error;
        exit();
    }
} else {
    if ($uid == $result['uid'] && $result['hit'] == 0) {
        $error = "Ce n'est pas encore à votre tour";
        //echo json_encode(['error' => $error]);
        echo $error;
        exit();
    }
    if ($uid != $result['uid'] && $result['hit'] == 1) {
        $error = "Ce n'est pas encore à votre tour";
        //echo json_encode(['error' => $error]);
        echo $error;
        exit();
    }
}

//Check if this input does not exist
$stmt = $conn->prepare("SELECT COUNT(*) FROM game_inputs i
                        INNER JOIN players p ON i.id_player = p.id_player
                        WHERE id_game = ? AND uid = ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $uid, $col, $row]);
if ($stmt->fetchColumn() > 0) {
    $error = "Cette case est déjà prise";
    //echo json_encode(['error' => $error]);
    echo $error;
    exit();
}

//Send input
$stmt = $conn->prepare("INSERT INTO game_inputs (id_game, id_player, col, row)
                        SELECT ?, id_player, ?, ? FROM players WHERE uid = ?");
$stmt->execute([$id_game, $col, $row, $uid]);

//Get the timestamp
$stmt = $conn->prepare("SELECT timestamp FROM game_inputs i
                        INNER JOIN players p ON i.id_player = p.id_player
                        WHERE id_game = ? AND uid = ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $uid, $col, $row]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

$timestamp = $result['timestamp'];

//Check if a boat is hit
$stmt = $conn->prepare("SELECT boat_id FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        WHERE id_game = ? AND uid != ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $uid, $col, $row]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    $return = 0;
    //echo json_encode(['return' => $return, 'timestamp' => $timestamp]);
    echo $return;
    exit();
}

$boat_id = $result['boat_id'];

//Update the board
$stmt = $conn->prepare("UPDATE game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        SET hit = 1
                        WHERE id_game = ? AND uid != ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $uid, $col, $row]);
$stmt = $conn->prepare("UPDATE game_inputs i
                        INNER JOIN players p ON i.id_player = p.id_player
                        SET hit = 1
                        WHERE id_game = ? AND uid = ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $uid, $col, $row]);

//Check if the boat is sunk
echo $id_game . " " . $uid . " " . $boat_id . "\n";
$stmt = $conn->prepare("SELECT COUNT(*) FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        WHERE id_game = ? AND uid != ? AND boat_id = ? AND hit = 0");
$stmt->execute([$id_game, $uid, $boat_id]);
if ($stmt->fetchColumn() == 0) {

    //Check if all boats are sunk
    $stmt = $conn->prepare("SELECT COUNT(*) FROM game_board b
                            INNER JOIN players p ON b.id_player = p.id_player
                            WHERE id_game = ? AND uid != ? AND hit = 0");
    $stmt->execute([$id_game, $uid]);
    if ($stmt->fetchColumn() == 0) {
        $return = 1;
        //echo json_encode(['return' => $return, 'timestamp' => $timestamp]);
        echo $return;
        exit();
    }

    //Return the boat position
    $stmt = $conn->prepare("SELECT col, row FROM game_board b
                            INNER JOIN players p ON b.id_player = p.id_player
                            WHERE id_game = ? AND uid != ? AND boat_id = ?");
    $stmt->execute([$id_game, $uid, $boat_id]);
    $pos = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $pos[] = ['col' => $row['col'], 'row' => $row['row']];
    }

    $return = $boat_id;
    //echo json_encode(['return' => $return, 'pos' => $pos, 'timestamp' => $timestamp]);
    echo $return;
    print_r($pos);
    exit();
}

$return = 2;
//echo json_encode(['return' => $return, 'timestamp' => $timestamp]);
echo $return;
exit();