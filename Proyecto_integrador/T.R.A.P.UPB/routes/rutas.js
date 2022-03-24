const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db/database');
const byscriptjs = require('bcryptjs');
const notifier = require('node-notifier');
var async = require('async');
const { response } = require('express');
const { json } = require('body-parser');

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


//MODIFICAR
router.get('/modificar_trabajadores', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
})

router.get('/modificar_clientes', async (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes.html'));
})


//CONSULTAR
router.get('/ver_clientes', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/consultar_clientes.html'));
})

router.get('/ver_trabajador', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/consultar_trabajadores.html'));
})

//OTROS
router.get('/principal', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
})


//FACTURACIÓN
router.get('/ver_factura', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/cajero/facturar.html'));
})

// Login Trabajador
router.post('/login_trabajadores', async (req, res) => {
    const correo = req.body.emaillogin;
    const password = req.body.passwordlogin;
    var des = false;
    if (correo && password) {
        pool.query('SELECT * FROM PERSONAS WHERE CORREO =?', [correo], async (error, results) => {
            if (results.length == 0) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'No se encontro el correo deseado',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/login.html'));
            } else if (results[0].CONTRASEÑA != password) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'Contraseña incorrecta',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/login.html'));
            } else {
                //console.log("Bienvenido", results[0].NOMBRE);
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
                    notifier.notify({
                        title: 'ADVERTENCIA',
                        message: 'No esta asignado , vuelva pronto',
                        wait:false
                      });
                      res.sendFile(path.join(__dirname, '../home/login.html'));
                }
            }
        })
    }else{
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene los datos deseados',
            wait:false
          });
          res.sendFile(path.join(__dirname, '../home/login.html'));
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
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha añadido el trabajador',
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
                    }
                })
            } else if (results[0].CEDULA == cedula) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'La cedula ya esta registrada',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
            } else if (results[0].TELEFONO == telefono) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'El telefono ya esta registrado',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
            } else {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'El correo ya esta registrado',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
            }
        })
    }else{
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene bien los datos',
            wait:false
          });
          res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
    }
})

//Modificar Trabajadores
router.post('/modificar_trabajadores', async (req, res) => {
    const cedula = req.body.cedula;
    pool.query('SELECT * FROM PERSONAS WHERE CEDULA = ?', [cedula], async (error, results) => {
        if (results.length == 0 || results[0].TIPO_PERSONAS_ID == 6) {
            notifier.notify({
                title: 'ADVERTENCIA',
                message: 'Cedula no registrada o no tiene permiso pa modificar este usuario',
                wait:false
              });
              res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
        } else {
            const tipo = req.body.tipo;
            const dato = req.body.cambio;
            const estado = req.body.estado;
            if (tipo == 1) {
                pool.query((`UPDATE PERSONAS SET NOMBRE = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha modificado el usuario ' +  results[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                    }
                });
            } else if (tipo == 2) {
                pool.query((`UPDATE PERSONAS SET APELLIDO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha modificado el usuario ' +  results[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                    }
                });
            } else if (tipo == 3) {
                pool.query((`UPDATE PERSONAS SET CORREO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha modificado el usuario ' +  results[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                    }
                });
            } else if (tipo == 4) {
                pool.query((`UPDATE PERSONAS SET DIRECCION = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha modificado el usuario ' +  results[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                    }
                });
            } else if (tipo == 5) {
                pool.query((`UPDATE PERSONAS SET CONTRASEÑA = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha modificado el usuario ' + results[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                    }
                });
            } else {
                if (estado == 1 || estado == 0) {
                    pool.query((`UPDATE PERSONAS SET ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            notifier.notify({
                                title: 'ADVERTENCIA',
                                message: 'Se ha actualizado la actividad del usuario ' +  results[0].NOMBRE,
                                wait:false
                              });
                              res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                        }
                    });
                } else {
                    notifier.notify({
                        title: 'ADVERTENCIA',
                        message: 'No se ha aplicado ningún cambio',
                        wait:false
                      });
                      res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                }
            }
        }
    });
})


//Consultar Trabajadores (API)
router.get('/api_trabajador', async (req, res) => {
    pool.query(('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID != 6'),async(error,result)=>{
        var data = [];
        var subdata = [];
        for (var i = 0 ; i < result.length ; i++){
            aux = []
            subdata = aux;
            subdata.push(result[i].CEDULA.toString());
            subdata.push(result[i].NOMBRE.toString());
            subdata.push(result[i].APELLIDO.toString());
            subdata.push(result[i].CORREO.toString());
            subdata.push(result[i].TELEFONO.toString());
            subdata.push(result[i].DIRECCION.toString());
            subdata.push(result[i].TIPO_PERSONAS_ID.toString());
            data.push(subdata);
        }
        //console.log(data);
        res.send(data);
    })
    
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
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha añadido el cliente',
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
                    }
                })
            } else if (results[0].CEDULA == cedula) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'La cedula ya esta registrada',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
            } else if (results[0].TELEFONO == telefono) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'El telefono ya se encuentra registrado',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
            } else {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'Rellene bien la información',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
            }
        })
    }
})

//Consultar Clientes (API)
router.get('/api_cliente', async (req, res) => {
    pool.query(('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID = 6'),async(error,result)=>{
        var data = [];
        var subdata = [];
        for (var i = 0 ; i < result.length ; i++){
            aux = []
            subdata = aux;
            subdata.push(result[i].CEDULA.toString());
            subdata.push(result[i].NOMBRE.toString());
            subdata.push(result[i].APELLIDO.toString());
            subdata.push(result[i].CORREO.toString());
            subdata.push(result[i].TELEFONO.toString());
            subdata.push(result[i].DIRECCION.toString());
            data.push(subdata);
        }
        //console.log(data);
        res.send(data);
    })
    
})

