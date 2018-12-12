'use strict';

angular.module('bmmApp')
  .controller('NotificationsCtrl', function(
    $scope,
    $routeParams,
    _api,
    _init
  ) {
  $scope.init = _init;
  $scope.anyNotification = false;

  var graceTime = _init.config.graceTimeNotificationJob;
  var timeBetweenNotificationJobs = 5;
  var currentDatetime = new Date();

  function doneLoading() {
    $scope.loading = false;
  }

  function checkNotificationBatchAlreadyExists(notifications, batchDate) {
    var batchIndex = -1;
    notifications.forEach(function(notification, index) {
      if (notification.scheduledTime == batchDate) {
        batchIndex = index;
        return;
      }
    });
    return batchIndex;
  }

  function init() {
    $scope.loading = true;
    var podcastsLoaded = 0;

    _api.podcastsGet().then(function(podcasts) {
      $scope.podcasts = podcasts;

        podcasts.forEach(function(podcast) {
          _api.nextTracksToBePublished(podcast.id).then(function(tracks) { // Will get just unnotified tracks
            podcast.notifications = [];

            tracks.forEach(function(track) {
              $scope.anyNotification = true;

              var graceTimeWasUsed;
              var lastModifiedAt = new Date(track._meta.modified_at > track.published_at ? track._meta.modified_at : track.published_at);
              var scheduledTime = lastModifiedAt.getTime();

              if (Math.round((((new Date(track.published_at) - new Date(track._meta.modified_at)) % 86400000) % 3600000) / 60000) > graceTime) {
                  // The track was published with a DateTime in the future
                  graceTimeWasUsed = false;
              } else {
                  // The track was published or last modified in the near future (less than the graceTime) or in the past
                  scheduledTime += graceTime * 60000;
                  graceTimeWasUsed = true;
              }

              var minutesTilNextNotificationJob = timeBetweenNotificationJobs - (new Date(scheduledTime).getMinutes() % timeBetweenNotificationJobs);
              var secondsToRemoveToBeAbleToHaveSameBatchDates = new Date(scheduledTime).getSeconds();
              var batchDate = scheduledTime + (minutesTilNextNotificationJob * 60000) - (secondsToRemoveToBeAbleToHaveSameBatchDates * 1000);

              // Check if there is already a notification batch sending on batchDate
              var indexOfNotificationBatch = checkNotificationBatchAlreadyExists(podcast.notifications, batchDate);
              if (indexOfNotificationBatch != -1) {
                podcast.notifications[indexOfNotificationBatch].tracks.push(track);
                podcast.notifications[indexOfNotificationBatch].scheduledTime = batchDate;
                podcast.notifications[indexOfNotificationBatch].graceTimeWasUsed = graceTimeWasUsed;
              } else {
                podcast.notifications.push({ tracks: [track], scheduledTime: batchDate, graceTimeWasUsed: graceTimeWasUsed });
              }

              track.languages = [];
              track.translations.forEach(function(translation) {
                if (translation.language == track.original_language) {
                  track.title = translation.title;
                }
                if (translation.is_visible) {
                  track.languages.push(translation.language);
                }
              });
            });

            if (++podcastsLoaded == podcasts.length) {
              doneLoading();
            }
          }).fail(function(){
            doneLoading();
          });
        });

    }).fail(function() {
      doneLoading();
    });
  };

  init();
});
