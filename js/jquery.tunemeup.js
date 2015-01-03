(function ($) {

    "use strict";
    $.fn.tuneMeUp = function (options) {

        var themeDefaults = {
                dark: {
                    waveColor: "#3c3c3c"
                },
                light: {
                    waveColor: "#cbcbcb"
                }
            },
            settings = $.extend({
                theme: "light",
                highlightColor: "#c70000"
            }, options),
            wavesurfer = Object.create(WaveSurfer),
            $player = $(this),
            waveId = "wave_" + settings.id,
            repeat = false,
            counter = 0,
            countPoint;

        if (!settings.waveColor) { settings.waveColor = themeDefaults[settings.theme].waveColor; }

        $player.append("<div class='tmuPlayer " + settings.theme + "'>" +
            "<div class='heydings buttonNav stop'>S</div>" +
            "<div class='heydings buttonNav playPause'>P</div>" +
            "<div id='" + waveId + "'><div class='counter overlay'></div>" +
            "<div class='duration overlay'></div></div>" +
            "<div class='heydings buttonNav repeat'>r</div>" +
            "</div>").on("click", ".playPause", function () {
            wavesurfer.playPause();
        }).on("click", ".stop", function () {
            wavesurfer.stop();

            clearInterval(countPoint);
            counter = 0;
            $player.find(".counter").hide();

            $player.find(".playPause").text("P");
        }).on("click", ".repeat", function () {
            $(this).toggleClass("selected");

            repeat = !repeat;

            if($(this).hasClass("selected")) {
                $(this).css({ color: settings.highlightColor }).off("mouseout");
            }
            else {
                $(this).on("mouseout", function () {
                    $(this).css({ color: settings.waveColor });
                });
            }
        });

        $player.find(".buttonNav").css({ color: settings.waveColor }).on({
            mouseover: function () {
                $(this).css({ color: settings.highlightColor });
            },
            mouseout: function () {
                $(this).css({ color: settings.waveColor });
            }
        });

        $player.find(".tmuPlayer").css({ "border-color": settings.waveColor });

        wavesurfer.init({
            container: "#" + waveId,
            waveColor: settings.waveColor,
            progressColor: settings.highlightColor,
            height: 50,
            cursorWidth: 0
        });

        wavesurfer.load(settings.songPath);

        wavesurfer.on("ready", function (progress, ev) {
            var dur  = getDisplayFromSeconds(wavesurfer.getDuration());

            $player.find(".duration").text(dur).show();
        });

        wavesurfer.on("finish", function () {
            $player.find(".playPause").text("P");

            clearInterval(countPoint);
            counter = 0;

            if (repeat) {
                setTimeout(function () {
                    wavesurfer.play();
                }, 800);
            }
        });

        wavesurfer.on("play", function () {
            $player.find(".playPause").text("u");

            countPoint = startCounterFrom(counter, $player.find(".counter"));
        });

        wavesurfer.on("pause", function () {
            $player.find(".playPause").text("P");

            clearInterval(countPoint);
            counter = getSecondsFromDisplay($player.find(".counter").text());
        });

        wavesurfer.on("seek", function (progress) {
            var secs = wavesurfer.getDuration() * progress;

            clearInterval(countPoint);
            counter = secs;

            countPoint = startCounterFrom(secs, $player.find(".counter"));
        });

        return this;

    };

    function startCounterFrom(startInt, $node) {
        var count = startInt;

        $node.text(getDisplayFromSeconds(count)).show();

        return setInterval(function () {
            $node.text(getDisplayFromSeconds(++count));
        }, 1000);
    }

    function getDisplayFromSeconds(totSecs) {
        var hours = parseInt(totSecs/3600) % 24,
            minutes = parseInt(totSecs/60) % 60,
            seconds = parseInt(totSecs % 60, 10);

        if (hours === 0) {
            hours = "";
            minutes += ":";
        }
        else {
            hours += ":";
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            minutes += ":";
        }

        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + minutes + seconds;
    }

    function getSecondsFromDisplay(dispString) {
        var parts = dispString.split(":"),
            hours,
            minutes,
            seconds,
            res = 0;

        if (parts.length === 3) {
            hours = parseInt(parts[0]);
            minutes = parseInt(parts[1]);
            seconds = parseInt(parts[2]);
        }
        else {
            minutes = parseInt(parts[0]);
            seconds = parseInt(parts[1])
        }

        if (hours) {
            res += (hours * 3600);
        }

        res += (minutes * 60 + seconds);

        return res;
    }

}(jQuery));
