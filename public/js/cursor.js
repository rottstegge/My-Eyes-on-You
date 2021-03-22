
$(function(){
    console.log("cursor.js");
    let cursorContainer = $('.cursor-container');
    let cursorSVG = $('.cursor-svg');
    let defaultPath = $('path#default');
    
    // make object follow mouse
    $(window).on('mousemove', function(event){
        $(cursorContainer).css({
            'left': event.pageX,
            'top': event.pageY
        });
    })
    
    
    

    // Mutation Observer
    // different mouse states are handled via mutation observer on the "cursor state attribute"
    function attributeChanged(mutationList) {
        let mutation = mutationList[0];
        let newValue = mutation.target.attributes["cursor-state"].nodeValue;
        let oldValue = mutation.oldValue;
        animateCursor(oldValue, newValue);
    }
    var targetNode = $(cursorContainer)[0];
    // cursor states can be default, open, close, arrow-right, arrow-left
    var observer = new MutationObserver(attributeChanged);
    observer.observe(targetNode, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["cursor-state"]
    });
    

    
    
    
    
    // Welll
    function setMouseState(state){
        $(cursorContainer).attr("cursor-state", state);
    }
    
    function animateCursor(oldPath, newPath){
        gsap.to(defaultPath, {morphSVG: {shape: `#${newPath}`, shapeIndex:1}, duration: 0.3})
    }
    
    $('.gallery-container').on("mouseenter", ".slick-prev", function(){
        setMouseState("arrowleft");
    })
    $('.gallery-container').on("mouseleave", ".slick-prev", function(){
        setMouseState("close");
    });
    
    $('.gallery-container').on("mouseenter", ".slick-next", function(){
        setMouseState("arrowright");
    });
    $('.gallery-container').on("mouseleave", ".slick-next", function(){
        setMouseState("close");
    });

    
})