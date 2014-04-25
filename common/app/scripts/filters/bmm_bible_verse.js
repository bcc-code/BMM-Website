'use strict';

angular.module('bmmLibApp')
  .filter('bmmBibleVerse', ['bmmTranslator', function (bmmTranslator) {
    return function (input) {

      var output=[];
      if (typeof input!=='undefined'&&input!=='') {

        //Comparable removes unnesesary characters for better comparision
        var comparable={};

        //Make the comparables
        $.each(bmmTranslator.getBible().books, function(key) {

          //Make sure translation is in lowercase
          var compare = this.toLowerCase();
          //Filter out strange characters (Blacklist)
          //Whitelist is not recomended as multiple languages is suported
          compare = compare.replace(/[\s\.¦:;¶*~"'_\\\/\-\,><!$£#¤%&=+?|{}\[\]¨^`´@]/g,'');
          //Use the same key
          comparable[key] = compare;

        });

        /**
         *  Make lowercase, remove all dots and spaces
         *  Split string into array by commas
         */
        input = input.toLowerCase();
        input = input.replace(/[\.\s]/g,'');
        input = input.split('|');

        //For each comma separated string - OPEN TO ALLOW MULTIPLE BOOKS
        $.each(input, function() {

          //Sort by book, chapter and verses
          var book={}, data, bookEnd;

          data = this;

          //Find length of book
          bookEnd=-1;
          for (var i=0; i < data.length; i++) {
            //If the third character or greater is numeric
            if (i>1&&data[i].match(/^\d+$/)) {
              bookEnd=i-1; //Start of chapter found
              break;
            }
          }

          //If not start of chapter was found
          if (bookEnd===-1) {
            book.name = data;
            data = '';
          //If start of chapter was found
          } else {
            book.name = data.substring(0,(bookEnd+1));
            data = data.substring(bookEnd+1);
          }

          //Filter out strange characters (Blacklist)
          //Whitelist is not recomended as multiple languages is suported
          book.name = book.name.replace(/[¦:;¶*~"'_\\\/\-\,><!$£#¤%&=+?|{}\[\]¨^`´@]/g,'');

          /**
           *  ---- BOOK IS NOW FOUND, CHAPTER NEXT ----
           */
          
          book.chapters = [];

          //Set ; + , as :
          data = data.replace(/[;+\,]/g,':');
          //Remove all characters thats not in the list
          data = data.replace(/[^0-9&:\-]/g,'');

          //Split chapters based on &
          $.each(data.split('&'), function() {

            var results = this.split(':'), chapter={};
            chapter.verses=[];

            $.each(results, function(index) {

              //First in array equals chapter
              if (index===0&&this>0) {
                chapter.number = Number(this);
              //Other in array equals verses
              } else {
                
                //If single verse
                if (this.indexOf('-')===-1) {
                  if (this>0) {
                    if ($.inArray(Number(this),chapter.verses)===-1) {
                      chapter.verses.push(Number(this));
                    }
                  }
                //If verses [from-to]
                } else {
                  var verseFromTo = this.split('-');
                  if (verseFromTo[0]!=='') {

                    //If last verse is less than first, make it equal
                    if (verseFromTo[1]===''||parseInt(verseFromTo[1],10)<parseInt(verseFromTo[0],10)) {
                      verseFromTo[1] = verseFromTo[0];
                    }

                    //Add all verses
                    for (var i = parseInt(verseFromTo[0],10); i<=parseInt(verseFromTo[1],10); i++) {
                      if (i>0) {
                        //If not allready in array
                        if ($.inArray(Number(i),chapter.verses)===-1) {
                          chapter.verses.push(Number(i));
                        }
                        
                      }
                    }

                  }
                  
                }

              }

            });

            book.chapters.push(chapter);

          });

          $.each(comparable, function(key) {

            if (this.indexOf(book.name)!==-1) {
              book.name = this;
              book.shortcode = bmmTranslator.getBible().shortcodes[key];
              book.key = key;
              output.push(book);
              return false;
            }

          });

        });
      }

      return output;

    };
  }]);
