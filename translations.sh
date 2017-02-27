#!/bin/sh -e

cd translations

mv no nb

for language in *
do
    [ -f "$language/admin_en.json" ] && mv $language/admin_en.json ../admin/app/translations/$language.json
    [ -f "$language/bible_en.json" ] && mv $language/bible_en.json ../admin/app/translations/bible/$language.json
    [ -f "$language/BMM-Website.json" ] && mv $language/BMM-Website.json ../client/app/translations/$language.json
done

cd ..

php translations.php
