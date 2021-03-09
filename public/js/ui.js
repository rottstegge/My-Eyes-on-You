console.log("ui.js loaded");



$(function(){
    let artistArea = $('.artist-area');
    let minimap = $('.minimap');
    let overlay = $('.single-artwork-overlay');




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
        if($(overlay).hasClass('open')){ 
           return;
        }
        let id = $(this).attr("artwork-id");
        teaseArtwork(id);
    })
    $('.artwork-thumbnails').on("mouseleave",  ".artwork-thumbnail", function(){
        // don't do anything if mouse moves after down
        if($(overlay).hasClass('open')){ return; }
        let id = $(this).attr("artwork-id");
        unteaseArtwork();
    })


    // Logic
    function openArtwork(id){
        // get content and open
        populateOverlayContent(id);
        let overlay = $('.single-artwork-overlay');
        $(overlay).removeClass('tease');
        $(overlay).addClass('open');

        // init gallery, trigger transition once done
        let galleryContainer = $('.gallery-container');
        $(galleryContainer).on('init', function(){
            thumbnailToGalleryTransition(id);
        })
        $(galleryContainer).slick({
            speed: 500,
            infinite: false,
            adaptiveHeight: true,
            variableWidth: true,
            lazyLoad: 'ondemand'
          }).on('reInit', function(){
              console.log("initiated slick slider");
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
        gsap.fromTo(overlay, 
            {transform: "translateY(10vh)"},
            {transform: "translateY(0)", duration: 0.3}
        );
    }


    function unteaseArtwork(){
        let overlay = $('.single-artwork-overlay');
        gsap.to(overlay, 
            {transform: "translateY(10vh)", duration: 0.3, onComplete: removeClass}
        );
        function removeClass(){
            console.log("untease");
            $(overlay).removeClass('tease');
            gsap.set(overlay, 
                {transform: "translateY(0)"}
            );
        }
    }


    
    function thumbnailToGalleryTransition(id){

        let mapImage = $('.artwork-thumbnail[artwork-id='+id+']');
        let galleryContainer = $('.gallery-container').first();
        let mapBackground = $('.map-draggable');
        let backgroundLeft = $(mapBackground).css('left');
        let backgroundTop =   $(mapBackground).css('top');

        // get positions relative to screen
        mapImagePos = $(mapImage).position(window);
        galleryContainerPos = $(galleryContainer).position(window);
        galleryContainerHeight = $(galleryContainer).height();

        let newLeft = parseInt(backgroundLeft)*-1 + galleryContainerPos.left;
        let newTop = parseInt(backgroundTop)*-1 + galleryContainerPos.top;
        let newWidth = galleryContainerHeight / ($(mapImage).height() / $(mapImage).width());

        let tl = gsap.timeline({defaults: {duration: 1, ease: "easeIn"} });
        tl.to(mapImage, {
            left: newLeft, 
            top: newTop, 
            width: newWidth,
            })
            .to($(mapImage).find('.regular-image'), {
            opacity: 1
        }, "<")
            .set(galleryContainer,{opacity: 1, duration: 0.3})
            .to(mapImage, {opacity: 0, duration: 0.3});


        console.log({newWidth});
        console.log({mapImagePos});
        console.log({galleryContainerPos});
        console.log({galleryContainerHeight});


    }



    // making the grids match
    function setLayoutAlignment(){
        let brand = $('.brand');
        let singleArtworkOverlay = $('.single-artwork-overlay');

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


