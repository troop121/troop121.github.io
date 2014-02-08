function makeNiceEntry(entry, $scope) {
    var rawmasses = entry.gsx$afterwhichmassescanyouhelp.$t;
    if(rawmasses[0] == "'") {
        rawmasses = rawmasses.substr(1);
    }
    var atmasses = [false, false, false, false, false];
    var massTimes = rawmasses.split(/,\s*/);
    for(var i = 0; i < $scope.allMassTimes.length; i++) {
        atmasses[i] = (massTimes.indexOf($scope.allMassTimes[i]) > -1);
    }
    
    return {
        name: entry.gsx$yourname.$t,
        atmasses: atmasses,
        rawmasses: rawmasses,
        masstimes: massTimes,
        adults: +entry.gsx$howmanyadultsfromyourfamilywillhelp.$t,
        boys: +entry.gsx$howmanyboysfromyourfamilywillhelp.$t,
        comments: entry.gsx$questionsorcomments.$t
    }
}

var donutApp = angular.module('donutApp', []);
 
donutApp.controller('donutController', function donutController($scope, $http) {
    $scope.results = null;
    $scope.allMassTimes = options.massTimes;
    
    var url = "http://spreadsheets.google.com/feeds/list/" + options.ssKey + "/" + options.ssSheet + "/public/values?alt=json";

    $http.jsonp(url + '&callback=JSON_CALLBACK').success(function(data) {
		//$scope.debuginfo = { 'success': arguments };
        //console.log('success:', arguments);
		$scope.results = [];
		$scope.loadError = false; // Not really needed, since it starts false and can only get set to true, since we never reload data
        angular.forEach(data, function(value, index){
            angular.forEach(value.entry, function(entry, index){
                $scope.results.push(makeNiceEntry(entry, $scope));
            });
        });
    }).error(function(error) {
        //console.log('error:', arguments);
		//$scope.debuginfo = { 'error': arguments };
		$scope.loadError = true;
		$scope.results = [];
    });
});

donutApp.filter("total", function(field) {
    return function(items) {
      var total = 0, i = 0;
      for (i = 0; i < items.length; i++) total += items[i][field];
      return total;
    }
  });

donutApp.filter("totalAtMass", function() {
    return function(items,field,massIndex) {
        var total = 0;
		if(items) {
			for(var i = 0; i < items.length; i++) {
				if(items[i].atmasses[massIndex]) {
					total += items[i][field];
				}
			}
		}
        return total;
    }
});
