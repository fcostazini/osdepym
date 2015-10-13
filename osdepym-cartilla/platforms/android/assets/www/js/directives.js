angular.module('cartilla.directives', [])

.directive('map', function($ionicLoading) {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      var lat;
      var long;
      function initialize() {

        var mapOptions = {
          center: new google.maps.LatLng(lat, long),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($element[0], mapOptions);

        $scope.onCreate({map: map});



        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          console.log("mousedown!");
          e.preventDefault();
          return false;
        });
        $ionicLoading.hide();
      }

      if (document.readyState === "complete") {
        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
        var onSuccess = function(position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;

            initialize();
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
});
