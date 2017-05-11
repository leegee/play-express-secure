'use strict';

const express   = require('express'),
  helmet        = require('helmet'),
  RateLimiter   = require('express-rate-limit'),
  cookieSession = require('cookie-session'),
  cookieParser  = require('cookie-parser'),
  bodyParser    = require('body-parser'),
  csrf          = require('csurf');

const rateLimiter = new RateLimiter({
  windowMs: 15*60*1000, // 15 minutes 
  max: 100, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});

const app = express();
app.use(helmet());
app.use(rateLimiter);
app.use(cookieParser());
app.use(bodyParser());

const csrfProtection = csrf({ cookie: true });  

const parseForm = bodyParser.urlencoded({ extended: false });

app.use(cookieSession({  
  name: 'session',
  keys: [
    process.env.COOKIE_KEY1,
    process.env.COOKIE_KEY2
  ]
}));

app.use( (req, res, next) => {  
  var n = req.session.views || 0;
  req.session.views = n++;
  res.end(n + ' views');
});

app.get('/form', csrfProtection, function(req, res) {  
  // pass the csrfToken to the view 
  res.render('send', { csrfToken: req.csrfToken() });
});

app.post('/process', parseForm, csrfProtection, function(req, res) {  
  res.send('data is being processed');
});

/*
<form action="/process" method="POST">  
  <input type="hidden" name="_csrf" value="{{csrfToken}}">

  Favorite color: <input type="text" name="favoriteColor">
  <button type="submit">Submit</button>
</form>
*/

// app.listen(3000);  

module.exports  = app;
