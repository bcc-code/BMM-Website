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
          _api.nextTracksToBePublished(podcast.id).then(function(tracks) {
            podcast.notifications = [];

            tracks.forEach(function(track) {
              $scope.anyNotification = true;

              var lastModifiedAt = new Date(track._meta.modified_at > track.published_at ? track._meta.modified_at : track.published_at);
              var scheduledTime = lastModifiedAt.getTime();
              if (currentDatetime > lastModifiedAt) {
                 scheduledTime += graceTime * 60000;
              }

              var minutesTilNextNotificationJob = timeBetweenNotificationJobs - (new Date(scheduledTime).getMinutes() % timeBetweenNotificationJobs);
              var secondsToRemoveToBeAbleToHaveSameBatchDates = new Date(scheduledTime).getSeconds();
              var batchDate = scheduledTime + (minutesTilNextNotificationJob * 60000) - (secondsToRemoveToBeAbleToHaveSameBatchDates * 1000);

              // Check if there is already a notification batch sending on batchDate
              var indexOfNotificationBatch = checkNotificationBatchAlreadyExists(podcast.notifications, batchDate);
              if (indexOfNotificationBatch != -1) {
                podcast.notifications[indexOfNotificationBatch].tracks.push(track);
                podcast.notifications[indexOfNotificationBatch].scheduledTime = batchDate;
              } else {
                podcast.notifications.push({ tracks: [track], scheduledTime: batchDate });
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
          });
        });

    }).fail(function() {
      doneLoading();
    });
  };

  init();
});
