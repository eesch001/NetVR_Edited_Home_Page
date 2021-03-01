function YPTSidebarOpen() {
    $('body').addClass('youtube')
    $("#sidebar").fadeIn();
    youTubeMenuIsOpened = true;
}
function YPTSidebarClose() {
    $('body').removeClass('youtube');
    $("#sidebar").fadeOut();
    youTubeMenuIsOpened = false;
}
$(document).ready(function () {
    if (inIframe()) {
        $("#mainNavBar").hide();
        $("body").css("padding-top", "0");
    }
    $('#buttonMenu').on("click.sidebar", function (event) {
        event.stopPropagation();
        //$('#sidebar').fadeToggle();
        if ($('body').hasClass('youtube')) {
            YPTSidebarClose();
        } else {
            YPTSidebarOpen();
        }

        $('#myNavbar').removeClass("in");
        $('#mysearch').removeClass("in");
    });
    /*
     $(document).on("click.sidebar", function () {
     YPTSidebarClose();
     });
     */
    $("#sidebar").on("click", function (event) {
        event.stopPropagation();
    });
    $("#buttonSearch").click(function (event) {
        $('#myNavbar').removeClass("in");
        $("#sidebar").fadeOut();
    });
    $("#buttonMyNavbar").click(function (event) {
        $('#mysearch').removeClass("in");
        $("#sidebar").fadeOut();
    });
    var wasMobile = true;
    $(window).resize(function () {
        if ($(window).width() > 767) {
            // Window is bigger than 767 pixels wide - show search again, if autohide by mobile.
            if (wasMobile) {
                wasMobile = false;
                $('#mysearch').addClass("in");
                $('#myNavbar').addClass("in");
            }
        }
        if ($(window).width() < 767) {
            // Window is smaller 767 pixels wide - show search again, if autohide by mobile.
            if (wasMobile == false) {
                wasMobile = true;
                $('#myNavbar').removeClass("in");
                $('#mysearch').removeClass("in");
            }
        }
    });
});







var loadedExtraVideos = [];
/* Use this funtion to display live videos dynamic on pages*/
function afterExtraVideos($liveLi) {
    return $liveLi
}

function createLiveItem(href, title, name, photo, offline, online, views, key, isPrivate) {
    var $liveLi = $('.liveModel').clone();
    $($liveLi).find('a').removeClass('linksToFullscreen');
    if (offline) {
        $liveLi.find('.fa-video').removeClass("fa-video").addClass("fa-ban");
        $liveLi.find('.liveUser').removeClass("label-success").addClass("label-danger");
        $liveLi.find('.badge').text("offline");
        //$('#mainVideo.liveVideo').find('.vjs-poster').css({'background-image': 'url(https://netvrstream.com/plugin/Live/view/Offline.jpg)'});
    } else {
        //$('#mainVideo.liveVideo').find('.vjs-poster').css({'background-image': 'url(https://netvrstream.com/plugin/Live/view/OnAir.jpg)'});
    }
    $liveLi.removeClass("hidden").removeClass("liveModel");
    if (isPrivate) {
        $liveLi.find('.fa-video').removeClass('fa-video').addClass('fa-lock');
    }
    $liveLi.find('a').attr("href", href);
    $liveLi.find('.liveTitle').text(title);
    $liveLi.find('.liveUser').text(name);
    $liveLi.find('.img').attr("src", photo);
    $('#availableLiveStream').append($liveLi);

    if (href != "#") {
        $liveLi.find('.liveNow').removeClass("hidden");
    }

    $('.liveUsersOnline_' + key).text(online);
    $('.liveUsersViews_' + key).text(views);
}
var limitLiveOnVideosListCount = 0;
function createExtraVideos(href, title, name, photo, user, online, views, key, disableGif, live_servers_id) {
    limitLiveOnVideosListCount++;
    if (limitLiveOnVideosListCount >12) {
        console.log("Max live videos on first page reached");
        return false;
    }

    var matches = key.match(/.*_([0-9]+)/);
    var playlists_id_live = "";
    if (matches && matches[1]) {
        playlists_id_live = "&playlists_id_live=" + matches[1];
    }

    var id = 'extraVideo' + user + "_" + live_servers_id + "_" + key;
    id = id.replace(/\W/g, '');
    if ($(".extraVideos").length && $("#" + id).length == 0) {
        var $liveLi = $('.extraVideosModel').clone();
        $($liveLi).find('a').removeClass('linksToFullscreen');
        $liveLi.removeClass("hidden").removeClass("extraVideosModel");
        $liveLi.css({'display': 'none'})
        $liveLi.attr('id', id);
        $liveLi.find('.videoLink').attr("href", href);
        $liveLi.find('.liveTitle').text(title);
        $liveLi.find('.liveUser').text(name);
        $liveLi.find('.photoImg').attr("src", photo);
        $liveLi.find('.liveUsersOnline').text(online);
        $liveLi.find('.liveUsersViews').text(views);
        $liveLi.find('.liveUsersOnline').addClass("liveUsersOnline_" + key);
        $liveLi.find('.liveUsersViews').addClass("liveUsersViews_" + key);
        $liveLi.find('.thumbsJPG').attr("src", "https://netvrstream.com/plugin/Live/getImage.php?live_servers_id=" + live_servers_id + "&u=" + user + "&format=jpg" + playlists_id_live + '&' + Math.random());
        if (!disableGif) {
            $liveLi.find('.thumbsGIF').attr("src", "https://netvrstream.com/plugin/Live/getImage.php?live_servers_id=" + live_servers_id + "&u=" + user + "&format=gif" + playlists_id_live + '&' + Math.random());
        } else {
            $liveLi.find('.thumbsGIF').remove();
        }
        $liveLi = afterExtraVideos($liveLi);
        $('.extraVideos').append($liveLi);
        $liveLi.slideDown();
    }
}

