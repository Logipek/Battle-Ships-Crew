<?php

function new_player($conn, $pseudo) {
    $uid = bin2hex(random_bytes(16));

    $stmt = $conn->prepare("INSERT INTO players (uid, pseudo) VALUES (?, ?)");
    $stmt->execute([$uid, $pseudo]);

    if ($stmt->rowCount() == 0) {
        return false;
    }

    return $uid;
}
