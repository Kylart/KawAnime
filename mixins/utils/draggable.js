// Shamelessly inspired by https://www.w3schools.com/howto/howto_js_draggable.asp

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
  if (document.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    const newTop = elmnt.offsetTop - pos2
    const newLeft = elmnt.offsetLeft - pos1

    // We don't want the video to be outside the screen
    if (newTop > 23 && newTop < window.innerHeight - elmnt.clientHeight) elmnt.style.top = newTop + 'px'
    if (newLeft > 0 && newLeft < window.innerWidth - elmnt.clientWidth) elmnt.style.left = newLeft + 'px'
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}

export default {
  mounted () {
    dragElement(this.$el)
  }
}
