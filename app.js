require('dotenv').config();

const {inquirerMenu,
        pausa,
        leerInput,
        listadoLugares}=require('./helpers/inquirer');

const Busquedas=require('./models/Busquedas');


const main=async()=>{
    let opt
    const busqueda=new Busquedas();
    
    do {
        opt= await inquirerMenu();
        switch (opt) {
            case 1:
                //mostrar msg
                const termino=await leerInput("Ciudad : ");

                //buscar el lugar
                const lugares=await busqueda.ciudad(termino);
                //console.log(lugares);

                //seleccionar el lugar
                const idLugar=await listadoLugares(lugares);
                //console.log("\n"+idLugar);
                if(idLugar==0) continue;

                const lugarSeleccionado=lugares.find(lugar=>lugar.id==idLugar);
                //console.log(lugarSeleccionado);

                //guardar en db
                busqueda.agregarHistorial(lugarSeleccionado.nombre);
                
                //clima
                const climaLugar=await busqueda.clima(lugarSeleccionado["lat"],lugarSeleccionado["lng"])
                
                //resultados
                console.log("informacion del lugar");
                console.log("Ciudad :",lugarSeleccionado["nombre"]);
                console.log("Lat :", lugarSeleccionado["lng"]);
                console.log("Lng :", lugarSeleccionado["lat"]);
                console.log("Temperatura :",climaLugar.temp );
                console.log("Minima :", climaLugar.tempmin);
                console.log("Maxima :",climaLugar.tempmax );
                console.log("Descripción clima :",climaLugar.desc );
            break;

            case 2:
                //mostrar msg
                //console.log(busqueda.historial);
                //console.log(busqueda.historialCapitalizado+"\n");
                busqueda.historial.forEach((lugar,i)=>{
                    console.log(`${i+1}. ${lugar}`);
                })

            break;

        }

        if(opt!=0)await pausa();
    } while (opt!=0);


}

main();