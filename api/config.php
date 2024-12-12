<?php

try {
    $conn = new PDO("mysql:host=localhost;dbname=naval_brawl", "navalbrawl", "mM1l.h6c)MPwib1");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection to DB failed";
}
