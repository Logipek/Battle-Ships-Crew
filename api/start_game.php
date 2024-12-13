<?php

//Temp
$pseudo = 'test2';
$_GET['code'] = 'ffebfa';

require_once 'config.php';
require_once 'new_player.php';

if (!isset($_GET['code'])) {
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

    //Temp
    echo $code . "\n";
    echo $uid . "\n";

    exit();
}

$code = htmlspecialchars(strtoupper($_GET['code']));

$stmt = $conn->prepare("SELECT COUNT(*) FROM game_list WHERE code = ? AND player_2 IS NULL");
$stmt->execute([$code]);
$exists = $stmt->fetchColumn() > 0;

if (!$exists) {
    echo "Game not found";
    exit();
}

$uid = new_player($conn, $pseudo);

$stmt = $conn->prepare("UPDATE game_list SET player_2 = (SELECT id_player FROM players WHERE uid = ?) WHERE code = ?");
$stmt->execute([$uid, $code]);

echo "Game started";