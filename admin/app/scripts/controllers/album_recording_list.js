'use strict';

/*jshint -W083 */

angular.module('bmmApp')
    .controller('AlbumRecordingListCtrl', function ($scope, $filter, $route, $routeParams, _api, _quickMenu, _play, _init) {

        $scope.model = false;

        $scope.children = false;

        $scope.fetchDocument = function (id, type, isRaw) {
            switch (type) {
                case 'album':
                    if (isRaw) {
                        return _api.albumGet(id, {raw: true});
                    } else {
                        return _api.albumGet(id, {
                            unpublished: 'show'
                        });
                    }
                    break;

                case 'track':
                    if (isRaw) {
                        return _api.trackGet(id, {raw: true});
                    } else {
                        return _api.trackGet(id, {
                            unpublished: 'show'
                        });
                    }
                    break;
            }
        };

        $scope.save = function () {
            $scope.can_save = false;

            for (var key in $scope.children) {
                if ($scope.children.hasOwnProperty(key)) {
                    (function () {
                        var child = $scope.children[key].raw;

                        if (child.type === 'track') {

                            var isAudioEnabled = $scope.trackHasAudioEnabled(child);
                            var isVideoEnabled = $scope.trackHasVideoEnabled(child);

                            _api.trackGet(child.id, {raw: true}).done(function (toApi) {
                                var trackId = toApi.id;

                                //Delete parts that's unexpected by the API
                                delete toApi._meta;
                                delete toApi.id;

                                var somethingHasChanged = false;
                                for (var i in toApi.translations) {
                                    if (toApi.translations.hasOwnProperty(i)) {
                                        var translation = toApi.translations[i];

                                        delete translation._meta;

                                        // Updating the visibility of media
                                        for (var j in translation.media) {
                                            if (translation.media.hasOwnProperty(j)) {
                                                var media = translation.media[j];

                                                if (media.type === 'audio' && media.is_visible !== isAudioEnabled) {
                                                    somethingHasChanged = true;
                                                    media.is_visible = isAudioEnabled;
                                                }
                                                else if (media.type === 'video' && media.is_visible !== isVideoEnabled) {
                                                    somethingHasChanged = true;
                                                    media.is_visible = isVideoEnabled;
                                                }
                                            }
                                        }

                                        // Updating the titles
                                        var newTranslation = null;
                                        child.translations.some(function (t) {
                                            if (t.language === translation.language) {
                                                newTranslation = t;
                                                return true;
                                            }
                                        });

                                        if (newTranslation !== null && translation.title !== newTranslation.title) {
                                            somethingHasChanged = true;
                                            translation.title = newTranslation.title;
                                        }
                                    }
                                }

                                // Check if the comments for the track have changed
                                if (toApi.comment !== child.comment) {
                                    somethingHasChanged = true;
                                    toApi.comment = child.comment;
                                }

                                // Check if the comments for the relations (bible-relations mostly ...)
                                for (var k in toApi.rel) {
                                    if (toApi.rel.hasOwnProperty(k)) {
                                        var rel = toApi.rel[k];

                                        // TODO: This might kick out if we have two relations, pointing to the same stuff ...
                                        var obj1 = angular.copy(rel);
                                        delete obj1.comment;

                                        var rel2 = null;
                                        var found = child.rel.some(function(r) {
                                            var obj2 = angular.copy(rel2 = r);
                                            delete obj2.translated_book;
                                            delete obj2.comment;
                                            if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
                                                return true;
                                            }
                                        });

                                        if (found && rel.comment !== rel2.comment) {
                                            somethingHasChanged = true;
                                            rel.comment = rel2.comment;
                                        }
                                    }
                                }

                                // Only update if something actually has changed. Otherwise we just dawdle away ;)
                                if (somethingHasChanged) {
                                    _api.trackPut(trackId, toApi);
                                }
                            });
                        }
                    })();
                }
            }

            $scope.model = false;
            $scope.children = false;
            $scope.loadModel();

            $scope.can_save = true;
        };

        $scope.play = function (bundle, mediaType) {

            var track = bundle.translated;

            track.audio = false;
            track.video = false;
            track[mediaType] = true;

            var file = null;
            if (bundle.original_translation.media) {
                bundle.original_translation.media.some(function (media) {
                    if (media.type === mediaType) {
                        return media.files.some(function (f) {
                            file = f;
                            return true;
                        });
                    }
                });
            }

            // If the original file does not exist, just play a random one.
            if (!file) {
                return;
            }

            track[(mediaType+'s')] = [{
                file: $filter('_protectedURL')(file.path),
                type: file.mime_type,
                duration: file.duration,
                name: file.mime_type
            }];

            track.language = bundle.original_translation.language;

            _play.setPlay([track], 0);
        };

        $scope.trackHasAudio = function (rawTrack) {
            return $scope.trackHasMedia(rawTrack, 'audio');
        };

        $scope.trackHasVideo = function (rawTrack) {
            return $scope.trackHasMedia(rawTrack, 'video');
        };

        $scope.trackHasMedia = function (rawTrack, mediaType) {
            if (rawTrack) {
                return rawTrack.translations.some(function (translation) {
                    if (translation.media) {
                        return translation.media.some(function (media) {
                            return media.type === mediaType;
                        });
                    }
                });
            }
        };

        $scope.trackHasAudioEnabled = function (rawTrack) {
            return $scope.trackHasMediaEnabled(rawTrack, 'audio');
        };

        $scope.trackHasVideoEnabled = function (rawTrack) {
            return $scope.trackHasMediaEnabled(rawTrack, 'video');
        };

        $scope.trackHasMediaEnabled = function (rawTrack, mediaType) {
            if (rawTrack) {
                return rawTrack.translations.every(function (translation) {
                    if (translation.media) {
                        // Check if media is hidden somewhere and negate the result.
                        // This will return TRUE on languages not having this media. New media is visible by default.
                        return !translation.media.some(function (media) {
                            if (media.type === mediaType) {
                                return !media.is_visible;
                            }
                        });
                    }
                });
            }
        };

        $scope.toggleHasAudioEnabled = function(rawTrack) {
            $scope.toggleHasMediaEnabled(rawTrack, 'audio');
        };

        $scope.toggleHasVideoEnabled = function(rawTrack) {
            $scope.toggleHasMediaEnabled(rawTrack, 'video');
        };

        $scope.toggleHasMediaEnabled = function(rawTrack, mediaType) {
            if (rawTrack) {
                var newValue = !$scope.trackHasMediaEnabled(rawTrack, mediaType);

                rawTrack.translations.forEach(function (translation) {
                    if (translation.media) {
                        translation.media.forEach(function (media) {
                            if (media.type === mediaType) {
                                media.is_visible = newValue;
                            }
                        });
                    }
                });
            }
        };

        $scope.loadModel = function() {
            var d1 = $scope.fetchDocument($routeParams.id, 'album', true);
            var d2 = $scope.fetchDocument($routeParams.id, 'album', false);

            $.when(d1, d2)
                .done(function (model, translatedModel) {

                    var list = [];
                    var children = {};

                    var addDocument = function (model, isRaw) {
                        if (typeof children[model.type + model.id] === 'undefined') {
                            children[model.type + model.id] = {};
                        }

                        if (isRaw) {
                            children[model.type + model.id].raw = model;

                            model.translations.some(function (translation) {
                                if (translation.language === model.original_language) {
                                    children[model.type + model.id].original_translation = translation;
                                    return true;
                                }
                            });

                            if (model.type === 'track') {
                                children[model.type + model.id].relations = {
                                    bible: [],
                                    composer: [],
                                    lyricist: [],
                                    interpret: [],
                                    songbook: []
                                };
                                model.rel.forEach(function (relation) {
                                    if (relation.type === 'bible') {
                                        relation.translated_book = _init.bible.books[relation.book];
                                    } else if (relation.type === 'songbook') {
                                        if (relation.name === 'herrens_veier') {
                                            relation.name = 'HV';
                                        } else {
                                            relation.name = 'MB';
                                        }
                                    }

                                    if(!children[model.type + model.id].relations[relation.type])
                                        children[model.type + model.id].relations[relation.type] = [];

                                    children[model.type + model.id].relations[relation.type].push(relation);
                                });
                            }
                        } else {
                            children[model.type + model.id].translated = model;
                        }
                    };

                    var fetchChildren = function (parent) {
                        parent.children.forEach(function (child) {
                            list.push($scope.fetchDocument(child.id, child.type, true).done(function (model) {
                                addDocument(model, true);
                            }));

                            // If it's a track, there's no need to re-fetch the translated track, as we have it in the album already.
                            if (child.type !== 'track') {
                                list.push($scope.fetchDocument(child.id, child.type, false).done(function (model) {
                                    addDocument(model, false);

                                    fetchChildren(model);
                                }));
                            } else {
                                addDocument(child, false);
                            }
                        });
                    };

                    fetchChildren(translatedModel[0]);

                    $.when.apply($, list).done(function () {
                        $scope.$apply(function () {
                            $scope.children = children;
                            $scope.model = model[0];
                            $scope.translatedModel = translatedModel[0];
                            _quickMenu.setMenu($scope.model.published_at.substring(0, 4), $scope.model.parent_id, $scope.model.id);

                            $scope.can_save = true;
                        });
                    });
                });
        };

        $scope.loadModel();
    });
