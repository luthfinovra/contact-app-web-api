const express = require("express");

const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require('connect-mongo');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');

const webRoutes  = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');

const dbUrl = process.env.DB_URL || `mongodb://127.0.0.1:27017/contactApp`;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "database connection error"))
db.once("open", ()=>{
    console.log("Database connected");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Konfigurasi session
const secret = process.env.SECRET || 'secretSessionKey';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
})

store.on('error', function (err) {
    console.error("session store error", err);
})

const sessionConfig = {
    store,
    name: 'randomcookie',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));


// Routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.all('*', (req, res, next) => {
    res.send('404 Not Found')
    //next(new ExpressError('404 Page Not Found', 404))
})


//Start Server
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('listening on http://localhost:3000');
})