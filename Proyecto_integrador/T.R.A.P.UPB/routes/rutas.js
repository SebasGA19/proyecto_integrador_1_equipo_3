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

router.get('/modificar_trabajadores', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
})

router.get('/modificar_clientes', async (req, res) => {
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
                    res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
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
    const estado = parseInt(req.body.estado);
    let passcr = await byscriptjs.hash(password, 8);
    if (cedula && nombre && apellido && correo && telefono && direccion && password) {
        pool.query('SELECT * FROM PERSONAS WHERE CORREO = ?', [correo], async (error, results) => {
            if (results.length == 0) {
                pool.query('INSERT INTO PERSONAS SET ?', { CEDULA: cedula, NOMBRE: nombre, APELLIDO: apellido, CORREO: correo, TELEFONO: telefono, DIRECCION: direccion, ESTADO_PERSONA: estado, CONTRASEÑA: passcr, TIPO_PERSONAS_ID: tipo }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send("Alto exito");
                    }
                })
            } else if (results[0].CEDULA == cedula) {
                res.send("La cedula se encuentra duplicada");
            } else if (results[0].TELEFONO == telefono) {
                res.send("El telefono se encuentra duplicado");
            } else {
                res.send("El correo se encuentra en la base de datos");
            }
        })
    }
})

//Modificar Trabajadores
router.post('/modificar_trabajadores', async (req, res) => {
    const cedula = req.body.cedula;
    pool.query('SELECT * FROM PERSONAS WHERE CEDULA = ?', [cedula], async (error, results) => {
        if (results.length == 0 || results[0].TIPO_PERSONAS_ID == 6) {
            res.send("Cédula no registrada en la base de datos o no tiene permiso para editar este tipo de usuario");
        } else {
            const tipo = req.body.tipo;
            const dato = req.body.cambio;
            const estado = req.body.estado;
            if (tipo == 1) {
                pool.query((`UPDATE PERSONAS SET NOMBRE = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 2) {
                pool.query((`UPDATE PERSONAS SET APELLIDO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 3) {
                pool.query((`UPDATE PERSONAS SET CORREO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 4) {
                pool.query((`UPDATE PERSONAS SET DIRECCION = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 5) {
                pool.query((`UPDATE PERSONAS SET CONTRASEÑA = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else {
                if (estado == 1 || estado == 0) {
                    pool.query((`UPDATE PERSONAS SET ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Logrado");
                        }
                    });
                } else {
                    res.send("No se ha aplicado ningún cambio");
                }
            }
        }
    });
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
    const estado = parseInt(req.body.estado);
    if (cedula && nombre && apellido && correo && telefono && direccion) {
        pool.query('SELECT * FROM PERSONAS WHERE CORREO = ?', [correo], async (error, results) => {
            if (results.length == 0) {
                pool.query('INSERT INTO PERSONAS SET ?', { CEDULA: cedula, NOMBRE: nombre, APELLIDO: apellido, CORREO: correo, TELEFONO: telefono, DIRECCION: direccion, ESTADO_PERSONA: estado, CONTRASEÑA: null, TIPO_PERSONAS_ID: tipo }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send("Alto exito");
                    }
                })
            } else if (results[0].CEDULA == cedula) {
                res.send("La cedula se encuentra duplicada");
            } else if (results[0].TELEFONO == telefono) {
                res.send("El telefono se encuentra duplicado");
            } else {
                res.send("El correo se encuentra en la base de datos");
            }
        })
    }
})

//Consultar Clientes (API)
router.get('/api_cliente', async (req, res) => {
    pool.query('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , ESTADO_PERSONA , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID = 6', async(err,result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result);
            return result;
        }
    })
})

// Modificar cliente 
router.post('/modificar_clientes', async (req, res) => {
    const cedula = req.body.cedula;
    pool.query('SELECT * FROM PERSONAS WHERE CEDULA = ?', [cedula], async (error, results) => {
        if (results.length == 0 || results[0].TIPO_PERSONAS_ID != 6) {
            res.send("Cédula no registrada en la base de datos o no tiene permiso para editar este cliente");
        } else {
            const tipo = req.body.tipo;
            const dato = req.body.cambio;
            const estado = req.body.estado;
            if (tipo == 1) {
                pool.query((`UPDATE PERSONAS SET NOMBRE = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 2) {
                pool.query((`UPDATE PERSONAS SET APELLIDO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 3) {
                pool.query((`UPDATE PERSONAS SET CORREO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else if (tipo == 4) {
                pool.query((`UPDATE PERSONAS SET DIRECCION = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Logrado");
                    }
                });
            } else {
                if (estado == 1 || estado == 0) {
                    pool.query((`UPDATE PERSONAS SET ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Logrado");
                        }
                    });
                } else {
                    res.send("No se ha aplicado ningún cambio");
                }
            }
        }
    });
})

// CAJERO

//Servicios
router.post('/generar_factura',async (req, res) =>{
    const servicio = req.body.servicio;
    const cedula = req.body.cedula;
    const id  = req.body.id;
    const precio = req.body.precio;
    if (cedula && servicio && precio && id) {
        pool.query((`SELECT * FROM PERSONAS AS P , VEHICULOS AS V , TIPO_SERVICIO AS T WHERE V.PERSONAS_CEDULA = P.CEDULA AND P.CEDULA = '${cedula}' AND V.ID = '${id}' AND P.TIPO_PERSONAS_ID = 6 AND T.ID = '${servicio}'`),async(err,result)=>{
            if(err){
                console.log(err);
            }else if(result.length == 0){
                console.log("No existe ese usuario o no tiene vehiculo")
            }else{
                pool.query((`INSERT INTO SERVICIOS (PRECIO,ACTIVO,TIPO_SERVICIO_ID,VEHICULOS_ID) SET VALUES(${precio},${servicio},${id})`),async(error,resultados)=>{
                    if(error){
                        res.send(error);
                    }else{
                        res.send("Exito");
                    }
                })
            }
        });
    }else {
        res.send("Rellene bien la información");
    }
})


router.get('/consultar_trabajadores', async (req, res) => {
    const PERSONAS = await pool.query('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , ESTADO_PERSONA , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID = 6');
    json_personas = JSON.stringify(PERSONAS);
    //console.log(json_personas);
    //res.json(PERSONAS);
    res.send(json_personas);
  });

//Facturas


module.exports = router