//Declaracion 
var bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Inicialización de la app
const app = express();

//Configuracion
app.set('port',process.env.PORT || 4000);
app.use(morgan('dev'));
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//Archivos estaticos
app.use(express.static(path.join(__dirname,'../estatica')));
app.use(express.static(path.join(__dirname,'../home')));
app.use(express.static(path.join(__dirname, 'public')));

//Rutas
app.use(bodyParser.urlencoded({extended: false}));
const rutas = require('../T.R.A.P.UPB/routes/rutas.js');
app.use(rutas);

//Inicializar servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en el puerto',app.get('port'));
});