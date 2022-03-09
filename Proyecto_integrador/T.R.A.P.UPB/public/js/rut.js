const formulario=document.getElementById('formulario');
const inputs=document.querySelectorAll('#formulario input');//arreglo de todos los inputs, el numeral es porque es un ID

const expresiones = {//objeto 1223
	cedula: /^{4,16}$/, // numeros
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,14}$/ ,// 7 a 14 numeros.
    direccion: /^[a-zA-Z0-9\_\-]{4,40}$/, // Letras, numeros, guion y guion_bajo
	password: /^.{4,12}$/, // 4 a 12 digitos.
    password2: /^.{4,12}$/ // 4 a 12 digitos.

}
let nombres=['cedula','nombre','apellido','correo','telefono','direccion','password','password2']

let grup=['grupo__cedula','grupo__nombre','grupo__apellido','grupo__correo','grupo__telefono','grupo__direccion','grupo__password','grupo__password2']


const campos={//objeto en donde todas sus variables se encuentran el false
    cedula: false,
    nombre:false,
    apellido:false,
    correo:false,
    telefono:false,
    direccion:false
    
}
const validarFormulario=(e)=>{//funcion de tipo flecha que es evaluada con keyup
    switch(e.target.name) {//Evalua el name del input
        case "cedula":
            validarInformacion(expresiones.cedula.test(e.target.value),'grupo__cedula','cedula') 
        break;

        case "nombre":
            validarInformacion(expresiones.nombre.test(e.target.value),'grupo__nombre','nombre') 
        break;

        case "apellido":
            validarInformacion(expresiones.apellido.test(e.target.value),'grupo__apellido','apellido') 
        break;

        case "correo":
            validarInformacion(expresiones.correo.test(e.target.value),'grupo__correo','correo') 
        break;


        case "telefono":
            validarInformacion(expresiones.telefono.test(e.target.value),'grupo__telefono','telefono')
        break;

        case "direccion":
            validarInformacion(expresiones.direccion.test(e.target.value),'grupo__direccion','direccion')
        break;

        case "password":
            validarInformacion(expresiones.password.test(e.target.value),'grupo__password','password')

            var contra1=document.getElementById('password');
            var contra2=document.getElementById('password2');

            if(contra2.value!=""){
                compararPassword(contra1,contra2)
            }

        break;

        case "password2":

            var contra1=document.getElementById('password');
            var contra2=document.getElementById('password2');

            compararPassword(contra1,contra2)

        break;

       
    }
}

inputs.forEach((input) =>{
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);    
});
var btn=document.querySelector('.fomulario__btn')
    btn.addEventListener('click',(e)=>{
    e.preventDefault();//previene que sea enviado
    console.log('hola');

    const terminos=document.getElementById('terminos');

    if(campos.cedula && campos.nombre && campos.nombre2 && campos.apellido && campos.apellido2 && campos.password && campos.correo && campos.telefono && terminos.checked)
    {
        formulario.reset();// se reinician todos los campos del formulario
        document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo')

        document.querySelectorAll('.formulario__grupo-correcto').forEach((icono)=>{
            icono.classList.remove('formulario__grupo-correcto');//borra los iconos 
        });

        document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo')

        document.querySelector('#grupo__terminos .formulario__input-errorn').classList.remove('formulario__input-error-activo');
    }
    else {
        document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo')
    
        for (var i = 0; i < 9; i++) {
            var y=document.getElementById(nombres[i]);
            if(y.value==""){
                validarInfo2(grup[i],nombres[i])
            }
            y="";
        }
        if(terminos.checked==false){
            document.querySelector('#grupo__terminos .formulario__input-errorn').classList.add('formulario__input-error-activo');
        }
    }
    
})

function compararPassword(contra1,contra2){
   
    if(contra1.value!=contra2.value){

        document.getElementById('grupo__password2').classList.add('formulario__grupo-incorrecto')

        document.getElementById('grupo__password2').classList.remove('formulario__grupo-correcto')

        document.querySelector('#grupo__password2 i').classList.add('fa-times-circle');
        document.querySelector('#grupo__password2 i').classList.remove('fa-check-circle');
        document.querySelector('#grupo__password2 .formulario__input-error').classList.add('formulario__input-error-activo');
        campos['password']=false;

    }else if(contra1.value==contra2.value && contra1.value!="" && contra1.  value!=""){
        document.getElementById('grupo__password2').classList.remove('formulario__grupo-incorrecto')

        document.getElementById('grupo__password2').classList.add('formulario__grupo-correcto')

        document.querySelector('#grupo__password2 i').classList.add('fa-check-circle');
        document.querySelector('#grupo__password2 i').classList.remove('fa-times-circle');
        document.querySelector('#grupo__password2 .formulario__input-error').classList.remove('formulario__input-error-activo'); 
        campos['password']=true;
    }
}
function validarInformacion(campoAValidar, grupoAValidar,variable){

    var x=document.getElementById(variable);

    if(x.value==""){
        
        document.getElementById(grupoAValidar).classList.add('formulario__grupo-incorrecto')

        document.getElementById(grupoAValidar).classList.remove('formulario__grupo-correcto')

        document.querySelector('#'+grupoAValidar+' i').classList.add('fa-times-circle');
        document.querySelector('#'+grupoAValidar+' i').classList.remove('fa-check-circle');
        
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-errorn').classList.add('formulario__input-error-activo');
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-error').classList.remove('formulario__input-error-activo');
        campos[variable]=false;
    }

    if(x.value!=""){
        console.log(x);
        document.getElementById(grupoAValidar).classList.add('formulario__grupo-incorrecto')

        document.getElementById(grupoAValidar).classList.remove('formulario__grupo-correcto')

        document.querySelector('#'+grupoAValidar+' i').classList.add('fa-times-circle');
        document.querySelector('#'+grupoAValidar+' i').classList.remove('fa-check-circle');
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-error').classList.add('formulario__input-error-activo');
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-errorn').classList.remove('formulario__input-error-activo');
        
        campos[variable]=false;}
    
    if(campoAValidar){//se accede a el valor en el input 
        document.getElementById(grupoAValidar).classList.remove('formulario__grupo-incorrecto')

        document.getElementById(grupoAValidar).classList.add('formulario__grupo-correcto')

        document.querySelector('#'+grupoAValidar+' i').classList.add('fa-check-circle');
        document.querySelector('#'+grupoAValidar+' i').classList.remove('fa-times-circle');
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-error').classList.remove('formulario__input-error-activo');
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-errorn').classList.remove('formulario__input-error-activo');
        campos[variable]=true;

    }
}   
function validarInfo2(grupoAValidar,variable)  {
    document.getElementById(grupoAValidar).classList.add('formulario__grupo-incorrecto')

        document.getElementById(grupoAValidar).classList.remove('formulario__grupo-correcto')

        document.querySelector('#'+grupoAValidar+' i').classList.add('fa-times-circle');
        document.querySelector('#'+grupoAValidar+' i').classList.remove('fa-check-circle');
        
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-errorn').classList.add('formulario__input-error-activo');
        document.querySelector('#'+grupoAValidar+ ' .formulario__input-error').classList.remove('formulario__input-error-activo');
        campos[variable]=false;
}




