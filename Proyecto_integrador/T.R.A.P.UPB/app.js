//Declaracion 
const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Inicialización de la app
const app = express();

//Configuracion
app.set('port',process.env.PORT || 4000);
app.use(morgan('dev'));

//Archivos estaticos
app.use(express.static(path.join(__dirname,'../public')))
app.use(express.static(path.join(__dirname,'../home')))

//Rutas
const rutas = require('./routes/rutas')
app.use(rutas)

//Inicializar servidor
app.listen(app.get('port'),()=>{
    console.log('Servidor en el puerto',app.get('port'));
});