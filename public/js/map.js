// implement map drag and zooming functionality

$(function(){
    console.log("map.js ready");
    let mousedown = false;
    let currentTop = 0;
    let currentLeft = 0;

    let draggable = $('.map-draggable');
    let draggableWidth = $(draggable).width();
    let draggableHeight = $(draggable).height();

    let draggableContainer = $('.map-container');
    let draggableContainerWidth = $(draggableContainer).width();
    let draggableContainerHeight = $(draggableContainer).height();


    let positionIndicator = $('.minimap .position-indicator');

    let previousMouseX, previousMouseY;

    let miniMapNavSpeed = 2;

    let blendImages = $('.artwork-thumbnail .blend-image');





    // Implement Dragging Functionality

    $('.map-draggable').on("mousedown", function(event){
        event.stopPropagation();
        mousedown = true;
        previousMouseX = event.pageX;
        previousMouseY = event.pageY;
    });
    $('.map-draggable').on("mouseup", function(event){
        event.stopPropagation();
        mousedown = false;
    });

    $('.map-container').on("mousemove", function(event){
        if(mousedown){
            let mouseX = event.pageX;
            let mouseY = event.pageY;

            let mouseXDelta = previousMouseX - mouseX;
            let mouseYDelta = previousMouseY - mouseY;

            currentTop = parseInt($(draggable).css('top'));
            currentLeft = parseInt($(draggable).css('left'));
            let newLeft = currentLeft-mouseXDelta;
            let newTop = currentTop-mouseYDelta;

            draggableWidth = $(draggable).width();
            draggableHeight = $(draggable).height();

            // prevent moving out of screen
            newLeft = constrain(newLeft, (draggableWidth-draggableContainerWidth)*-1, 0);
            newTop = constrain(newTop,  (draggableHeight-draggableContainerHeight)*-1, 0);

            $(draggable).css({
                'left': newLeft,
                'top': newTop
            });

            previousMouseX = mouseX;
            previousMouseY = mouseY;

            updateMiniMap();
        }
    });

    $('.artist-area').on('click', ".artwork", function(){
        let id = $(this).attr('artwork-id');
        // find artwork
       let artworkThumbnail = $(draggableContainer).find(".artwork-thumbnail[artwork-id='"+id+"']");
       let left = $(artworkThumbnail).attr('data-left');
       let top = $(artworkThumbnail).attr('data-top');

        console.log("clicked on " + id + " in the list");
        console.log({left, top});

        moveMapTo(parseInt(left), parseInt(top), "CENTER");

    });

    // perspective tilt for artworks on mouse move
    $('.map-container').on('mousemove', function(event){
        if((blendImages).length < 2){
            blendImages = $('.artwork-thumbnail .blend-image');
            return;
        }

        $(blendImages).each(function(index){
            if(!$(this).visible()){return};
            let rotX = (draggableContainerWidth/2 - event.pageX) / 35;
            let rotY = (draggableContainerHeight/2 - event.pageY) / 35;
            $(this).css('transform', `rotateX(${rotY}deg) rotateY(${rotX}deg)`)
        });
    });




    // accepts percentage values on x and y axis
    function moveMapTo(xPos, yPos, mode){
        let containerWidth = parseInt($(draggableContainer).width());
        let containerHeight = parseInt($(draggableContainer).height());
        let draggableWidth = parseInt($(draggable).width());
        let draggableHeight = parseInt($(draggable).height());
        currentTop = parseInt($(draggable).css('top'));
        currentLeft = parseInt($(draggable).css('left'));

        let newLeft = draggableWidth*(xPos/100);
        let newTop = draggableHeight*(yPos/100);


        if(mode == 'CENTER'){
            newLeft = newLeft - (containerWidth/2);
            newTop = newTop - (containerWidth/2);
        }

        newLeft = -1* constrain(newLeft, 0, draggableWidth - containerWidth);
        newTop = -1* constrain(newTop, 0, draggableHeight - containerHeight);

        // calculate delta distance (pythagoras) to get consistent speeds
        let dist = Math.sqrt( Math.pow((currentTop-newTop), 2) + Math.pow((currentLeft-newLeft), 2) );
        let animduration = dist/(1000*miniMapNavSpeed);

        gsap.to(draggable, 
            {
                left: newLeft, 
                top: newTop, 
                duration: animduration,
                onUpdate: function(){
                    updateMiniMap();
                }
            });
    }


    //Minimap Functionality
    $('.minimap').on("click", function(event){
        let indicator = positionIndicator;
        let indicatorWidth = parseInt($(indicator).width());
        let indicatorHeight = parseInt($(indicator).height());

        let mouseX = event.offsetX - (indicatorWidth/2);
        let mouseY = event.offsetY - (indicatorHeight/2);
        let minimapWidth = parseInt($(this).width());
        let minimapHeight = parseInt($(this).height());

        let xPos = map(mouseX, 0, minimapWidth, 0, 100);
        let yPos = map(mouseY, 0, minimapHeight, 0, 100);
        moveMapTo(xPos, yPos);
    });
    // for dragging
    $('.minimap').on("mousemove", function(event){
        console.log(event.which);
        if(event.which !== 1){return;}
        let indicator = positionIndicator;
        let indicatorWidth = parseInt($(indicator).width());
        let indicatorHeight = parseInt($(indicator).height());

        let mouseX = event.offsetX - (indicatorWidth/2);
        let mouseY = event.offsetY - (indicatorHeight/2);
        let minimapWidth = parseInt($(this).width());
        let minimapHeight = parseInt($(this).height());

        let xPos = map(mouseX, 0, minimapWidth, 0, 100);
        let yPos = map(mouseY, 0, minimapHeight, 0, 100);
        moveMapTo(xPos, yPos);
    });

    // updating is run when user moves on map
    function updateMiniMap(){
        // set size
        let indicatorSize = (draggableContainerWidth / draggableWidth * 100); // percentage vale
        indicatorSize = indicatorSize + "%";

        // set position
        let draggablePosX = parseInt($(draggable).css('left'));
        let draggablePosY = parseInt($(draggable).css('top'));
        let indicatorPosX = ((draggablePosX / draggableWidth * 100)*-1) + "%";
        let indicatorPosY = ((draggablePosY / draggableHeight * 100)*-1) + "%";

        $(positionIndicator).css({
            left: indicatorPosX,
            top: indicatorPosY,
            width: indicatorSize,
            height: indicatorSize
        });
    }

    updateMiniMap();

})


