angular.module('EmotionApp', [])
    .controller('EmotionCtrl', function ($scope, $http) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
        window.URL = window.URL || window.webkitURL;

        var canvas = document.getElementById('photo');
        var video = document.getElementById('webcam');

        if (!navigator.getUserMedia) {
            alert('no camera');
        }

        function gotStream(stream) {
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            } else {
                video.src = stream; // Opera.
            }

            video.onerror = function (e) {
                stream.stop();
            };

            stream.onended = noStream;

            video.onloadedmetadata = function (e) { // Not firing in Chrome. See crbug.com/110938.
            //    document.getElementById('splash').hidden = true;
              //  document.getElementById('app').hidden = false;
            };

            // Since video.onloadedmetadata isn't firing for getUserMedia video, we have
            // to fake it.
            setTimeout(function () {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
             //   document.getElementById('splash').hidden = true;
               // document.getElementById('app').hidden = false;
            }, 50);
        }

        function noStream() {
            alert('no camera');
        }

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

            //temp
            $scope.imageCaptured = false;
            $scope.imageDataUri = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
            $scope.emotions = "";
            //temp
            
            navigator.getUserMedia({ video: true }, gotStream, noStream);
            $scope.working = false;
        };
        $scope.capture = function () {
            $scope.working = true;
            $scope.imageCaptured = true;
            $scope.title = "Thanks";
            
            var ctx = canvas.getContext('2d');
            ctx.translate(video.videoWidth, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0);

            $scope.imageDataUri = canvas.toDataURL('image/jpeg', 95);

            $http.post('/api/emotion/', { 'department': $scope.department, 'image': $scope.imageDataUri }).success(function (data, status, headers, config) {
                $scope.emotions = data;

                Array.prototype.forEach.call(data, function (emotion) {
                    ctx.beginPath();
                    ctx.lineWidth = "6";
                    ctx.strokeStyle = "red";
                    ctx.rect(video.videoWidth - emotion.FaceRectangle.Left - emotion.FaceRectangle.Width, emotion.FaceRectangle.Top, emotion.FaceRectangle.Width, emotion.FaceRectangle.Height);
                    ctx.stroke();
                });
                
                $scope.imageDataUri = canvas.toDataURL('image/jpeg', 95);
                console.log(data);
                $scope.working = false;
            }).error(function (data, status, headers, config) {
                $scope.title = "Oops... something went wrong";
                $scope.working = false;
            });
        };
    });