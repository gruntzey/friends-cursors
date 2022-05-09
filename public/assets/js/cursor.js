if (location.port !== '5000') {
  location.replace(`http://${location.hostname}:5000`)
}

const coords = {}
let ip

async function init() {
  let res = await fetch(`/api/ip`)
  ip = await res.json()
  document.addEventListener('mousemove', syncCursors)
}



const ws = new WebSocket(`ws://${location.hostname}:5001`)

ws.onmessage = res => {
  const resObj = JSON.parse(res.data)
  document.body.innerHTML = ""

  for (const key in resObj) {
    const ball = document.createElement('div')
    ball.classList.add('ball')
    ball.style.left = `${resObj[key].x}px`
    ball.style.top = `${resObj[key].y}px`
    document.body.append(ball)

    const label = document.createElement('div')
    label.classList.add('ip')
    label.textContent = key
    ball.append(label)
  }
}


window.addEventListener('unload', () => {
  ws.send(JSON.stringify({
    close: ip,
  }))
})


function syncCursors(e) {
  const {pageX, pageY} = e
  ws.send(JSON.stringify({
    id: ip,
    x: pageX,
    y: pageY,
  }))
}

init()