const { auth } = require('express-openid-connect');
var createError = require('http-errors');
var cors = require('cors');
var express = require('express');
var app = express();
app.use(cors());
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({extended: false }));
app.use(express.urlencoded({limit: '50mb',extended: false}));
app.use(bodyParser.json({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//   auth({
//     authRequired: false,
//     auth0Logout: true,
//     issuerBaseURL: process.env.ISSUER_BASE_URL,
//     baseURL: process.env.BASE_URL,
//     clientID: process.env.CLIENT_ID,
//     secret: process.env.SECRET,
//     idpLogout: true,
//   })
// );

// app.get('/',(req,res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Longged In': 'Logged out')
// })


// app.use(
//   auth({
//     issuerBaseURL: "https://severalpens.auth0.com",
//     baseURL: "http://localhost:9002",
//     clientID:"dtPzfQ2ugBc1ZrDJiwMrPpls09iJv46B",
//     secret: "4e5bc0c583d657fa28ee34e4181a7bc8d75c2aa08e9a9ad08d0d32cd18f3f69380aae7c3186f1bb8d02d3ad2b6375b8fd1e60ea3b367939450bb8e1a6595fbe3",
//     idpLogout: true,
//   })
// );




app.use((req,res,next) => {
  try{
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if(err){
        console.log(`jwt verify failed`);
        req.verified = false;
        return res.status(404).send(false);
      }
     req.verified = true;
     req.user_id = decoded._id;
     next();
    }); 
  }
  catch {
    return res.status(404).send(false);
  }
})


app.use('/', indexRouter);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
