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


    // Minimap Functionality
    // $('.minimap').on("mousedown", function(event){
    //     let indicator = positionIndicator;
    //     let indicatorWidth = parseInt($(indicator).width());
    //     let indicatorHeight = parseInt($(indicator).height());

    //     let mouseX = event.offsetX - (indicatorWidth/2);
    //     let mouseY = event.offsetY - (indicatorHeight/2);
    //     let minimapWidth = parseInt($(this).width());
    //     let minimapHeight = parseInt($(this).height());

    //     let xPos = map(mouseX, 0, minimapWidth, 0, 100);
    //     let yPos = map(mouseY, 0, minimapHeight, 0, 100);
    //     moveMapTo(xPos, yPos);
    // });

    $('.minimap').on("mouseover", function(event){
        if(!event.which == 1){return};
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
