const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const methodOverride = require('method-override');
const router = require('./routes/restaurants');
const session = require('express-session');
const flash = require('connect-flash');
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler');

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(messageHandler);
app.use(router);
app.use(errorHandler);

app.listen(port, () =>{
  console.log(`Express server running on http://localhost:${port}`)
})