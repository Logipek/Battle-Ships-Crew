<?php

//Temp
$code = 'a44506';
$player = 'c6ad1bfde2218b7d4b9bb764f6bbe950';
$col = 0;
$row = 0;

require_once 'config.php';

//Get game id and player order
$stmt = $conn->prepare("SELECT id, player_1_starts FROM game_list WHERE code = ?");
$stmt->execute([$code]);

if ($stmt->fetchColumn() == 0) {
    $error = "Partie non trouvée";
    //echo json_encode(['error' => $error]);
    echo $error;
    exit();
}

$result = $stmt->fetch(PDO::FETCH_ASSOC);
$id_game = $result['id'];
$player_1_starts = $result['player_1_starts'];

//Avoid playing before the game starts
$stmt = $conn->prepare("SELECT * FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        INNER JOIN game_list l ON b.id_game = l.id
                        WHERE uid != ? AND code = ? LIMIT 1");
$stmt->execute([$player, $code]);

if ($stmt->fetchColumn() == 0) {
    $error = "La partie n'a pas encore commencé";
    //echo json_encode(['error' => $error]);
    echo $error;
    exit();
}

//Avoid cheating by playing before its opponent
// $stmt = $conn->prepare("SELECT COUNT(*) FROM game_list WHERE id_game = ? AND player = ?");
// $stmt->execute([$id, $player]);
// $result = $stmt->fetch(PDO::FETCH_ASSOC);



//Check if this input does not exist
$stmt = $conn->prepare("SELECT COUNT(*) FROM game_inputs i
                        INNER JOIN players p ON i.id_player = p.id_player
                        WHERE id_game = ? AND uid = ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $player, $col, $row]);
if ($stmt->fetchColumn() > 0) {
    $error = "Cette case est déjà prise";
    //echo json_encode(['error' => $error]);
    echo $error;
    exit();
}

//Send input
$stmt = $conn->prepare("INSERT INTO game_inputs (id_game, id_player, col, row)
                        SELECT ?, id_player, ?, ? FROM players WHERE uid = ?");
echo "On n'envoie plus l'input pour l'instant\n";
//$stmt->execute([$id_game, $col, $row, $player]);

//Check if a boat is hit
echo $id_game . ' ' . $player . ' ' . $col . ' ' . $row . "\n";
$stmt = $conn->prepare("SELECT boat_id FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        WHERE id_game = ? AND uid != ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $player, $col, $row]);
if ($stmt->fetchColumn() == 0) {
    $return = 0;
    //echo json_encode(['return' => $return]);
    echo $return;
    exit();
}
$boat_id = $stmt->fetch(PDO::FETCH_ASSOC)['boat_id'];

//Update the board
$stmt = $conn->prepare("UPDATE game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        SET hit = 1
                        WHERE id_game = ? AND uid != ? AND col = ? AND row = ?");
$stmt->execute([$id_game, $player, $col, $row]);

//Check if the boat is sunk
$stmt = $conn->prepare("SELECT col, row FROM game_board b
                        INNER JOIN players p ON b.id_player = p.id_player
                        WHERE id_game = ? AND uid != ? AND boat_id = ? AND hit = 0");
$stmt->execute([$id_game, $player, $boat_id]);
if ($stmt->fetchColumn() > 0) {

    //Check if all boats are sunk
    $stmt = $conn->prepare("SELECT COUNT(*) FROM game_board b
                            INNER JOIN players p ON b.id_player = p.id_player
                            WHERE id_game = ? AND uid != ? AND hit = 0");
    $stmt->execute([$id_game, $player]);
    if ($stmt->fetchColumn() == 0) {
        $return = 1;
        //echo json_encode(['return' => $return]);
        echo $return;
        exit();
    }
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $pos = [];
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $pos[] = ['col' => $row['col'], 'row' => $row['row']];
    }

    $return = $boat_id;
    //echo json_encode(['return' => $return, 'pos' => $pos]);
    echo $return;
    exit();
}

$return = 2;
//echo json_encode(['return' => $return]);
echo $return;
exit();