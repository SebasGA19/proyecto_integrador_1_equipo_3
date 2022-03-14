const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db/database');
const byscriptjs = require('bcryptjs');
var async = require('async');
const { response } = require('express');

// GENERAL

// Redirección de rutas 

//HOME
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../estatica/index.html'));
})

//Rutas generales
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/login.html'));
})

router.get('/modificar_clientes',async (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes.html'));
})

router.get('/ver_clientes', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/consultar_clientes.html'));
})

// Login Trabajador
router.post('/login_trabajadores', async (req, res) => {
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
                    res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 2) {
                    res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
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

// ADMINISTRADOR

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

router.get('/ver_trabajadores',async (req, res) => {
    const data = await pool.query('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , ESTADO_PERSONA , TIPO_PERSONAS_ID FROM PERSONAS');
    res.send(data);
})


// SECRETARIO 

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

// DESARROLLO
//Consultar Clientes (API)

router.get('/api_cliente',async (req, res) => {
    pool.query('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , ESTADO_PERSONA , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID = 6').then((response)=>{
      res.json(response);
    })
})

//DESAROLLO
// Modificar cliente 
router.post('/modificar_clientes',async(req,res)=>{
    const cedula = req.body.cedula;
    pool.query('SELECT * FROM PERSONAS WHERE CEDULA = ?', [cedula] , async(error,results)=>{
        if(results.length == 0 || results[0].TIPO_PERSONAS_ID != 6){
            res.send("Cédula no registrada en la base de datos o no tiene permiso para editar este cliente");
        }else{
            const estado = req.body.estado;
            const dato = req.body.cambio;
            const sentencia = 'UPDATE PERSONAS SET NOMBRE =' +dato+'WHERE CEDULA ='+[results[0].CEDULA];
            console.log(sentencia);
            if(estado == 1){
                pool.query('UPDATE PERSONAS SET NOMBRE =? ',[dato],'WHERE CEDULA =?', [results[0].CEDULA]);
                console.log("Logrado");
            }else if(estado  == 2){
                pool.query('UPDATE PERSONAS SET APELLIDO =? ',[dato],'WHERE CEDULA =?', [results[0].CEDULA]);
                console.log("Logrado");
            }else if(estado == 3){
                pool.query('UPDATE PERSONAS SET CORREO =? ',[dato],'WHERE CEDULA =?', [results[0].CEDULA]);
                console.log("Logrado");
            }else if(estado == 4){
                pool.query('UPDATE PERSONAS SET DIRECCION =? ',[dato],'WHERE CEDULA =?', [results[0].CEDULA]);
                console.log("Logrado");
            }else{
                res.send("Opcion no valida");
            }
        }
    });
})

module.exports = router