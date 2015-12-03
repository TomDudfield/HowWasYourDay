navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

angular.module('EmotionApp', [])
    .controller('EmotionCtrl', function ($scope, $http) {
        $scope.loadDepartments = function () {
            $scope.working = true;
            $scope.title = "loading departments...";

            $scope.departmentSelected = false;
            $scope.department = "";
            $scope.options = [];
            $scope.imageCaptured = false;
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
            $scope.imageCaptured = false;
            $scope.emotions = "";

            if (!navigator.getUserMedia) {
                alert('no camera');
            } else {
                navigator.getUserMedia({ video: true },
                    function gotStream(stream) {
                        var video = document.getElementById('webcam');
                        if (video.mozSrcObject !== undefined) {
                            video.mozSrcObject = stream;
                        } else {
                            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                        };

                        video.onerror = function (e) {
                            stream.stop();
                        };
                    },
                function noStream() {
                    alert('no camera');
                });
            }

            $scope.working = false;
        };
        $scope.capture = function () {
            $scope.working = true;
            $scope.imageCaptured = true;
            $scope.title = "Thanks";

            var result = document.getElementById('result');
            var canvas = document.getElementById('photo');
            var video = document.getElementById('webcam');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            var ctx = canvas.getContext('2d');
            ctx.save();
            ctx.translate(video.videoWidth, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0);
            result.src = canvas.toDataURL('image/jpeg', 95);
            ctx.restore();

            $http.post('/api/emotion/', { 'department': $scope.department, 'image': result.src }).success(function (data, status, headers, config) {
                $scope.emotions = data;

                Array.prototype.forEach.call(data, function (emotion) {
                    ctx.beginPath();
                    ctx.lineWidth = "3";
                    ctx.strokeStyle = "red";
                    ctx.strokeRect(emotion.Left, emotion.Top, emotion.Width, emotion.Height);
                    ctx.fillStyle = "red";
                    ctx.font = "20px Arial";
                    ctx.fillText(emotion.TopScoreType, emotion.Left + 6, emotion.Top + emotion.Height - 6);
                });

                result.src = canvas.toDataURL('image/jpeg', 95);
                console.log(data);
                $scope.working = false;
            }).error(function (data, status, headers, config) {
                $scope.title = "Oops... something went wrong";
                $scope.working = false;
            });
        };
    });