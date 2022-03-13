function llenartabla(){
    fetch("http://localhost:4000/api_cliente").then((response)=>response.json()).then((PERSONAS)=>{
        let tabla_clientes = document.querySelector("#tabla-usuarios tbody");
        for(const item of PERSONAS){
            let tr = "<tr><td>"+item.CEDULA+"</td><td>"+item.NOMBRE+"</td><td>"+item.APELLIDO+"</td><td>"+item.CORREO+"</td><td>"+item.TELEFONO+"</td><td>"+item.DIRECCION+"</td><td>"+item.ESTADO_PERSONA+"</td><td>"+item.TIPO_PERSONAS_ID+"</td></tr>"
            tabla_clientes.innerHTML +=tr;
        }
    })
}

llenartabla();