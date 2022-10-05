require('colors');

const inquirer = require('inquirer');



const menuOpts=[
    {
        type:"list",
        name:"opcion",
        message:"¿Que desea hacer?",
        choices: [
            {
                value:1,
                name:"1. Buscar ciudad",
            },
            {
                value:2,
                name:"2. Historial",
            },
            {
                value:0,
                name:"0. salir",
            },
            
        ],
    }
];

const inquirerMenu= async()=>{
    console.clear();

    console.log('============================'.green);
    console.log(' Seleccione una opción '.green);
    console.log('============================\n'.green);

    const {opcion}=await inquirer.prompt(menuOpts);
  
    return opcion;
}

const menuPausa=[
    {
        type:"input",
        name:"pausa",
        message:"Presione ENTER para continuar",
    }
];

const pausa= async()=>{
    //console.clear();
    console.log("\n");
    
    return await inquirer.prompt(menuPausa);
}

const leerInput = async(message)=>{
    const question=[
        {
            type:"input",
            name:"desc",
            message,
            validate(value){
                if(value.length==0){
                    return "Escribe algo por favor";
                }
                return true;
            }
        }
    ]

    const {desc}=await inquirer.prompt(question);
    return desc;
}

const listadoLugares=async(lugares=[])=>{

    const question=lugares.map((lugar,idx)=>{
        return {
            value:lugar.id,
            name:`${(idx+1).toString().green}. ${lugar.nombre}`,
        }
    })
    question.push({
        value:0,
        name:"0. Cancelar",
    })

    const menuLugares=[
        {
            type:'list',
            name:'id',
            message:'Seleccione lugar',
            choices:question
        }
    ];
    //console.log(question);
    const {id}= await inquirer.prompt(menuLugares);
    return id;
}

const confirmar=async(message)=>{
    const menuConfirmar=[
        {
            type:"confirm",
            name:"confirmado",
            message,
            
        }
    ];

    const {confirmado}= await inquirer.prompt(menuConfirmar);

    return confirmado;
}

const listadoTareasCompletar=async(tareas=[])=>{

    const question=tareas.map((tarea,idx)=>{
        return {
            value:tarea.id,
            name:`${(idx+1).toString().green}. ${tarea.desc}`,
            checked: (tarea.completadoEn)?true:false,
        }
    })

    const pregunta=[
        {
            type:'checkbox',
            name:'ids',
            message:'Seleccione',
            choices:question
        }
    ];
    //console.log(question);
    const {ids}= await inquirer.prompt(pregunta);
    return ids;
}

module.exports ={
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    confirmar,
    listadoTareasCompletar
}