angular.module('camApp', ['ui.bootstrap', 'webcam'])



    .controller('webcam', function($scope) {
        $scope.imageCaptured = false;
        var _video = null,
            patData = null;
        var boxLeft, boxTop, boxWidth, boxHeight;

        $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        $scope.channel = {
            videoHeight: height,
            videoWidth: width,
            video: null
        };

        $scope.webcamError = false;
        $scope.onError = function (err) {
            $scope.$apply(
                function() {
                    $scope.webcamError = err;
                }
            );
        };
        $scope.onSuccess = function () {
            boxWidth = $('#content').width();
            boxHeight =$('#content').height();
            function getOffset( el ) {
                var _x = 0;
                var _y = 0;
                while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            }
            boxLeft = getOffset( document.getElementById('content') ).left;
            boxTop = getOffset( document.getElementById('content') ).top;


            _video = $scope.channel.video;
            $scope.$apply(function() {
                $scope.patOpts.w = _video.width;
                $scope.patOpts.h = _video.height;
                //$scope.showDemos = true;
            });
        };

        $scope.onStream = function (stream) {
        };


        $scope.makeSnapshot = function() {


            if (_video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData(boxLeft, boxTop, boxWidth, boxHeight);
                ctxPat.putImageData(idata, 0, 0);

                sendSnapshotToServer(patCanvas.toDataURL());

                patData = idata;
                $scope.imageCaptured = true
            }
        };

        $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
            window.location.href = dataURL;
        };

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };

        var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
            $scope.snapshotData = imgBase64;
        };
        $scope.cancelUpload = function cancelUpload() {
            $scope.imageCaptured = false;
        }
        $scope.uploadImage = function uploadImage() {
            $scope.imageCaptured; //this variable holds image in base 64 format.
        }
    })