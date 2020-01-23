const express = require('express');
const app = express();
const { PATH_SCRAPED_ARTWORKS, PATH_CHECKED_POIs } = require('../config/file-paths');
const Artwork = require('../lib/artwork.js');
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");


const PORT = 3000;
const scrapedArtworks = require(PATH_SCRAPED_ARTWORKS);
const checkedPOIs = require(PATH_CHECKED_POIs);

app.use(express.json());

var allArtworksObj = {};

scrapedArtworks.forEach(artwork => {
  allArtworksObj[artwork.id] = artwork;
});

scrapedArtworks.sort((artA, artB) => {
  if(artA.properties.title < artB.properties.title) { return -1; }
  if(artA.properties.title > artB.properties.title) { return 1; }
  return 0;
});



checkedPOIs.forEach(artwork => {
  allArtworksObj[artwork.id] = artwork;
});

app.get('/', (req, res) => 
  res.render('../debug_views/index.ejs', {scrapedArtworks, checkedPOIs})
);

app.get('/POI/:id', (req, res) => 
  res.render('../debug_views/show.ejs', {artwork: 
    allArtworksObj[req.params.id]
    //checkedPOIs[0], getGeolocationForArtwork
  })
);

app.post('/POI/:id', (req, res) => {
  var {title, artist, address, city, state, postalCode, image, description, sourceUrl, id, latitude, longitude} = req.body
  var submittedPOI;
  try {
      submittedPOI = new Artwork({
      title,
      artist,
      address,
      city,
      state,
      postalCode,
      image,
      description,
      sourceURL: sourceUrl,
      sourceOfInformation: "created",
      coordinates: [-121.8868169997836, 37.337850953735156]
    });
    console.log(submittedPOI)
  } catch {
    res.status(400).json({message: "missing details"})
  }

  res.status(201).json({title, artist, address, city, state, postalCode, image, id, latitude, longitude});
  
  
  
})

// serve static files
app.use('/modules', express.static(path.join(__dirname, '/../node_modules')));
app.use('/static', express.static(path.join(__dirname, '/../lib')));


app.listen(PORT, () => {
  console.log(`Running POI Checker on port ${PORT}`);
  console.log(PATH_SCRAPED_ARTWORKS);
});
