const createError = require('http-errors');
const express = require('express');
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const viewRouter = require('./routes/index');
const userRouter = require('./routes/user/');
const productRouter = require('./routes/product');

const mongoUri = process.env.MONGODB_URI;

const app = express();

const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 72, // Session data will be stored for 3 days
});
  
store.on('error', (err) => {
    console.error('MongoDB Session Store Error:', err);
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 72, // Session cookie will expire in 3 days
        },
    })
);







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));

app.use('/', viewRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

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
    res.render('error');
});

module.exports = app;