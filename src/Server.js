const express   = require('express'),
  helmet        = require('helmet'),
  cookieSession = require('cookie-session'),
  cookieParser  = require('cookie-parser'),
  bodyParser    = require('body-parser'),
  csrf          = require('csurf');

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser());

const csrfProtection = csrf({ cookie: true });  

const parseForm = bodyParser.urlencoded({ extended: false });

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

app.listen(3000);  

