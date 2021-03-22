let artists, artworks;

$(function(){
    $.getJSON( "./content/artists.json", function( data ) {
        artists = data.artists;
        populateArtistsList();
    });
    
    $.getJSON( "./content/artworks.json", function( data ) {
        artworks = data.artworks;
        populateMapContent();
    });
    
    
    
    function populateArtistsList(){
        var listEntryTemplate = $('.artistlist-entry.template');
        let artistList = $('.artist-area');
        
        
        // Loop Through Artists
        for(let i in artists){
            let artist = artists[i];
            let name = artist.name;
            let artworks = artist.artworks;
            
            let artistEntry = listEntryTemplate.clone();
            $(artistEntry).find('.artist-name').html(name);
            $(artistEntry).removeClass('template');
            let artworksList = $(artistEntry).find('.artist-artworks-list');
            
            // Loop through Artists Artworks
            for (let q in artworks){
                let  artwork = artworks[q];
                let artworkTemplate = $(artworksList).find('.artwork.template');
                let artworkEntry = $(artworkTemplate).clone();
                $(artworkEntry).html(artwork.artwork_title);
                $(artworkEntry).attr('artwork-id', artwork.artwork_id);
                $(artworkEntry).removeClass('template');
                $(artworkEntry).appendTo(artworksList);
            }
            $(artistEntry).appendTo(artistList);
        }
        $(artistList).find('.template').remove();
    }
    
    
    function populateMapContent(){
        let artworkTemplate = $('.artwork-thumbnail.template');
        let artworkThumbnails = $('.artwork-thumbnails');
        
        for(let i in artworks){
            let artwork = artworks[i];
            
            let newArtwork = $(artworkTemplate).clone();
            $(newArtwork)
            .attr({
                'artwork-id': artwork.id,
                'data-left': artwork.pos_x,
                'data-top': artwork.pos_y,
                'data-width': artwork.width
            })
            .css({
                left: `${artwork.pos_x}%`,
                top: `${artwork.pos_y}%`,
                width: `${artwork.width}%`,
            });
            $(newArtwork).removeClass('template');
            $(newArtwork).find('img').attr("src", `content/img/${artwork.id}/a-m.jpg`);
            
            $(newArtwork).appendTo(artworkThumbnails);
        }
    }

});



// global function to be used by other js files
function populateOverlayContent(id){
    if(id == undefined || id == null){return;}
    id = String(id);
    var artwork = artworks.find(artwork=>artwork.id === id);
    
    let overlay = $('.single-artwork-overlay');
    
    // enter metadata
    $(overlay).find('.artist-name').html(artwork.artist_name);
    $(overlay).find('.title').html(artwork.title);
    $(overlay).find('.series').html(artwork.series);
    $(overlay).find('.date').html(artwork.date);
    $(overlay).find('.material').html(artwork.material);
    $(overlay).find('.dimensions').html(artwork.dimensions);

    let galleryContainer = $('.gallery-container');
    $(galleryContainer).html('');

    for (let image in artwork.images){
        image = artwork.images[image];
        let htmlString = `
        <div class="gallery-item">
            <img class="lazy" src="content/img/${id}/${image.image_url}-s.jpg" alt="${image.image_caption}" data-src="content/img/${id}/${image.image_url}-l.jpg">
        </div>`;

        let newItem = $(htmlString);
        $(galleryContainer).append(newItem);
    }
    $('.lazy').Lazy();
}