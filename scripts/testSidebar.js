/**
 * Created by Jiyong on 17-Oct-16.
 */
$( function() {
    $('.panel-heading').click( function() {
        setTimeout(function() {
            selected = $('.active');
            selected_index = selected.attr('value');
            console.log("selected number: " + selected_index);
            var heading = Cesium.Math.toRadians(0);
            var pitch = Cesium.Math.toRadians(-30);
            var range = 10000000; // 10000km
            viewer.zoomTo(pin[selected_index], new Cesium.HeadingPitchRange(heading, pitch, range));
            viewer.selectedEntity = undefined;
        }, 50);
    });
});

$(document).ready(function() {
    $('.panel-collapse').on('show.bs.collapse', function () {
        $(this).siblings('.panel-heading').addClass('active');
    });

    $('.panel-collapse').on('hide.bs.collapse', function () {
        $(this).siblings('.panel-heading').removeClass('active');
        selected_index = undefined;
        $('.twitter-btn').hide();
        $('.twitter').hide();
    });

    /* function to link "read more" icon in news list to pop articles and highlight pins */
    $('#testSidebar').click(function () {
        console.log("testSidebar got clicked!");
        $('.twitter-btn').hide();
        $('.twitter').hide();

        viewer.selectedEntity = pin[selected_index];
        setTimeout(function () {
//        console.log("twitter should show: " + ($('.cesium-infoBox-visible').not('.twitter').length > 0));
            if (selected_index != undefined && ($('.cesium-infoBox-visible').not('.twitter').length > 0)) {
                setTimeout(function () {
                    $('.twitter-btn').show();
                }, 100);
            }
        }, 100);
        console.log("article selected is " + selected_index);
    });
});