function constrain(value, boundA, boundB){
    let upperBound = boundA > boundB ? boundA : boundB;
    let lowerBound = boundA > boundB ? boundB : boundA;
    value = value > upperBound ? upperBound : value;
    value = value < lowerBound ? lowerBound : value;
    return value;
}

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;



!function(t){var i=t(window);t.fn.visible=function(t,e,o){if(!(this.length<1)){var r=this.length>1?this.eq(0):this,n=r.get(0),f=i.width(),h=i.height(),o=o?o:"both",l=e===!0?n.offsetWidth*n.offsetHeight:!0;if("function"==typeof n.getBoundingClientRect){var g=n.getBoundingClientRect(),u=g.top>=0&&g.top<h,s=g.bottom>0&&g.bottom<=h,c=g.left>=0&&g.left<f,a=g.right>0&&g.right<=f,v=t?u||s:u&&s,b=t?c||a:c&&a;if("both"===o)return l&&v&&b;if("vertical"===o)return l&&v;if("horizontal"===o)return l&&b}else{var d=i.scrollTop(),p=d+h,w=i.scrollLeft(),m=w+f,y=r.offset(),z=y.top,B=z+r.height(),C=y.left,R=C+r.width(),j=t===!0?B:z,q=t===!0?z:B,H=t===!0?R:C,L=t===!0?C:R;if("both"===o)return!!l&&p>=q&&j>=d&&m>=L&&H>=w;if("vertical"===o)return!!l&&p>=q&&j>=d;if("horizontal"===o)return!!l&&m>=L&&H>=w}}}}(jQuery);
