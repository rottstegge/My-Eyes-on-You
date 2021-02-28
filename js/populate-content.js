var $ = require("jquery");
var artistsJSON = require('../public/content/artists.json');
var artworksJSON = require('../public/content/artists.json');

$(function(){
    populateArtistsList();

    function populateArtistsList(){
        var listEntryTemplate = $('.artistlist-entry-template');
        let artistList = $('.artist-area');

        for (let artist in artistsJSON.artists) {
            console.log({artist});             

            var newEntry = $(listEntryTemplate).clone();
            $(newEntry).find('.artist-name').text(artist);

            let artworksList = $(newEntry).find('.artist-artworks-list')
            console.log(artist["artworks"]);             

            for(let artwork in artist.artworks){
                console.log("artwork:" + artwork);             
            }

            $(artistList).append(newEntry);
        }
    }

});