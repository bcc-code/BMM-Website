#!/bin/sh -e

[ -d build ] && rm -R build;

cd common;
npm update;
grunt updateCommonFiles;
cd ..;

cd admin;
npm update;
bower update;
grunt build;
cd ..;

cd client;
npm update;
bower update;
grunt build;
cd ..;

sed -e 's|<base href="/">|<base href="/admin/">|g' admin/dist/index.html > admin/dist/index.html.bak && mv admin/dist/index.html.bak admin/dist/index.html

mkdir build;
rm -R common/dist;
cp -R maintenance ./build/maintenance;
mv admin/dist ./build/admin;
mv client/dist ./build/client;