function getStatsMenu(recurrentCall) {
    availableLiveStreamIsLoading();
    $.ajax({
        url: webSiteRootURL + 'plugin/Live/stats.json.php?Menu',
        success: function (response) {
            limitLiveOnVideosListCount = 0;
            if (typeof response !== 'undefined') {
                $('#availableLiveStream').empty();
                if (isArray(response)) {
                    for (var i in response) {
                        if (typeof response[i] !== 'object') {
                            continue;
                        }
                        processApplicationLive(response[i]);
                    }
                } else {
                    processApplicationLive(response);
                }
                if (!response.total) {
                    availableLiveStreamNotFound();
                } else {
                    $('#availableLiveStream').removeClass('notfound');
                }
                $('.onlineApplications').text(response.total);
            }

            setTimeout(function () {
            }, 200);
            if (recurrentCall) {
                setTimeout(function () {
                    getStatsMenu(true);
                }, 15000);
            }
        }
    });
}

function processApplicationLive(response) {
    if (typeof response.applications !== 'undefined') {
        if (response.applications.length) {
            disableGif = response.disableGif;
            for (i = 0; i < response.applications.length; i++) {
                processApplication(response.applications[i], disableGif, 0);
            }
            mouseEffect();
        }
    }
    // check for live servers
    var count = 0;
    while (typeof response[count] !== 'undefined') {
        for (i = 0; i < response[count].applications.length; i++) {
            disableGif = response[count].disableGif;
            processApplication(response[count].applications[i], disableGif, response[count].live_servers_id);
        }
        count++;
    }
}

function availableLiveStreamIsLoading() {
    if ($('#availableLiveStream').hasClass('notfound')) {
        $('#availableLiveStream').empty();
        createLiveItem("#", "Please Wait, we are checking the lives", "", "", true, false);
        $('#availableLiveStream').find('.fa-ban').removeClass("fa-ban").addClass("fa-sync fa-spin");
        $('#availableLiveStream').find('.liveLink div').attr('style', '');
    }
}

function availableLiveStreamNotFound() {
    $('#availableLiveStream').addClass('notfound');
    $('#availableLiveStream').empty();
    createLiveItem("#", "There is no streaming now", "", "", true, false);
    $('#availableLiveStream').find('.liveLink div').attr('style', '');
}

