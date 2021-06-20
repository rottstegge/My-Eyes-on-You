
$(function(){
    console.log("cursor.js");
    let cursorContainer = $('.cursor-container');
    let cursorSVG = $('.cursor-svg');
    let defaultPath = $('path#default');
    
    // for debug purposes
    let debugCursor = $('.debug-cursor');
    let draggable = $('.map-draggable');
    
    // make object follow mouse
    $(window).on('mousemove', function(event){
        $(cursorContainer).css({
            'left': event.pageX,
            'top': event.pageY
        });

        $(debugCursor).css({
            'left': event.pageX,
            'top': event.pageY
        });


        let mouseX = event.pageX;
        let mouseY = event.pageY;
        mouseX = mouseX + (parseInt($(draggable).css('left'))*-1);
        mouseY = mouseY + (parseInt($(draggable).css('top'))*-1);

        mouseX = parseInt(mouseX / parseInt($(draggable).width())*100);
        mouseY = parseInt(mouseY / parseInt($(draggable).height())*100);


        let string = "xPos:" + mouseX + " | yPos: " + mouseY;
        $(debugCursor).html(string);


    })
    
    
    

    // Mutation Observer
    // different mouse states are handled via mutation observer on the "cursor state attribute"
    function attributeChanged(mutationList) {
        let statemutation = mutationList[0];
        let newState = statemutation.target.attributes["cursor-state"].nodeValue;
        let oldState = statemutation.oldValue;
        let sizemutation = mutationList[0];
        let newSize = sizemutation.target.attributes["cursor-size"].nodeValue;
        let oldSize = statemutation.oldValue;
        if(oldState == newState && oldSize == newSize){return}
        animateCursor(oldState, newState, oldSize, newSize);
    }
    var targetNode = $(cursorContainer)[0];
    // cursor states can be default, open, close, arrow-right, arrow-left
    var observer = new MutationObserver(attributeChanged);
    observer.observe(targetNode, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["cursor-state", "cursor-size"]
    });
    

    
    
    
    
    // Welll


    function animateCursor(oldState, newState, oldSize, newSize){
        //let newSize = $(cursorContainer).attr('cursor-size');
        let tl = gsap.timeline();

        if(oldState !== newState){
            console.log("new state: " + newState + "  old state: " + oldState);
            tl.to(defaultPath, {morphSVG: {shape: `#${newState}`}, duration: 0.3});
        }

        console.log("new size: " + newSize);

        switch(newSize){
            case "small":
                tl.to(cursorContainer, {width: "8vw", height: "8vw", duration: 0.2});
                break;
            case  "medium":
                tl.to(cursorContainer, {width: "14vw", height: "14vw", duration: 0.2});
                break;
            default:
                tl.to(cursorContainer, {width: "20vw", height: "20vw", duration: 0.2});
        }
    }


    
})