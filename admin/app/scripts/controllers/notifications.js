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
  $scope.graceTime = 0;
  $scope.batchPeriod = 0;

  var timeBetweenNotificationJobs = 5;
  var currentDatetime = new Date();

  function doneLoading() {
    $scope.loading = false;
  }

  function checkNotificationBatchAlreadyExists(notifications, scheduledTime) {
    var batchIndex = -1;

    notifications.forEach(function(notification, index) {
      if (Math.abs(scheduledTime - notification.scheduledTime) / 60000 <= $scope.batchPeriod) {
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
          _api.nextTracksToBePublished(podcast.id).then(function(viewModel) { // Will get just unnotified tracks
            podcast.notifications = [];
            $scope.graceTime = viewModel.grace_time_notification_job;
            $scope.batchPeriod = viewModel.notification_batch_period;

            viewModel.tracks.forEach(function(track) {
              $scope.anyNotification = true;

              var graceTimeWasUsed;
              var lastModifiedAt = new Date(track._meta.modified_at > track.published_at ? track._meta.modified_at : track.published_at);
              var scheduledTime = lastModifiedAt.getTime();

              if (Math.round((((new Date(track.published_at) - new Date(track._meta.modified_at)) % 86400000) % 3600000) / 60000) > $scope.graceTime) {
                  // The track was published with a DateTime in the future
                  graceTimeWasUsed = false;
              } else {
                  // The track was published or last modified in the near future (less than the $scope.graceTime) or in the past
                  scheduledTime += $scope.graceTime * 60000;
                  graceTimeWasUsed = true;
              }

              // Check if we should batch the notifications together
              var indexOfNotificationBatch = checkNotificationBatchAlreadyExists(podcast.notifications, scheduledTime);

              if (indexOfNotificationBatch != -1) {
                podcast.notifications[indexOfNotificationBatch].tracks.push(track);
                podcast.notifications[indexOfNotificationBatch].graceTimeWasUsed = graceTimeWasUsed;
                podcast.notifications[indexOfNotificationBatch].scheduledTime = Math.max(scheduledTime, podcast.notifications[indexOfNotificationBatch].scheduledTime);
              } else {
                podcast.notifications.push({ tracks: [track], scheduledTime: scheduledTime, graceTimeWasUsed: graceTimeWasUsed });
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

            podcast.notifications.sort(function(a, b){
              return a.scheduledTime - b.scheduledTime;
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