// Modificar cliente 
router.post('/modificar_clientes', async (req, res) => {
    const cedula = req.body.cedula;
    pool.query('SELECT * FROM PERSONAS WHERE CEDULA = ?', [cedula], async (error, results) => {
        if (results.length == 0 || results[0].TIPO_PERSONAS_ID != 6) {
            notifier.notify({
                title: 'ADVERTENCIA',
                message: 'La cedula no corresponde a una accesible para este usuario o el cliente no existe ',
                wait:false
              });
              res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));
        } else {
            const tipo = req.body.tipo;
            const dato = req.body.cambio;
            const estado = req.body.estado;
            if (tipo == 1) {
                pool.query((`UPDATE PERSONAS SET NOMBRE = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha actualizado el cliente '+results[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));
                    }
                });
            } else if (tipo == 2) {
                pool.query((`UPDATE PERSONAS SET APELLIDO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha actualizado el cliente '+result[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));
                    }
                });
            } else if (tipo == 3) {
                pool.query((`UPDATE PERSONAS SET CORREO = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha actualizado el cliente '+result[0].NOMBRE,
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));
                    }
                });
            } else if (tipo == 4) {
                pool.query((`UPDATE PERSONAS SET DIRECCION = '${dato}' , ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha actualizado el cliente '+result[0].NOMBRE,
                            wait:false
                          });
                        res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));
                    }
                });
            } else {
                if (estado == 1 || estado == 0) {
                    pool.query((`UPDATE PERSONAS SET ESTADO_PERSONA = ` + [estado] + ` WHERE CEDULA = '${[results[0].CEDULA]}'`), async (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            notifier.notify({
                                title: 'ADVERTENCIA',
                                message: 'Se ha actualizado el cliente '+result[0].NOMBRE,
                                wait:false
                              });
                              res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));;
                        }
                    });
                } else {
                    notifier.notify({
                        title: 'ADVERTENCIA',
                        message: 'No se ha aplicado ningún cambio',
                        wait:false
                      });
                      res.sendFile(path.join(__dirname, '../home/secretario/modificar_clientes'));
                }
            }
        }
    });
})

// CAJERO

//Servicios
router.post('/generar_servicio', async (req, res) => {
    const servicio = req.body.servicio;
    const cedula = req.body.cedula;
    const id_vehiculo = req.body.id;
    const precio = req.body.precio;
    if (cedula && servicio && precio && id_vehiculo) {
        pool.query((`SELECT * FROM PERSONAS AS P , VEHICULOS AS V , TIPO_SERVICIO AS T WHERE V.PERSONAS_CEDULA = P.CEDULA AND P.CEDULA = '${cedula}' AND V.ID = '${id_vehiculo}' AND P.TIPO_PERSONAS_ID = 6 AND T.ID = '${servicio}'`), async (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length == 0) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'No existe este usuario o el cliente no tiene vehiculo ',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
            } else {
                pool.query((`INSERT INTO SERVICIOS (PRECIO,ACTIVO,TIPO_SERVICIO_ID,VEHICULOS_ID) VALUES (${precio},1,${servicio},${id_vehiculo})`), async (error, resultados) => {
                    if (error) {
                        res.send(error);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha agregado el servicio ',
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
                    }
                })
            }
        });
    } else {
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene bien la información ',
            wait:false
          });
          res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
    }
})

//Facturas
router.post('/generar_factura', async (req, res) => {
    const cedula = req.body.cedula;
    const id_vehiculo = req.body.id;
    if (cedula && id_vehiculo) {
        pool.query((`SELECT CONCAT(P.NOMBRE , " " , P.APELLIDO ) AS NOMBRES , SUM(S.PRECIO) AS PRECIO , NOW() AS FECHA , P.CEDULA , P.TIPO_PERSONAS_ID FROM PERSONAS AS P , VEHICULOS AS V , SERVICIOS AS S WHERE V.PERSONAS_CEDULA = P.CEDULA AND P.CEDULA = ${cedula} AND V.ID = ${id_vehiculo} AND P.TIPO_PERSONAS_ID = 6 AND S.VEHICULOS_ID = V.ID AND S.ACTIVO = 1`), async (error, result) => {
            if (result.length == 0) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'No hay ningún usuario o el mismo no ha comprado ningún servicio ',
                    wait:false
                  });
                  res.sendFile(path.join(__dirname, '../home/cajero/facturar.html'));
            } else {
                const nombre = result[0].NOMBRES;
                const precio = result[0].PRECIO;
                pool.query((`INSERT INTO FACTURA (NOMBRE_COMPLETO,PRECIO_FINAL,FECHA,PERSONAS_CEDULA,PERSONAS_TIPO_PERSONAS_ID) VALUES('${nombre}',${precio},NOW(),'${cedula}',6)`), async (error) => {
                    pool.query((`UPDATE SERVICIOS SET ACTIVO = 0 WHERE VEHICULOS_ID = ${id_vehiculo}`), async (ror) => {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se han facturado los servicios ',
                            wait:false
                          });
                          res.sendFile(path.join(__dirname, '../home/cajero/facturar.html'));
                    })
                })
            }
        })
    } else {
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Datos incompletos ',
            wait:false
          });
          res.sendFile(path.join(__dirname, '../home/cajero/facturar.html'));
    }
})

module.exports = router