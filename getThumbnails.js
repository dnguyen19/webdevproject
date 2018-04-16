const request = require('request');
var piclist = [];

// function that retrieves thumbnails from a search query
module.exports.getThumbnails = function(query, callback) {
    request({
        url: 'https://www.europeana.eu/api/v2/search.json?wskey=BScfR482T&query=' + encodeURIComponent(query),
        json: true
    }, (error, response, body) => {
        if (error) {
            console.log(error)
            callback("can't connect to europeana api");
        } else if (response.statusCode == 401) {
            callback("API key is invalid");

        } else if (response.statusCode == 429) {
            callback("Application has reached its usage limit");

        } else if (response.statusCode == 200) {
            var piclist = [];
            for (i = 0; i < body.items.length; i++) {
                try {
                    piclist.push(body.items[i].edmPreview[0])
                } catch (TypeError) {
                    console.log(Error);
                }
            }
            if (typeof piclist !== 'undefined' && piclist.length > 0){
                callback(null, piclist);
            } else {
                callback('No images found');
            }
            
        }

    });
};



// key BScfR482T
/**
getThumbnails((errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        return piclist;
    }
});
**/