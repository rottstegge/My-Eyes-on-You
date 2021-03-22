console.log("ui.js loaded");



$(function(){
    let artistArea = $('.artist-area');
    let minimap = $('.minimap');
    let overlay = $('.single-artwork-overlay');
    let currentlyOpenArtworkID = null;
    let aboutArea = $('.about-area');
    let cursorContainer = $('.cursor-container');
    let borderWidth = 4; // px to align stuff




    // Click Handler


    // Artist Section

    $('.artist-btn')
        .on("click", function(){
            // if about Area is open, close it
            if($(aboutArea).hasClass('open')){
                console.log("its open, lets close");
                closeAboutArea();
            }
                    
            if($(artistArea).hasClass('open')){
                var tl = gsap.timeline();
                tl.to(artistArea, {height: "0", duration: 0.25})
                    .to(artistArea, {width: 0, duration: 0.25});
                $(artistArea).removeClass('open');
                $(this).removeClass('active');
            } else {
                $(artistArea).addClass('open');
                var tl = gsap.timeline();
                tl.to(artistArea, {width: $(minimap).width()+borderWidth, duration: 0.25})
                    .to(artistArea, {height: "100vh", duration: 0.25});
                $(this).addClass('active');
            }
        })
        .on("mouseenter mouseover", function(){
            if($(artistArea).hasClass('open')){
                setMouseState('close', 'medium');
            } else {
                setMouseState('default', 'medium');
            }
        })
        .on("mouseleave", function(){
            setMouseState('default', 'small');
        });

    $('.artist-area')
        .on("click", ".artist-name.clickable", function(){
            let artworksList = $(this).siblings(".artist-artworks-list");

            if($(artworksList).hasClass('open')){
                $(artworksList).removeClass('open');
            } else {
                $(artistArea).find('.artist-artworks-list.open').removeClass('open'); // if theres one open, close it
                $(artworksList).addClass('open');
            }
        })

    $('.about-btn').on('click', function(){

        if($(aboutArea).hasClass('open')){
            closeAboutArea();
        } else {
            openAboutArea();
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
        setMouseState('default', 'large');
        let id = $(this).attr("artwork-id");
        teaseArtwork(id);
    })
    $('.artwork-thumbnails').on("mouseleave",  ".artwork-thumbnail", function(){
        // don't do anything if mouse moves after down
        if($(overlay).hasClass('open')){ return; }
        let id = $(this).attr("artwork-id");
        setMouseState('default', 'small')
        unteaseArtwork();
    })




    // Logic
    function openArtwork(id){
        // get content and open
        populateOverlayContent(id);
        let overlay = $('.single-artwork-overlay');
        $(overlay).removeClass('tease');
        $(overlay).addClass('open');

        // close ArtistList if its open
        if($(artistArea).hasClass('open')){
            $('.artist-btn').trigger('click');
        }
        if($(aboutArea).hasClass('open')){
            closeAboutArea();
        }

        // init gallery, trigger transition once done
        let galleryContainer = $('.gallery-container');
        thumbnailToGalleryTransition(id);
        
        // init gallery
        $(galleryContainer).slick({
            speed: 500,
            infinite: false,
            adaptiveHeight: true,
            variableWidth: true,
            lazyLoad: 'progressive'
          });

        // setup image counter
        $(galleryContainer).on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
            //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
            var i = (currentSlide ? currentSlide : 0) + 1;
            $('.current-img').text(i);
            $('.img-amount').text(slick.slideCount);
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

        // remove other buttons
        gsap.to('.artist-btn .inner', {x: "150%", duration: 0.5});
        gsap.to('.about-btn .inner', {y: "-150%", duration: 0.5});


        currentlyOpenArtworkID = id;

        // Handler To Close Artwork Again
        $('.topline-spacer, .sidebar, .bottom-left, .metainfo-container')
            .one("click", function(){
                closeArtwork(currentlyOpenArtworkID);
            })
            .on("mouseenter", function(){
                setMouseState("close", 'large');
            })
            .on("mouseleave", function(){
                setMouseState("default", 'small');
            })
    };


    function closeArtwork(){
        galleryToThumbnailTransition();
        $(overlay).removeClass('open');
        let galleryContainer = $('.gallery-container');
        $(galleryContainer).slick('unslick');
        $(galleryContainer).css('opacity', 0);
        currentlyOpenArtworkID = null;

        let newWidth = $(minimap).attr('data-default-width');
        let newHeight = $(minimap).attr('data-default-height');

        gsap.to(minimap, 
            {
                width: newWidth, 
                height: newHeight, 
                duration: 0.3
        });

        gsap.to('.top-right .close-btn', {x: "150%", duration: 0.5});
        gsap.to('.artist-btn .inner', {x: 0, duration: 0.5});
        gsap.to('.about-btn .inner', {y: 0, duration: 0.5});
        gsap.set('.top-right .close-btn', {opacity: 0, delay: 0.5});
        gsap.to('.map-background', {opacity: 1, duration: 0.3});


    }

    // setting hoverstates
    $('.gallery-container').on("mouseenter", ".slick-prev", function(){
        setMouseState("arrowleft", 'large');
    })
    $('.gallery-container').on("mouseleave", ".slick-prev", function(){
        setMouseState("close", 'small');
    });

    $('.gallery-container').on("mouseenter", ".slick-next", function(){
        setMouseState("arrowright" , 'large');
    });
    $('.gallery-container').on("mouseleave", ".slick-next", function(){
        setMouseState("close" , 'small');
    });


    function teaseArtwork(id){
        if(!currentlyOpenArtworkID == null){return}
        gsap.to([".map-background",".artwork-thumbnail:not([artwork-id='"+id+"']) .blend-image"], {opacity: 0.3, duration: 0.3});
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
        gsap.to([".map-background",".artwork-thumbnail .blend-image"], {opacity: 1, duration: 0.3});
        gsap.to('.map-background', {opacity: 1, duration: 0.3});
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


    function galleryToThumbnailTransition(id){
        let mapImage = $('.artwork-thumbnail[artwork-id='+currentlyOpenArtworkID+']');
        let goalLeft = $(mapImage).attr('data-left') + "%";
        let goalTop = $(mapImage).attr('data-top') + "%";
        let goalWidth = $(mapImage).attr('data-width') + "%";
        let solidImage = $(mapImage).find('.regular-image');



        let tl = gsap.timeline({defaults: {duration: 0.5, ease: "easeOut"} });

        tl.add("start")
        .set(mapImage, {
            opacity: 1, 
        }, "start")
        .to(mapImage, {
            left: goalLeft,
            top: goalTop,
            width: goalWidth
        }, "start")
        .set(solidImage, {
            opacity: 0
        }, "start");

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

        let newLeft = parseInt(backgroundLeft)*-1 + galleryContainerPos.left + borderWidth;
        let newTop = parseInt(backgroundTop)*-1 + galleryContainerPos.top;
        let newWidth = galleryContainerHeight / ($(mapImage).height() / $(mapImage).width());

        let tl = gsap.timeline({defaults: {duration: 0.5, ease: "easeIn"} });
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

    }

    

    function openAboutArea(){
        // close artistarea
        if($(artistArea).hasClass('open')){
            $('.artist-btn').trigger('click');
        }

        // set sizes and animation
        let newHeight = $(window).height() - $('.brand').outerHeight();
        let newButtonX = parseInt($('.about-btn').position(window).left) * -1 + parseInt($('.brand').outerWidth()) + parseInt($('.about-btn').css('padding')); 
        newButtonX = $('.about-btn').attr('transform-x');
        console.log(newButtonX);

        var tl = gsap.timeline();
        tl.to('.about-btn .inner', {x: newButtonX, duration: 0.3})
            .set('.about-btn .close-btn', {opacity: 1}, "<")
            .to('.about-btn .close-btn', {y: 0, duration: 0.3}, "<")
            .set(aboutArea, {height:newHeight});

        $(aboutArea).addClass('open');
    }

    function closeAboutArea(){
        //gsap.to(aboutArea, {height:'0', duration: 0.5});+
        gsap.set(aboutArea, {height:0});

        var tl = gsap.timeline();
        tl.set(aboutArea, {height:0})
        .to('.about-btn .close-btn', {y: "-150%", duration: 0.3}, "<")
        .set('.about-btn .close-btn', {opacity: 1})
        .to('.about-btn .inner', {x: 0, duration: 0.5})
        $(aboutArea).removeClass('open');
    }


    // making the grids match
    function setLayoutAlignment(){
        let brand = $('.brand');
        let singleArtworkOverlay = $('.single-artwork-overlay');

        // layout for minimap
        let ratio = $('.map-background').outerWidth() /  $('.map-background').outerHeight();
        let newWidth = $('.artist-btn').outerWidth() + $('.about-btn').outerWidth();
        $(minimap).attr({
            "data-default-width": newWidth,
            "data-default-height": (newWidth/ratio)
        });
        $(minimap).width(newWidth);
        $(minimap).height(newWidth/ratio);


        // layout for overlay
        $(singleArtworkOverlay).find('.topline-spacer').height($(brand).outerHeight());
        $(singleArtworkOverlay).find('.sidebar').width($(brand).outerWidth());

        // special position for about button
        let newButtonX = parseInt($('.about-btn').position(window).left) * -1 + parseInt($('.brand').outerWidth()); 
        $('.about-btn').attr('transform-x', newButtonX);

    }
    setLayoutAlignment();


    function setMouseState(state, size){
        $(cursorContainer).attr('cursor-state', state);
        $(cursorContainer).attr('cursor-size', size);
    }
})


