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

router.get('/mecanicox', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/mecanico/actualizar_estado_servicio.html'));
})

router.get('/historia_informe', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/informe_facturas.html'));
})


router.post('/api_generar_factura_fisico', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/cajero/factura_fisico_api.html'));
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

//Generar Informe de servicios
router.get('/generar_informe', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/generar_informe.html'));
})

//CONSULTAR
router.get('/ver_clientes', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/consultar_clientes.html'));
})

router.get('/ver_trabajador', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/consultar_trabajadores.html'));
})

router.get('/ver_servicios', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/consultar_estado_servicio.html'));
})


router.get('/asignar_citas', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/asignar_citas.html'));
})

router.get('/consultar_estado_servicio', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/mecanico/consultar_estado_servicio.html'));
})


router.get('/recepcion', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/recepcionista/recepcionista.html'));
})



//OTROS
router.get('/principal', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
})
//OTROS
router.get('/cajero', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
})


//})

//OTROS
router.get('/volver', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/mecanico/mecanico.html'));
})


//OTROS
router.get('/registro_tipo_servicios', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/administrador/registro_tipo_servicios.html'));
})
//OTROS
router.get('/registro_clientes', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
})

router.get('/actualizar_estado_servicio', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/mecanico/actualizar_estado_servicio.html'));
})


router.get('/entrega_vehiculo', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/recepcionista/entrega_vehiculos.html'));
})


//FACTURACIÓN
router.get('/ver_factura', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/cajero/facturar.html'));
})


router.get('/ver_factura_fisico', (req, res) => {
    res.sendFile(path.join(__dirname, '../home/cajero/factura_fisico.html'));
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
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/login.html'));
            } else if (results[0].CONTRASEÑA != password) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'Contraseña incorrecta',
                    wait: false
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
                    res.sendFile(path.join(__dirname, '../home/recepcionista/recepcionista.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 4) {
                    res.sendFile(path.join(__dirname, '../home/mecanico/consultar_estado_servicio.html'));
                } else if (results[0].TIPO_PERSONAS_ID == 5) {
                    res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
                } else {
                    notifier.notify({
                        title: 'ADVERTENCIA',
                        message: 'No esta asignado , vuelva pronto',
                        wait: false
                    });
                    res.sendFile(path.join(__dirname, '../home/login.html'));
                }
            }
        })
    } else {
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene los datos deseados',
            wait: false
        });
        res.sendFile(path.join(__dirname, '../home/login.html'));
    }
})

//Entrega de vehiculo
router.post('/api_entrega_vehiculo', (req, res) => {
    const id = req.body.id;
    //  pool.query(('SELECT ID , VEHICULOS_ID , ACTIVO FROM SERVICIOS AS S, VEHICULOS AS V WHERE S.ACTIVO = 0 AND '+ id +' = V.ID AND S.VEHICULOS_ID=V.ID'),async(error,results)=>{
    pool.query(`SELECT * ID FROM VEHICULOS AS V, SERVICIOS AS S V WHERE S.ACTIVO=0 AND V.ID='${id}'`, async (error, results) => {
        console.log(id);
        console.log(results.length)
        //console.log(data);
    })
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
                            wait: false
                        });
                        res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
                    }
                })
            } else if (results[0].CEDULA == cedula) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'La cedula ya esta registrada',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
            } else if (results[0].TELEFONO == telefono) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'El telefono ya esta registrado',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
            } else {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'El correo ya esta registrado',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/administrador/principal.html'));
            }
        })
    } else {
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene bien los datos',
            wait: false
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
                wait: false
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
                            message: 'Se ha modificado el usuario ' + results[0].NOMBRE,
                            wait: false
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
                            message: 'Se ha modificado el usuario ' + results[0].NOMBRE,
                            wait: false
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
                            message: 'Se ha modificado el usuario ' + results[0].NOMBRE,
                            wait: false
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
                            message: 'Se ha modificado el usuario ' + results[0].NOMBRE,
                            wait: false
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
                            wait: false
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
                                message: 'Se ha actualizado la actividad del usuario ' + results[0].NOMBRE,
                                wait: false
                            });
                            res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                        }
                    });
                } else {
                    notifier.notify({
                        title: 'ADVERTENCIA',
                        message: 'No se ha aplicado ningún cambio',
                        wait: false
                    });
                    res.sendFile(path.join(__dirname, '../home/administrador/modificar_trabajadores.html'));
                }
            }
        }
    });
})


