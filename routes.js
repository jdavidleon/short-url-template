const express = require('express');
const validUrl = require('valid-url');
const Url = require('./model-url.js');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const dns = require('node:dns');

const router = express.Router();


//opetions

const optionsDns = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
//
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// define the home page route
router.post('/shorturl', async (req, res) => {
  const {url} = req.body;
  
  if(!(validUrl.isHttpUri(url) || validUrl.isHttpsUri(url))) return res.json({ error: 'invalid url' });
  if(!validUrl.isWebUri(url)) return res.status(401).send({ error: 'invalid url' }); 
  
  try {
    let fineOne = await Url.findOne({ original_url: url });
    console.log(`url in the data base? -> ${fineOne}`);
    
    if(fineOne) return res.status(400).json(fineOne);
    
    fineOne = new Url({
          original_url: url,
          short_url: nanoid(2)
        });
    await fineOne.save();
    console.log('New url stored');
    res.status(200).json(fineOne);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Get all users
router.get('/shorturl/all', async (req, res) => {
  try {
    const urlsFound = await Url.find({});
    
    urlsFound? res.status(200).json(urlsFound) : res.status(404).send('without urls');
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//Get uset by id
router.get('/shorturl/:id', async (req, res) => {
  const {id} = req.params;
  
  try{
    let urlInDB = await Url.findOne({
      short_url: id
    });
    
    urlInDB? res.redirect(urlInDB.original_url) : res.status(400).json({ error: 'invalid url' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
