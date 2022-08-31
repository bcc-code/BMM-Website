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

    _api.nextTracksToBePublished().then(function(viewModel) { // Will get just unnotified tracks
      $scope.podcasts = viewModel.podcasts;

      $scope.podcasts.forEach(function(podcast) {
        podcast.notifications = [];
        $scope.graceTime = viewModel.grace_time_notification_job;
        $scope.batchPeriod = viewModel.notification_batch_period;

        podcast.tracks.forEach(function(track) {
          $scope.anyNotification = true;

          //ToDo: maybe this calculation should happen on the server
          var graceTimeWasUsed;
          var scheduledTime = new Date(track._meta.modified_at > track.published_at ? track._meta.modified_at : track.published_at);
          var modifiedTime = new Date(track._meta.modified_at);
          var publishedTime = new Date(track.published_at);

          var latestPossibleModifyTime = publishedTime;
          latestPossibleModifyTime.setMinutes(latestPossibleModifyTime.getMinutes() - $scope.graceTime);

          if (modifiedTime < latestPossibleModifyTime) {
            // no grace time needed since the last edit was made enough time before publishing
            graceTimeWasUsed = false;
          } else {
            // the last edit was made close to the publish time. Therefore we delay publishing.
            scheduledTime.setMinutes(scheduledTime.getMinutes() + $scope.graceTime);
            graceTimeWasUsed = true;
          }

          // Check if we should batch the notifications together
          var indexOfNotificationBatch = checkNotificationBatchAlreadyExists(podcast.notifications, scheduledTime);

          if (indexOfNotificationBatch != -1) {
            podcast.notifications[indexOfNotificationBatch].tracks.push(track);
            podcast.notifications[indexOfNotificationBatch].graceTimeWasUsed = graceTimeWasUsed;
            podcast.notifications[indexOfNotificationBatch].scheduledTime = Math.max(scheduledTime.getTime(), podcast.notifications[indexOfNotificationBatch].scheduledTime);
          } else {
            podcast.notifications.push({ tracks: [track], scheduledTime: scheduledTime.getTime(), graceTimeWasUsed: graceTimeWasUsed });
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

      });

      doneLoading();
    }).fail(function(){
      doneLoading();
    });

  }

  init();
});
