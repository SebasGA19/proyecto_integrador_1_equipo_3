const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db/database');
const byscriptjs = require('bcryptjs');
var async = require('async');

// Redirección de rutas 
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../estatica/index.html'));
})

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
                    res.sendFile(path.join(__dirname, '../home/cajero.html'));
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


router.get('/ver_trabajadores',async (req, res) => {
    const data = await pool.query('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , ESTADO_PERSONA , TIPO_PERSONAS_ID FROM PERSONAS');
    //res.sendFile(path.join(__dirname,'../home/ver_trabajadores.html'),{data});
    res.send(data);
})

router.post('/generar_factura',async (req, res) =>{
    const cedula = req.body.cedula;
    const servicio = req.body.servicio;
    const nombre = null;
    const apellido = null;
    const correo = null;
    const telefono = null;
    const direccion = null;

    if (cedula && servicio) {
        pool.query('SELECT * FROM PERSONAS WHERE CEDULA =?', [cedula], async (error, results) => {
            if (results.length == 0) {
                res.send("No se encontro ningun usuario");
            } else {
                nombre = results[0].NOMBRE;
                apellido = results[0].APELLIDO;
                telefono = results[0].TELEFONO;
                correo = results[0].CORREO;
                direccion = results[0].DIRECCION;
                console.log("Bienvenido", results[0].CORREO);
                des = true;
            }
            
        })
    }
})

module.exports = router