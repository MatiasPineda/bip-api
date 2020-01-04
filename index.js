const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();

const router = express.Router();


//http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/SesionPortalServlet?accion=6&NumDistribuidor=99&NomUsuario=usuInternet&NomHost=AFT&NomDominio=aft.cl&Trx=&RutUsuario=0&NumTarjeta=2000&bloqueable=

let getBip = app.get('/', function(req, res) {
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
        console.log(data);

        const numeroTarjeta = parseInt(n);
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

        console.log(tipoContrato()[0]===undefined);

        let json = {
            numeroTarjeta: numeroTarjeta,
            valida: valida(),
            estadoContrato: estadoContrato,
            saldo: saldo,
            fechaSaldo: fechaSaldo,
            vencimientoCuotaTransporte: vencimientoCuotasTransporte(),
            fechaVencimiento: fechaVencimiento(),
            tipoContrato: tipoContrato()
        };
        console.log(json);
        res.send(json);
    });
});

/*
app.listen('3000');
console.log('API is running on http://localhost:3000');
module.exports = app;
 */
router
  .route('/bip/v1/:n')
  .get(getBip);

module.exports = router;


