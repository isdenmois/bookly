const https = require('https');

module.exports = (oreq, ores) => {
  const passHeaders = ['cookie', 'accept', 'content-type', 'connection'];
  const options = {
    host: process.env.LL_HOST,
    path: '/apiapp/v2.0' + oreq.url.replace('/api/livelib', ''),
    method: oreq.method,
    headers: {
      'user-agent': process.env.LL_UA,
    },
  };

  passHeaders.forEach(h => {
    if (oreq.headers[h]) {
      options.headers[h] = oreq.headers[h];
    }
  });

  const creq = https
    .request(options, pres => {
      pres.setEncoding('utf8');
      ores.writeHead(pres.statusCode);

      pres.on('data', chunk => ores.write(chunk));
      pres.on('close', () => ores.end());

      pres.on('end', () => ores.end());
    })
    .on('error', e => {
      console.log(e.message);
      try {
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {}
      ores.end();
    });

  creq.end();
};