//Consultar Trabajadores (API)
router.get('/api_trabajador', async (req, res) => {
    pool.query(('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID != 6'), async (error, result) => {
        var data = [];
        var subdata = [];
        for (var i = 0; i < result.length; i++) {
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

//Consultar facturas (API)
router.get('/api_trabajador', async (req, res) => {
    pool.query(('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID != 6'), async (error, result) => {
        var data = [];
        var subdata = [];
        for (var i = 0; i < result.length; i++) {
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



//Consultar Servicios (API)
router.get('/api_servicios', async (req, res) => {
    pool.query(('SELECT ID , PRECIO , ACTIVO , TIPO_SERVICIO_ID , VEHICULOS_ID FROM SERVICIOS'), async (error, result) => {
        var data = [];
        var subdata = [];
        for (var i = 0; i < result.length; i++) {
            aux = []
            subdata = aux;
            subdata.push(result[i].ID.toString());
            subdata.push(result[i].PRECIO.toString());
            subdata.push(result[i].ACTIVO.toString());
            subdata.push(result[i].TIPO_SERVICIO_ID.toString());
            subdata.push(result[i].VEHICULOS_ID.toString());
            data.push(subdata);
        }
        //console.log(data);
        res.send(data);
    })

})


//Consultar Servicios (API)
router.get('/api_consultar_estado_servicio', async (req, res) => {

    console.log(tipo);
    pool.query(('SELECT ID , ACTIVO FROM SERVICIOS  '), async (error, result) => {
        var data = [];
        var subdata = [];
        for (var i = 0; i < result.length; i++) {
            aux = []
            subdata = aux;
            subdata.push(result[i].ID.toString());
            subdata.push(result[i].ACTIVO.toString());

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
                            wait: false
                        });
                        res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
                    }
                })
            } else if (results[0].CEDULA == cedula) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'La cedula ya esta registrada',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
            } else if (results[0].TELEFONO == telefono) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'El telefono ya se encuentra registrado',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
            } else {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'Rellene bien la información',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/secretario/secretario.html'));
            }
        })
    }
})

//Consultar Clientes (API)
router.get('/api_cliente', async (req, res) => {
    pool.query(('SELECT CEDULA , NOMBRE , APELLIDO , CORREO , TELEFONO , DIRECCION , TIPO_PERSONAS_ID FROM PERSONAS WHERE TIPO_PERSONAS_ID = 6'), async (error, result) => {
        var data = [];
        var subdata = [];
        for (var i = 0; i < result.length; i++) {
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

//Consultar Factura (API)
router.get('/api_factura', async (req, res) => {
    pool.query(('SELECT * FROM FACTURA'), async (error, result) => {
        var data = [];
        var subdata = [];
        for (var i = 0; i < result.length; i++) {
            aux = []
            subdata = aux;
            subdata.push(result[i].ID_FACTURA.toString());
            subdata.push(result[i].NOMBRE_COMPLETO.toString());
            subdata.push(result[i].PRECIO_FINAL.toString());
            subdata.push(result[i].FECHA.toString());
            subdata.push(result[i].PERSONAS_CEDULA.toString());
            if(result[i].PERSONAS_TIPO_PERSONAS_ID != 6){
                subdata.push("Trabajador");
            }else{
                subdata.push("Cliente");
            }
            data.push(subdata);
        }
        //console.log(data);
        res.send(data);
    })

})

//Recepcion Vehiculo(API)
router.post('/recepcion_vehiculo', async (req, res) => {
    const id = req.body.id;
    const modelo = req.body.modelo;
    const ano = req.body.ano;
    const descripcion_falla = req.body.descripcion;
    const personas_cedula = req.body.personas_cedula;
    console.log(id);
    console.log(modelo);
    console.log(ano);
    console.log(descripcion_falla);
    console.log(personas_cedula);
    const personas_tipo_personas_id = 6;
    if (id && modelo && ano && descripcion_falla && personas_cedula && personas_tipo_personas_id) {
        pool.query('SELECT * FROM VEHICULOS AS V, PERSONAS AS P WHERE V.ID = ?', [id] + ' V.PERSONAS_CEDULA= P.CEDULA ', async (error, results) => {
            if (results.length == 0) {
                pool.query('INSERT INTO VEHICULOS SET ?', { ID: id, MODELO: modelo, AÑO: ano, DESCRIPCIÓN_FALLA: descripcion_falla, PERSONAS_CEDULA: personas_cedula, PERSONAS_TIPO_PERSONAS_ID: personas_tipo_personas_id }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha añadido el vehiculo',
                            wait: false
                        });
                        res.sendFile(path.join(__dirname, '../home/recepcionista/recepcionista.html'));
                    }
                })
            } else if (results[0].CEDULA != cedula) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'La cedula no esta registrada',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/recepcionista/recepcionista.html'));
            }
            else {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'Rellene bien la información',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/recepcionista/recepcionista.html'));
            }
        })
    }
})

// Modificar cliente 
router.post('/registrar_citas', async (req, res) => {
    const des = req.body.d_cita;
    const fecha = req.body.fecha;
    const cedula = req.body.cedula;
    if(des && fecha && cedula){
        pool.query((`SELECT * FROM PERSONAS WHERE CEDULA = ${cedula} `),async(error, resultados)=>{
            if(resultados.length == 0 ){
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'No se encontro ningún registro con esa cedula',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/secretario/asignar_citas.html'));
            }else{
                pool.query((`SELECT * FROM CITAS WHERE FECHA = '${fecha}'`),async(e,r)=>{
                    if(r.length == 0){
                        pool.query((`INSERT INTO CITAS (DESCRIPCION_CITA,REALIZADA,FECHA,PERSONAS_CEDULA,PERSONAS_TIPO_PERSONAS_ID) VALUES ('${des}',0,'${fecha}',${cedula},6)`),async(error2,resultados2)=>{
                            if(error2){
                                console.log(error2);
                            }else{
                                notifier.notify({
                                    title: 'ADVERTENCIA',
                                    message: 'Se registro la cita de '+ resultados[0].NOMBRE,
                                    wait: false
                                });
                                res.sendFile(path.join(__dirname, '../home/secretario/asignar_citas.html'));
                            }
                        })
                    }else{
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Ese horario ya esta ocupado',
                            wait: false
                        });
                        res.sendFile(path.join(__dirname, '../home/secretario/asignar_citas.html'));
                    }
                })
            }
        })
    }else{
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene bien la información',
            wait: false
        });
        res.sendFile(path.join(__dirname, '../home/secretario/asignar_citas.html'));
    }
})

