var $ = require("jquery");
var artistsJSON = require('../public/content/artists.json');
var artworksJSON = require('../public/content/artists.json');

$(function(){
    populateArtistsList();

    function populateArtistsList(){
        var listEntryTemplate = $('.artistlist-entry.template');
        let artistList = $('.artist-area');

        console.log(artistsJSON);
        console.log(artistsJSON.artists)
        let artists = artistsJSON.artists

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
    }

   

});