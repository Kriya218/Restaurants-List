const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.static('public'));