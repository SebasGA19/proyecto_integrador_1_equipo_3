const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db/database');
const byscriptjs = require('bcryptjs');
var async = require('async');

// Redirección de rutas 
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/login.html'));
})

router.get('/ver_trabajadores', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/ver_trabajadores.html'));
})

// Login Trabajador
router.post('/auth', async (req, res) => {
    const correo = req.body.emaillogin;
    const password = req.body.passwordlogin;
    var des = false;
    if (correo && password) {
        pool.query('SELECT * FROM PERSONAS WHERE CORREO =?', [correo], async (error, results) => {
            if (results.length == 0) {
                res.send("No se encontro ningun usuario");
            } else if (results[0].CONTRASEÑA != password) {
                res.send("Contraseña incorrecta");
            } else {
                console.log("Bienvenido", results[0].NOMBRE);
                des = true;
            }
            if (des == true) {
                if (results[0].TIPO_PERSONAS_ID == 1) {
                    res.sendFile(path.join(__dirname, '../home/principal.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 2) {
                    res.sendFile(path.join(__dirname, '../home/secretario.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 3) {
                    res.sendFile(path.join(__dirname, '../home/recepcionista.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 4) {
                    res.sendFile(path.join(__dirname, '../home/mecanico.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 5) {
                    res.sendFile(path.join(__dirname, '../home/caja.html'));
                } else {
                    res.send("No esta asignado , vuelva pronto", results[0].NOMBRE);
                }
            }
        })
    }
})

//Registro trabajadores
router.post('/registro_trabajadores', async (req, res) => {
    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    const password = req.body.password;
    const tipo = req.body.tipo;
    const estado = req.body.estado;
    let passcr = await byscriptjs.hash(password, 8);
    if (cedula && nombre && apellido && correo && telefono && direccion && password) {
        pool.query('SELECT * FROM PERSONAS WHERE CORREO = ?', [correo], async (error, results) => {
            if (results.length == 0) {
                pool.query('INSERT INTO PERSONAS SET ?', { CEDULA: cedula, NOMBRE: nombre, APELLIDO: apellido, CORREO: correo, TELEFONO: telefono, DIRECCION: direccion, ESTADO_PERSONA: estado, CONTRASEÑA: passcr, TIPO_PERSONAS_ID: tipo }, async(error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send("Alto exito");
                    }
                })
            } else if(results[0].CEDULA == cedula){
                res.send("La cedula se encuentra duplicada");
            }else if(results[0].TELEFONO == telefono){
                res.send("El telefono se encuentra duplicado");
            }else{
                res.send("El correo se encuentra en la base de datos");
            }
        })
    }
})

// Registro clientes
router.post('/registro_clientes', async (req, res) => {
    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const correo = req.body.correo;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    const tipo = 6;
    const estado = 1;
    if (cedula && nombre && apellido && correo && telefono && direccion) {
        pool.query('SELECT * FROM PERSONAS WHERE CORREO = ?', [correo], async (error, results) => {
            if (results.length == 0) {
                pool.query('INSERT INTO PERSONAS SET ?', { CEDULA: cedula, NOMBRE: nombre, APELLIDO: apellido, CORREO: correo, TELEFONO: telefono, DIRECCION: direccion, ESTADO_PERSONA: estado, CONTRASEÑA: null, TIPO_PERSONAS_ID: tipo }, async(error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send("Alto exito");
                    }
                })
            } else if(results[0].CEDULA == cedula){
                res.send("La cedula se encuentra duplicada");
            }else if(results[0].TELEFONO == telefono){
                res.send("El telefono se encuentra duplicado");
            }else{
                res.send("El correo se encuentra en la base de datos");
            }
        })
    }
})

button5.addEventListener('click', () => {

    var tableBody="";
    tableBody=document.getElementById('tablebody');

    var queryString = 'SELECT * FROM PERSONAS';

    connection.query(queryString, function(err, results) {
      if (err) throw err;

        for (i = 0; i < results.length; i++) {
        tableBody += '<tr>';
        tableBody += '  <td>' + results[i].idCliente + '</td>';
        tableBody += '  <td>' + results[i].nombreCliente + '</td>';
        tableBody += '  <td>' + results[i].apellidoCliente + '</td>';
        tableBody += '  <td>' + results[i].cedulaCliente + '</td>';
        tableBody += '  <td>' + results[i].telefonoCliente + '</td>';
        tableBody += '  <td>' + results[i].celularCliente + '</td>';
        tableBody += '  <td>' + results[i].direccionCliente + '</td>';
        tableBody += '  <td>' + results[i].emailCliente + '</td>';
        tableBody += '</tr>';
        }
    });

    connection.end(() => {
    });
});

module.exports = router