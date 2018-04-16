const express = require('express');
const request = require('request');
const getThumbs = require('./getThumbnails.js');
const fs = require('fs');
const dom = require('dom-parser');

const hbs = require('hbs');
var thumbs = [],
    nquery = '';
const port = process.env.PORT || 8080;

var app = express();

var todo = {
    title: 'title',
    imgs: 'imgs',
};

var addItem = (title, imgs) => {
    console.log('Adding item');

    var imglist = []

    todo.title = title;
    todo.imgs = imgs;

    imglist.push(todo);

    var readtodo = fs.readFileSync('todo.json');

    if (readtodo != '') {
        var data = JSON.parse(readtodo);

        for (var i = 0; i < data.length; i++) {
            imglist.push(data[i])
        };
    };
    
    fs.writeFileSync('todo.json', JSON.stringify(imglist));
};

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


// show the search box
app.get('/', (request, response) => {
    response.render('search.hbs')
});

app.get('/g', (request, response) => {
    response.render('gallery.hbs')
});

// show the result of the search
app.get('/results', (request, response) => {
    nquery = response.req.query.query;
    // get picture links from the query
    getThumbs.getThumbnails(nquery, (errorMessage, results) => {

        if (results == undefined) {
            console.log(errorMessage);
            response.send('<h1>' + errorMessage + '</h1>');
        } else {
           global.formatThumbs = '';
           global.listofimgs = [];
           global.galThumbs = '';

           for (i = 0; i < results.length; i++) {
               listofimgs.push(results[i]);
               galThumbs += '<img class="thumbnails" src="' + results[i];
               formatThumbs += '<img class="thumbnails" src="' + results[i] + '" <br><form id="favForm" method="GET" action="/favorite">'+
               '<button name="favorite" id="favorite" value="' + i + '"' + ' type="submit">❤</button></form>';
           }

            console.log(formatThumbs);
            var readresults = fs.readFileSync('results.json');
            var total = JSON.parse(readresults);
            var part1 = total.part1;
            var part2 = total.part2;

            //
            // display the thumbnails on the website
            response.send(part1 + part2 + formatThumbs);
        }
    });

    ////// + '<form method="post" action="/gallery"><br>'+'<input name="like" id="like" value="Like" type="submit" /><br></form>'

});

app.get('/gallery', (request, response) => {
    if (request.query.title != undefined){
        addItem(request.query.title, formatThumbs);
};
    var readtodo = fs.readFileSync('todo.json');
    var piclist = JSON.parse(readtodo);
    var gallery_val = '';
    for (var i=0; i<piclist.length; i++){
        gallery_val += '<div id="galDiv" <br>'+ 'Album title: ' + piclist[i].title +'<br><div id="galDivPic" <img id="galDivPic" src="'+ piclist[i].imgs + '</div> </div>';
    }

    var readgallery = fs.readFileSync('gallery.json');
    var galPage = JSON.parse(readgallery);
    var galPage1 = galPage.gal1;

    response.send(galPage1 + gallery_val);
});

// app.post('/gallery', (request, response) => {
//     response.send(200);
// });

app.get('/favorite', (req, res) => {
   console.log(req.query.favorite);
   if (req.query.favorite != undefined){
       favItem(listofimgs[req.query.favorite]);
};
   var readimgs = fs.readFileSync('imgs.json');
   var favlist = JSON.parse(readimgs);
   var fav_val = '';
   for (var i=0; i<favlist.length; i++){
       fav_val += '<img src="' + favlist[i] + '" <br>';
   };

   var fav = fs.readFileSync('favorite.json');
   var favP = JSON.parse(fav);
   var favPage = favP.fav1;

   res.send(favPage + fav_val);
});

var favItem = (imgs) => {
   console.log('Favorite item');

   var photolist = []

   photolist.push(imgs);

   var readimgs = fs.readFileSync('imgs.json');

   if (readimgs != '') {
       var dataimg = JSON.parse(readimgs);

       for (var i = 0; i < dataimg.length; i++) {
           photolist.push(dataimg[i])
       };
   };
   
   fs.writeFileSync('imgs.json', JSON.stringify(photolist));
   
};

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);


})