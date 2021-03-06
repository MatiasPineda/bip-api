const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();


app.set( 'port', ( process.env.PORT || 5000 ));
//http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/SesionPortalServlet?accion=6&NumDistribuidor=99&NomUsuario=usuInternet&NomHost=AFT&NomDominio=aft.cl&Trx=&RutUsuario=0&NumTarjeta=2000&bloqueable=

app.get('/', function(req, res) {
    let n = req.query.n;

    let url = 'http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/SesionPortalServlet?' +
      'accion=6' +
      '&NumDistribuidor=99' +
      '&NomUsuario=usuInternet' +
      '&NomHost=AFT&NomDominio=aft.cl' +
      '&RutUsuario=0' +
      '&NumTarjeta=' + n +
      '&bloqueable=';
    
    request(url, (error, response, html) => {
        let data = [];
        if (!error) {

            const $ = cheerio.load(html);


            $('td.verdanabold-ckc').each(function () {
                data.push($(this).text());
            });
            $('span.arial12-bold-azul').each(function () {
                data.push($(this).text());
            });
        }
        //console.log(data);

        const numeroTarjeta = ()=> {if (isNaN(n)){return 'inválido'} else {return parseInt(n)}};
        const estadoContrato = data[3];
        const saldo = data[5];
        const fechaSaldo = data[7];
        const tipoContrato = () =>{
            let array =[];
            data.forEach(function (item, index, arr) {
                if (item.includes('Tipo de contrato')){
                    array.push(arr[index].replace('Tipo de contrato: ',''))
                }
            });
            if (array.length===0){
                array.push('No se encontró un tipo de contrato');
            }
            return array
        };
        const vencimientoCuotasTransporte = () =>{if(data.length>11){return data[9]}};
        const fechaVencimiento= () =>{if(data.length>11){return data[11]}};
        const valida = () => {return typeof (data[3]) == "string";};

        let json = {
            numeroTarjeta: numeroTarjeta(),
            valida: valida(),
            estadoContrato: estadoContrato,
            saldo: saldo,
            fechaSaldo: fechaSaldo,
            vencimientoCuotaTransporte: vencimientoCuotasTransporte(),
            fechaVencimiento: fechaVencimiento(),
            tipoContrato: tipoContrato()
        };
        //console.log(json);
        res.send(json);
    });
});


app.listen( app.get( 'port' ), function() {
    console.log( 'Node server is running on port ' + app.get( 'port' ));
});
module.exports = app;
