#!/bin/sh -e

cd translations

mv no nb

for language in *
do
    [ -f "$language/admin_en.json" ] && mv $language/admin_en.json ../admin/app/translations/$language.json
    [ -f "$language/bible_en.json" ] && mv $language/bible_en.json ../admin/app/translations/bible/$language.json
    [ -f "$language/BMM-Website.json" ] && mv $language/BMM-Website.json ../client/app/translations/$language.json
    [ -f "$language/main.json" ] && mkdir -p ../translations_external/App/$language; mv $language/main.json $_
    [ -f "$language/notifications.json" ] && mkdir -p ../translations_external/Api/notifications/$language; mv $language/notifications.json $_
done

cd ..

php translations.php

rm -r translations
