/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file, we check the connection of the user (if the user wants
 * it) to call the renderer process afterwards
 *
 */

const path = require('path')

window.Vue = require(path.join(__dirname, 'node_modules', 'vue', 'dist', 'vue.js'))

// Will be set with the user's configuration once configuration is
// implemented
const check = false

// Path of the renderer process
const rendererPath = path.join(__dirname, 'src', 'renderer.js')

if (check)
{
  const isOnline = require('is-online')

  isOnline((err, online) => {
     if (err) throw err

     if (online) {
       require(rendererPath)
       document.getElementById('container').style.display = 'block'
     }
     else
     {
       document.getElementById('not-online').style.display = 'block'

       document.getElementById('not-online-button').addEventListener('click', () => {
         location.reload()
       })
     }
   })
}
else
{
  require(rendererPath)
  document.getElementById('container').style.display = 'block'
}
