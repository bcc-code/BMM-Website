<?php

$nodes = scandir("./translations/");

$translations = array();

foreach($nodes as $language)
{
    $path = "./translations/" . $language . "/";
    if ($language != "." && $language != ".." && is_dir($path))
    {
        if (is_file($path . "album_names.json"))
        {
            $t = json_decode(file_get_contents($path . "album_names.json"));
            unlink($path . "album_names.json");

            foreach($t as $key => $translation)
            {
                if (!empty($translation))
                    $translations[$key][$language] = $translation;
            }
        }
    }
}

file_put_contents("admin/app/translations/titles/album.json", json_encode($translations, JSON_PRETTY_PRINT));
