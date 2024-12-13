<?php

$code = 'a44506';
$player = 1;
$col = 0;
$row = 0;

require_once 'config.php';

//Get game id
$stmt = $conn->prepare("SELECT id FROM game_list WHERE code = ?");
$stmt->execute([$code]);
$id = $stmt->fetchColumn();

//Avoid cheating by playing before its opponent
$stmt = $conn->prepare("SELECT COUNT(*) FROM game_board WHERE id_game = ? AND player = ?");
$stmt->execute([$id, $player]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);