// CAJERO
//Servicios
router.post('/generar_servicio', async (req, res) => {
    const servicio = req.body.servicio;
    const cedula = req.body.cedula;
    const id_vehiculo = req.body.id;
    const precio = req.body.precio;
    console.log(servicio);
    console.log(cedula);
    console.log(id_vehiculo);
    console.log(precio);
    if (cedula && servicio && precio && id_vehiculo) {
        pool.query((`SELECT * FROM PERSONAS AS P , VEHICULOS AS V , TIPO_SERVICIO AS T WHERE V.PERSONAS_CEDULA = P.CEDULA AND P.CEDULA = '${cedula}' AND V.ID = '${id_vehiculo}' AND P.TIPO_PERSONAS_ID = 6 AND T.ID = '${servicio}'`), async (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length == 0) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'No existe este usuario o el cliente no tiene vehiculo ',
                    wait: false
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
                            wait: false
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
            wait: false
        });
        res.sendFile(path.join(__dirname, '../home/cajero/cajero.html'));
    }
})

router.post('/generar_tipo_servicio', async (req, res) => {
    const servicio = req.body.id;
    const tipo_servicio = req.body.tipo_servicio;
    console.log(servicio);
    console.log(tipo_servicio);
    if (servicio && tipo_servicio) {
        pool.query((`SELECT * FROM SERVICIOS AS S WHERE S.ID = '${servicio}'`), async (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.length != 0) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'Ya existe el servicio',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/administrador/registro_tipo_servicios.html'));
            } else {
                pool.query((`INSERT INTO TIPO_SERVICIO (ID, TIPO_SERVICIO) VALUES ('${servicio}', '${tipo_servicio}');`), async (error, resultados) => {
                    if (error) {
                        res.send(error);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha agregado el servicio ',
                            wait: false
                        });
                        res.sendFile(path.join(__dirname, '../home/administrador/registro_tipo_servicios.html'));
                    }
                })
            }
        });
    } else {
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene bien la información ',
            wait: false
        });
        res.sendFile(path.join(__dirname, '../home/administrador/registro_tipo_servicios.html'));
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
                    wait: false
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
                            wait: false
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
            wait: false
        });
        res.sendFile(path.join(__dirname, '../home/cajero/facturar.html'));
    }
})

router.post('/api_actualizar_estado_servicio', async (req, res) => {
    console.log("inicio");
    const id = req.body.id;
    const estado = parseInt(req.body.estado);

    console.log(estado + " est");

    if (id) {
        pool.query((`SELECT * FROM SERVICIOS AS S WHERE S.ID = '${id}'`), async (err, result) => {
            console.log(result.length);
            if (err) {
                console.log(err);
            } else if (result.length == 0) {
                notifier.notify({
                    title: 'ADVERTENCIA',
                    message: 'No existe el servicio',
                    wait: false
                });
                res.sendFile(path.join(__dirname, '../home/mecanico/actualizar_estado_servicio.html'));
            } else {
                console.log("entra");
                pool.query((`UPDATE SERVICIOS SET ACTIVO = '${estado}' WHERE ID= '${id}';`), async (error, resultados) => {
                    if (error) {
                        res.send(error);
                    } else {
                        notifier.notify({
                            title: 'ADVERTENCIA',
                            message: 'Se ha actualizado el servicio ',
                            wait: false
                        });
                        res.sendFile(path.join(__dirname, '../home/mecanico/actualizar_estado_servicio.html'));
                    }
                })
            }
        });
    } else {
        notifier.notify({
            title: 'ADVERTENCIA',
            message: 'Rellene bien la información ',
            wait: false
        });
        res.sendFile(path.join(__dirname, '../home/mecanico/actualizar_estado_servicio.html'));
    }
})


module.exports = router