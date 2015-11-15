angular.module('EmotionApp', [])
    .controller('EmotionCtrl', function ($scope, $http) {
        $scope.loadDepartments = function () {
            $scope.working = true;
            $scope.title = "loading departments...";

            $scope.departmentSelected = false;
            $scope.department = "";
            $scope.options = [];
            $scope.imageCaptured = false;
            $scope.imageDataUri = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
            $scope.emotions = "";

            $http.get("/api/emotion").success(function (data, status, headers, config) {
                $scope.options = data;
                $scope.title = "What department?";
                $scope.working = false;
            }).error(function (data, status, headers, config) {
                $scope.title = "Oops... something went wrong";
                $scope.working = false;
            });
        };
        $scope.selectDepartment = function (option) {
            $scope.working = true;
            $scope.departmentSelected = true;
            $scope.department = option;
            $scope.title = "How was your day?";

            Webcam.set({
                width: 960,
                height: 720,
                dest_width: 640,
                dest_height: 480,
                image_format: 'jpeg',
                jpeg_quality: 90,
                flip_horiz: true
            });
            Webcam.attach('#camera');
            $scope.working = false;
        };
        $scope.capture = function () {
            $scope.working = true;
            $scope.imageCaptured = true;
            $scope.title = "Thanks";

            Webcam.snap(function (data) {
                $scope.imageDataUri = data;

                $http.post('/api/emotion/', { 'department': $scope.department, 'image': data }).success(function (data, status, headers, config) {
                    $scope.emotions = data;
                    console.log(data);
                    $scope.working = false;
                }).error(function (data, status, headers, config) {
                    $scope.title = "Oops... something went wrong";
                    $scope.working = false;
                });
            });
        };
    });