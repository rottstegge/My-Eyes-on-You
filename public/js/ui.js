console.log("ui.js loaded");



$(function(){
    let artistArea = $('.artist-area');




    // Click Handler


    // Artist Section

    $('.artist-btn').on("click", function(){
        console.log("clicked");
        if($(artistArea).hasClass('open')){
            $(artistArea).removeClass('open');
            $(this).removeClass('active');
        } else {
            $(artistArea).addClass('open');
            $(this).addClass('active');
        }
    });

    $('.artist-area').on("click", ".artist-name.clickable", function(){
        console.log("clicked artist name");
        let artworksList = $(this).siblings(".artist-artworks-list");

        if($(artworksList).hasClass('open')){
            $(artworksList).removeClass('open');
        } else {
            $(artistArea).find('.artist-artworks-list.open').removeClass('open'); // if theres one open, close it
            $(artworksList).addClass('open');
        }
    })


    // Opening Artworks
    $('.artwork-thumbnails').on("mousedown",  ".artwork-thumbnail", function(){
        // don't do anything if mouse moves after down
        let mouseMoved = false;
        $(this).on("mousemove", function(){
            mouseMoved = true;
        });
        $(this).on("mouseup", function(){
           $(this).off("mousemove"); // unbind mousemove handler
           $(this).off("mouseup"); // unbind mousemove handler
           if (!mouseMoved) {
                let id = $(this).attr("artwork-id");
                console.log(id);
                openArtwork(id);
           }
        })        
    })



    // Logic
    function openArtwork(id){
        populateOverlayContent(id);
        let overlay = $('.single-artwork-overlay');
        $(overlay).addClass('open');

        $('.single-artwork-overlay').on('click', function(){
            $(this).removeClass('open');
            $('.minimap').css({
                height: '',
                width: ''
            })
        });
    
    };

})


