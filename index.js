require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const connectDB = require('./db');
const routes = require('./routes');


/*   BASIC CONGIFURARION   */
const port = process.env.PORT || 5000;

// CONNECT
connectDB();


/*   MIDDLEWARE   */
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*   ROUTES   */ 
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
//
app.use('/api', routes);


/*   LISTENER   */
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
