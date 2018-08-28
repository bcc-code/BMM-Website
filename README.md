WELCOME AS DEVELOPER FOR THE BMM 2.0 PROJECT
============================================


INTRODUCTION
------------

The website consist of 3 separate projects

    * client - The page available for users
    * admin  - The page available for administrators
    * common - The common functions and stylesheet is used in client and admin


Basic techniques used for the project

    * yeoman        [workflow]      @see yeoman.io
    * AngularJS     [js framework]  @see angularjs.org
    * jQuery        [js library]    @see jquery.com
    * sass          [css extension] @see sass-lang.com


Before developing, you should specially get known to the yeoman workflow and angular framework.
We are glad for all contributions, feel free to help us with the project
____________________________________________


NOTE:
    If you want to test run the admin page, you should also install the
    API and replace one of the `knownServerUrls` in the file scripts/config.json.

CODING STLE
-----------

If you want to contribute to this project you should follow a specific coding style, this is:

* Use 2 spaces for identation
* Use '' (single quotes) and **not** "" (double quotes) for JS strings
* Do *NOT* use the [inline array annotation](https://docs.angularjs.org/guide/di#inline-array-annotation) for dependecy injection, instead rely on the name of the argument

SETUP DEVELOPER ENVIRONMENT
---------------------------

**1. Install [NodeJS](http://nodejs.org/) and open Terminal / CMD**

**2. Install Yeoman, Bower and Yeoman generator**
```
#!cmd
sudo npm install -g yo grunt-cli bower generator-webapp
```

**3. Get a copy of this repository**

**4. CD into 'common' via terminal/CMD and run the following commands**
```
#!cmd
sudo npm install
grunt updateCommonFiles
```

**5. CD into 'admin' and run the following commands**
```
#!cmd
sudo npm install
bower update
```

**6. CD into 'client' and run the following commands**
```
#!cmd
sudo npm install
bower update
```

Setup should now be completed
____________________________________________


DEBUG AND TEST RUN 'client' OR 'admin'
--------------------------------------

**1. Run your default browser with --disable-web-security**
    Chrome users can turn this on and off with an [extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)

**2. CD into client or admin folder (the folder you want to debug)**

3. Run command
```
#!cmd
grunt serve
```
... A new browser window should now open

4. Allow the unauthorized certificate to run with https

____________________________________________


MAKE STANDALONE BUILDS
----------------------

    1. Run command: grunt build
        The standalone is built into the dist folder

IMPORTANT NOTE:
    You should never edit the files located in the following folders:
    {admin/client}/scripts/common
    {admin/client}/styles/common
    {admin/client}/views/common
    {admin/client}/images/common

    Instead you should use the common folder in the root of the project. Inside common/app, a respective folder for each of these directories can be found inside common/app/{scripts/styles/views/images}

    By running the ```grunt --force``` command in the common folder, it updates the common files in both admin and client, and continues to watch for changes, and automatically updates once changes are detected. It is recommended to always have watching enabled while developing. It may be smart to setup your system to run the command automatically on startup, so it isn't forgotten later.