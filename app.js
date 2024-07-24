const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const methodOverride = require('method-override');
const router = require('./routes/restaurants');

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.use(router);

app.listen(port, () =>{
  console.log(`Express server running on http://localhost:${port}`)
})