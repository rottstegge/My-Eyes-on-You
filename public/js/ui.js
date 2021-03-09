console.log("ui.js loaded");



$(function(){
    let artistArea = $('.artist-area');
    let minimap = $('.minimap');




    // Click Handler


    // Artist Section

    $('.artist-btn').on("click", function(){
        if($(artistArea).hasClass('open')){
            $(artistArea).removeClass('open');
            $(this).removeClass('active');
        } else {
            $(artistArea).addClass('open');
            $(this).addClass('active');
        }
    });

    $('.artist-area').on("click", ".artist-name.clickable", function(){
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
    });

    $('.artwork-thumbnails').on("mouseenter",  ".artwork-thumbnail", function(){
        // don't do anything if mouse moves after down
        let id = $(this).attr("artwork-id");
        teaseArtwork(id);
    })
    $('.artwork-thumbnails').on("mouseleave",  ".artwork-thumbnail", function(){
        // don't do anything if mouse moves after down
        let id = $(this).attr("artwork-id");
        unteaseArtwork();
    })


    // Logic
    function openArtwork(id){
        // get content and open
        populateOverlayContent(id);
        let overlay = $('.single-artwork-overlay');
        $(overlay).addClass('open');
        $(overlay).removeClass('tease');

        // init gallery
        $(overlay).find('.gallery-container').slick({
            speed: 500,
            infinite: false,
            adaptiveHeight: true,
            variableWidth: true,
            lazyLoad: 'ondemand'
          });

        // shrink minimap
        let oldHeight = $(minimap).outerHeight();
        let oldWidth = $(minimap).outerWidth();
        let newHeight = $('.single-artwork-overlay .metainfo-container').outerHeight();
        let newWidth = oldWidth / (oldHeight / newHeight);
        gsap.to(minimap, 
            {
                width: newWidth, 
                height: newHeight, 
                duration: 0.3
        });
    };


    function teaseArtwork(id){
        populateOverlayContent(id);
        let overlay = $('.single-artwork-overlay');
        $(overlay).addClass('tease');
        console.log("tease:" +  id);
    }
    function unteaseArtwork(){
        let overlay = $('.single-artwork-overlay');
        $(overlay).removeClass('tease');
        console.log("untease");

    }



    // making the grids match
    function setLayoutAlignment(){
        let brand = $('.brand');
        let singleArtworkOverlay = $('.single-artwork-overlay');
        console.log($(brand).height());


        // layout for minimap
        let ratio = $('.map-background').outerWidth() /  $('.map-background').outerHeight();
        let newWidth = $('.artist-btn').outerWidth() + $('.about-btn').outerWidth();
        $(minimap).width(newWidth);
        $(minimap).height(newWidth/ratio);


        // layout for overlay
        $(singleArtworkOverlay).find('.topline-spacer').height($(brand).outerHeight());
        $(singleArtworkOverlay).find('.sidebar').width($(brand).outerWidth());

    }
    setLayoutAlignment();

})

