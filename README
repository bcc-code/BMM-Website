
WELCOME AS DEVELOPER FOR THE BMM 2.0 PROJECT
____________________________________________


INTRODUCTION

The website consist of 3 separate projects

    * client - The page available for users
    * admin  - The page available for administrators
    * common - The common functions/stylesheet used in client and admin


Basic techniques used for the project

    * yeoman        [workflow]      @see yeoman.io
    * AngularJS     [js framework]  @see angularjs.org
    * jQuery        [js library]    @see jquery.com
    * sass          [css extension] @see sass-lang.com


Before developing, you should specially get known to the yeoman workflow and angular framework.
We apologize the lack of documentation, the code is temporary a bit hard to get into.
Anyway, we are happy for all contributions, so feel free to help us with the project :D
____________________________________________


NOTE:
    If you want to test run the admin page, you should also install the
    API and replace server link in client/app/scripts/app.js with your own.
    Same in admin/app/scripts/app.js

SETUP DEVELOPER ENVIRONMENT

    1. Install the following components
        * yeoman with all its dependencies @see yeoman.io
        * phantomJS
    2. Get a copy of this repository (unless you already have one)
    3. CD first into 'common' folder via terminal/CMD and run the following in order:

        npm install
        bower install
        grunt build

    4. Now CD into admin and client, then run the following commands in both folders:

        npm install
        bower install

Congrats, your setup is now complete ;)
____________________________________________


DEBUG AND TEST RUN 'client' OR 'admin'

    1. Run your default browser with --disable-web-security
        Ex. linux: google-chrome --disable-web-security
    2. CD into client or admin folder (the folder you want to debug)
    3. Run command: grunt serve
        ... A new browser window should now open
    4. Allow the unauthorized certificate to run with https


____________________________________________


MAKE STANDALONE BUILDS

    1. Run command: grunt build
        The standalone is build into the dist folder

IMPORTANT NOTE:
    By running this command in the common folder, you automatically update the common files
    in both admin and client.