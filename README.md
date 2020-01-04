# bip-api
Scraping sitio web <i>bip! en linea</i>
<br/>
Entrega en JSON el saldo y datos de la tarjeta

Solicita un parámetro <code>n</code>: número entero
<p>
Ejemplo <a href='https://mpv-bip-api.herokuapp.com/?n=11111111'>https://mpv-bip-api.herokuapp.com/?n=11111111</a>

<p>
Formato:
<ul>
  <li><code>numeroTarjeta</code>: (int) Entrega número de tarjeta Bip ingresada. Retorna el string 'inválido' cuando el parámetro entregado no es un número</li>
  <li><code>valida</code>: (bool) <code>true</code> si la tarjeta es válida y <code>false</code> si no.</li>
  <li><code>estadoContrato</code>: (string) Indica si el contrato de tarjeta se encuentra activo.</li>
  <li><code>saldo</code>: (string) Indica saldo en la tarjeta</li>
  <li><code>fechaSaldo</code>: (string) Indica fecha y hora de última actualización de saldo segun tarjetabip.cl</li>
  <li><code>tipoContrato</code>: (array) Lista de strings que indican los tipos de contrato asociados a la tarjeta</li>
</ul>
