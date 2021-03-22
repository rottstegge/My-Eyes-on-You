
$(function(){
    console.log("cursor.js");
     let cursorContainer = $('.cursor-container');
     let cursorSVG = $('.cursor-svg');
    $(window).on('mousemove', function(event){
        console.log(event.pageX);
        $(cursorContainer).css({
            'left': event.pageX,
            'top': event.pageY
        });
    })



    // different mouse states are handled via mutation observer on the "cursor state attribute"
    function attributeChanged(mutationList) {
        mutationList.forEach(function(mutation) {
          switch(mutation.type) {
            case "attributes":
              notifyUser("Attribute name " + mutation.attributeName +
                  " changed to " + mutation.target[mutation.attributeName] +
                  " (was " + mutation.oldValue + ")");
              break;
          }
        });
      }
      
      var targetNode = $(cursorContainer)[0];
      
      var observer = new MutationObserver(attributeChanged);
      observer.observe(targetNode, {
        attributes: true,
        attributeOldValue: true
      });


})