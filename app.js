const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const handlebars = require('handlebars');

const router = require('./routes');
const passport = require('passport');

const messageHandler = require('./middlewares/message-handler');
const errorHandler = require('./middlewares/error-handler');

const port = 3000;

handlebars.registerHelper('eq', (arg1,arg2) => {
  return arg1 === arg2
})

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'thisIsSecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(messageHandler);
app.use(router);
app.use(errorHandler);

app.listen(port, () =>{
  console.log(`Express server running on http://localhost:${port}`)
})