const express   = require('express'),
  helmet        = require('helmet'),
  cookieSession = require('cookie-session');  

var app = express();
app.use(helmet());  

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

