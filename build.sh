#!/bin/sh -e

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

sed -i -e 's|<base href="/">|<base href="/admin/">|g' admin/dist/index.html
