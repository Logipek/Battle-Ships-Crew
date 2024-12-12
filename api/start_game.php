<?php

require_once 'config.php';

if (!isset($_GET['code'])) {
    do {
        $code = bin2hex(random_bytes(3));
        $stmt = $conn->prepare("SELECT COUNT(*) FROM game_list WHERE code = ?");
        $stmt->execute([$code]);
        $exists = $stmt->fetchColumn() > 0;
    } while ($exists);
    
    $stmt = $conn->prepare("INSERT INTO game_list (code) VALUES (?)");
    $stmt->execute([$code]);

    echo $code;

    exit();
}

$code = htmlspecialchars($_GET['code']);

$stmt = $conn->prepare("SELECT COUNT(*) FROM game_list WHERE code = ? AND available = 1");
$stmt->execute([$code]);
$exists = $stmt->fetchColumn() > 0;

if (!$exists) {
    echo "Game not found";
    exit();
}

$stmt = $conn->prepare("UPDATE game_list SET available = 0 WHERE code = ?");
$stmt->execute([$code]);

echo "Game started";