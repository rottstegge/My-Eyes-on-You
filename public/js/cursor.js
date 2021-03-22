
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
        if(oldValue == newValue){return}
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

    function animateCursor(oldState, newState){
        let tl = gsap.timeline();
        tl.to(defaultPath, {morphSVG: {shape: `#${newState}`, shapeIndex:1}, duration: 0.3})

        switch(newState){
            case "default":
                tl.to(cursorContainer, {width: "8vw", height: "8vw", duration: 0.2})
                break;
            default:
                tl.to(cursorContainer, {width: "20vw", height: "20vw", duration: 0.2})
        }

            
    }


    
})