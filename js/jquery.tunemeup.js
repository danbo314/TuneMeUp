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
            repeat = false;

        if (!settings.waveColor) { settings.waveColor = themeDefaults[settings.theme].waveColor; }

        $player.append("<div class='tmuPlayer " + settings.theme + "'>" +
            "<div class='heydings buttonNav stop'>S</div>" +
            "<div class='heydings buttonNav playPause'>P</div>" +
            "<div id='" + waveId + "'></div>" +
            "<div class='heydings buttonNav repeat'>r</div>" +
            "</div>").on("click", ".playPause", function () {

            if ($(this).text() === "P") {
                $(this).text("u");
            } else {
                $(this).text("P");
            }

            wavesurfer.playPause();
        }).on("click", ".stop", function () {
            wavesurfer.stop();

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

        wavesurfer.on("finish", function () {
            $player.find(".playPause").text("P");

            if (repeat) {
                setTimeout(function () {
                    wavesurfer.play();
                }, 800);
            }
        });

        wavesurfer.on("play", function () {
            $player.find(".playPause").text("u");
        });

        return this;

    };

}(jQuery));
