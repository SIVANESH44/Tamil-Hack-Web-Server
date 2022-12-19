const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport');
const session = require('express-session');
const path = require('path')
const colors = require('colors');
const translate = require('./helper/translate')
const compare = require('./helper/sort')

// load config
dotenv.config({
    path: "./config/config.env"
})

// starting express app
const app = express();
const PORT = process.env.PORT || 3000;

// starting server at PORT 
app.listen(PORT,console.log(`Server is running on port`.magenta.bold + ` : ${PORT}`.white.bold));

// connecting Mongo database    
connectDB();

//body parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//session middleware
const MongStore = require('connect-mongo');
app.use(session({
    secret : 'keyboardcat',
    resave : false,
    saveUninitialized : false,
    store : MongStore.create({
        mongoUrl : process.env.MONGO_URI
    })
}))


if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}


//handlebars
app.engine('.hbs',exphbs.engine({extname : '.hbs',defaultLayout : 'main'}));
app.set('view engine', '.hbs');

//passport sessions
app.use(passport.initialize());
app.use(passport.session());

// static folder 
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/shop',require('./routes/shop'));
app.use('/item',require('./routes/items'));
app.use('/order',require('./routes/order'));
require('./config/passport')(passport);



