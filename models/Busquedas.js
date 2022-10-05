const fs=require('fs');

const axios=require('axios');


class Busquedas{
    historial=[];
    archivo='./db/database.json';
    constructor(){
        //leer db si existe
        this.leerDB();
    }

    // get historialCapitalizado(){
    //     const palabras=this.historial.map(lugar=>{
    //         lugar.split(' ').map(elemento=>{
    //             return elemento.toUpperCase();
    //         })
    //     });
    //     return palabras;
    // }

    get paramsMapBox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    async ciudad(lugar=""){
        try {
            //Peticion http
            const instance=axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params:this.paramsMapBox
            })
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?limit=5&proximity=ip&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1Ijoic21vbnJveWgiLCJhIjoiY2w4bWMyb3BvMDd5bDN1bzNqNzFyb2ZubCJ9.2shc1ryzBSNHP_VT7jctJA');
            
            const resp= await instance.get();
            return resp.data.features.map(lugar=> ({
                id:lugar.id,
                nombre:lugar.place_name,
                lng:lugar.center[0],
                lat:lugar.center[1]
            }))

            // console.log(resp.data.features);

        } catch (error) {
            console.log("erroraso")
            console.log(error);
            return [];
        }
    }

    get paramsClima(){
        return {

            appid:process.env.OPENWEATHER_KEY,
            units:"metric",
            lang:"es" 
        }
    }

    async clima(lat,lon){
        try {
          
            const instance= axios.create({
                baseURL:"https://api.openweathermap.org/data/2.5/weather",
                params:{...this.paramsClima,lat,lon}
            })
            //instance axios
            const resp =await instance.get();

                
            //console.log(resp.data);
            

            return{
                desc:resp.data.weather[0].description,
                tempmin:resp.data.main.temp_min,
                tempmax:resp.data.main.temp_max,
                temp:resp.data.main.temp
            }

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    agregarHistorial(lugar=""){
        //Prevenir duplicados
        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }

        //this.historial.splice(0,5);
        this.historial.unshift(lugar.toLowerCase());
        //Grabar en DB

        this.guardarDB();
    }

    guardarDB(){
        const payload={
            historial:this.historial
        }
        fs.writeFileSync(this.archivo,JSON.stringify(payload));
    }

    leerDB(){
        if(!fs.existsSync(this.archivo))return null;

        const info=fs.readFileSync(this.archivo,{encoding:"utf8"});
        const data=JSON.parse(info);
        //console.log(data);

        this.historial=data.historial;

       

    }
}

module.exports=Busquedas;