function processApplication(application, disableGif, live_servers_id) {
    if (typeof application.html != 'undefined') {
        $('#availableLiveStream').append(application.html);
        if (typeof application.htmlExtra != 'undefined') {
            var id = $(application.htmlExtra).attr('id');
            if (loadedExtraVideos.indexOf(id) == -1) {
                loadedExtraVideos.push(id)
                    $('.extraVideos').append(application.htmlExtra);

            }
        }
        $('#liveVideos').slideDown();
    } else {
        //href = "https://netvrstream.com/plugin/Live/?live_servers_id=" + live_servers_id + "&c=" + application.channelName;
        href = application.href;
        title = application.title;
        name = application.name;
        user = application.user;
        photo = application.photo;
        online = application.users.online;
        views = application.users.views;
        key = application.key;
        live_servers_id = live_servers_id;
        isPrivate = application.isPrivate;

        createLiveItem(href, title, name, photo, false, online, views, key, isPrivate);
            createExtraVideos(href, title, name, photo, user, online, views, key, disableGif, live_servers_id);
            setTimeout(function () {
        }, 200);

    }
}

$(document).ready(function () {
    availableLiveStreamIsLoading();
    getStatsMenu(true);
});

















$(function () {
    $("#navBarFlag").flagStrap({
        countries: {"br":"br","cl":"cl","cn":"cn","cz":"cz","de":"de","es":"es","fr":"fr","gr":"gr","il":"il","in":"in","it":"it","jp":"jp","kr":"kr","nl":"nl","pl":"pl","pt":"pt","ru":"ru","sa":"sa","si":"si","sv":"sv","th":"th","tk":"tk","tr":"tr","tw":"tw","us":"us"},
        inputName: 'country',
        buttonType: "btn-default navbar-btn",
        onSelect: function (value, element) {
            if (!value && element[1]) {
                value = $(element[1]).val();
            }
            window.location.href = "https://netvrstream.com/?lang=" + value;
        },
        placeholder: {
            value: "",
            text: ""
        }
    });
});



$(document).ready(function () {
    setTimeout(function () {
        $('.nav li.navsub-toggle a:not(.selected) + ul').hide();
        var navsub_toggle_selected = $('.nav li.navsub-toggle a.selected');
        navsub_toggle_selected.next().show();
        navsub_toggle_selected = navsub_toggle_selected.parent();

        var navsub_toggle_selected_stop = 24;
        while (navsub_toggle_selected.length) {
            if ($.inArray(navsub_toggle_selected.prop('localName'), ['li', 'ul']) == -1)
                break;
            if (navsub_toggle_selected.prop('localName') == 'ul') {
                navsub_toggle_selected.show().prev().addClass('selected');
            }
            navsub_toggle_selected = navsub_toggle_selected.parent();

            navsub_toggle_selected_stop--;
            if (navsub_toggle_selected_stop < 0)
                break;
        }
    }, 500);


    $('.nav').on('click', 'li.navsub-toggle a:not(.selected)', function (e) {
        var a = $(this),
                b = a.next();
        if (b.length) {
            e.preventDefault();

            a.addClass('selected');
            b.slideDown();

            var c = a.closest('.nav').find('li.navsub-toggle a.selected').not(a).removeClass('selected').next();

            if (c.length)
                c.slideUp();
        }
    });
});


$(document).ready(function () {
    loadPlayLists('743', '60356c034daef');
    $('#addBtn74360356c034daef').webuiPopover();
    $('#addPlayList74360356c034daef').click(function () {
        modal.showPleaseWait();
        $.ajax({
            url: 'https://netvrstream.com/objects/playlistAddNew.json.php',
            method: 'POST',
            data: {
                'videos_id': 743,
                'status': $('#publicPlayList74360356c034daef').is(":checked") ? "public" : "private",
                'name': $('#playListName74360356c034daef').val()
            },
            success: function (response) {
                if (response.status>0) {
                    playList = [];
                    reloadPlayLists();
                    loadPlayLists('743', '60356c034daef');
                    $('#playListName74360356c034daef').val("");
                    $('#publicPlayList74360356c034daef').prop('checked', true);
                }
                modal.hidePleaseWait();
            }
        });
        return false;
    });
});



function afterExtraVideos($liveLi) {
    $liveLi.removeClass('col-lg-12 col-sm-12 col-xs-12 bottom-border');
    $liveLi.find('.thumbsImage').removeClass('col-lg-5 col-sm-5 col-xs-5');
    $liveLi.find('.videosDetails').removeClass('col-lg-7 col-sm-7 col-xs-7');
    $liveLi.addClass('col-lg-2 col-md-4 col-sm-4 col-xs-6 fixPadding');
    $('#liveVideos').slideDown();
    return $liveLi;
}
