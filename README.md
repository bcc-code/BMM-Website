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
    API and replace server link in client/app/scripts/app.js with your own.
    Same in admin/app/scripts/app.js

SETUP DEVELOPER ENVIRONMENT
---------------------------

**1. Install [NodeJS](http://nodejs.org/) and open Terminal / CMD**

**2. Install Yeoman**
```
#!cmd
sudo npm install -g yo
```

**3. Install Bower**
```
#!cmd
sudo npm install -g grunt-cli bower
```

**4. Install Yeoman generator**
```
#!cmd
sudo npm install --global generator-webapp
```

**5. Install [Ruby](https://www.ruby-lang.org/en/downloads/)**

**6. Install Compass**
```
#!cmd
gem update --system
gem install compass
```

**7. Get a copy of this repository**

**8. CD into 'common' via terminal/CMD and run the following commands**
```
#!cmd
npm install
bower install
grunt build
```

**9. CD into 'admin' and run the following commands**
```
#!cmd
npm install
bower install
```

**10. CD into 'client' and run the following commands**
```
#!cmd
npm install
bower install
```

Setup should now be completed
____________________________________________


DEBUG AND TEST RUN 'client' OR 'admin'
--------------------------------------

    1. Run your default browser with --disable-web-security
        Ex. linux: google-chrome --disable-web-security
    2. CD into client or admin folder (the folder you want to debug)
    3. Run command: grunt serve
        ... A new browser window should now open
    4. Allow the unauthorized certificate to run with https


____________________________________________


MAKE STANDALONE BUILDS
----------------------

    1. Run command: grunt build
        The standalone is build into the dist folder

IMPORTANT NOTE:
    By running this command in the common folder, you automatically update the common files
    in both admin and client.