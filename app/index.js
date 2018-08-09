require('./server.js')

!(process.env.KAWANIME_SERVER === 'true') && require('./electron')

require('./process.js')
require('./analytics.js')
