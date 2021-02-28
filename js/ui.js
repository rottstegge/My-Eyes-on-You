console.log("ui.js loaded");

var $ = require("jquery");
var gsap = require("gsap");


$(function(){
    



    // Click Handler


    // Artist Section

    $('.artist-btn').on("click", function(){
        let artistArea = $('.artist-area');
        console.log("clicked");
        if($(artistArea).hasClass('open')){
            $(artistArea).removeClass('open');
            $(this).removeClass('active');
        } else {
            $(artistArea).addClass('open');
            $(this).addClass('active');
        }
    });

    $('.artist-name.btn').on("click", function(){
        let artworksList = $(this).siblings(".artist-artworks-list");

        if($(artworksList).hasClass('open')){
            $(artworksList).removeClass('open');
        } else {
            $(artworksList).addClass('open');
        }
    })


    // Opening Artworks
    $('.artwork-thumbnail').on("mousedown", function(){
        // don't do anything if mouse moves after down
        let mouseMoved = false;
        $(this).on("mousemove", function(){
            mouseMoved = true;
        });
        $(this).on("mouseup", function(){
           $(this).off("mousemove"); // unbind mousemove handler
           $(this).off("mouseup"); // unbind mousemove handler
           if (!mouseMoved) {
            openArtwork();
           }
        })        
    })





    // Logic
    function openArtwork(id){
        $('.single-artwork-overlay').addClass('open');
        $('.minimap').css({
            height: '10vh',
            width: '10vw'
        })
        $('.single-artwork-overlay').on('click', function(){
            $(this).removeClass('open');
            $('.minimap').css({
                height: '',
                width: ''
            })
        });
    };



})


