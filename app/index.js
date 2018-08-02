require('./process.js')
require('./analytics.js')

require('./server.js')

!process.env.KAWANIME_SERVER === 'true' && require('./electron')
