const
  canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, buttons = {
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0
}
, wdth = 680
, hght = 640
, rooms = {
    0: {}
}

let
then = Date.now()
  px = 100
, py = 100
, acceleration = 0.895
, velocity = {x: 0, y: 0}
, drag = 3
, speed = 8
, currentRoom = 0

canvas.width = wdth
canvas.height = hght

// Loaders

const loadLevel = name =>
      fetch(`/levels/${name}.json`, {
          headers: {
                'Content-Type': 'application/json'
          }
      }).then(result => result.json())

// Keyboard Mapping

document.addEventListener('keydown', ev => {
    if (ev.key === 'a') {
        if (!buttons.Left) buttons.Left = 1
    } else if (ev.key === 'd') {
        if (!buttons.Right) buttons.Right = 1
    } else if (ev.key === 's') {
        if (!buttons.Down) buttons.Down = 1
    } else if (ev.key === 'w') {
        if (!buttons.Up) buttons.Up = 1
    }
})

document.addEventListener('keyup', ev => {
    if (ev.key === 'a') {
        if (buttons.Left) buttons.Left = 0
    } else if (ev.key === 'd') {
        if (buttons.Right) buttons.Right = 0
    } else if (ev.key === 's') {
        if (buttons.Down) buttons.Down = 0
    } else if (ev.key === 'w') {
        if (buttons.Up) buttons.Up = 0
    }
})

const btn = name => name in buttons && buttons[name]

// Helpers

const clamp = (min, max, v) =>
      v <= min ? min : v >= max ? max : v

const clear = () => {
    const waterBg = stage.createLinearGradient(0, 0, 0, hght)
    waterBg.addColorStop(0, '#006994')
    waterBg.addColorStop(0.5, 'blue')
    waterBg.addColorStop(1, '#003348')
    stage.fillStyle = waterBg
    stage.fillRect(0, 0, wdth, hght)
}

// Main Program

const updatePlayer = () => {
    if (btn('Up')) velocity.y = -1 * acceleration
    if (btn('Down')) velocity.y = 1 * acceleration
    if (btn('Right')) velocity.x = 1 * acceleration
    if (btn('Left')) velocity.x = -1 * acceleration

    const
      absXVelocity = Math.abs(velocity.x) / speed
    , absYVelocity = Math.abs(velocity.y) / speed
    , xSpeed = Math.sign(velocity.x)
    , ySpeed = Math.sign(velocity.y)

    velocity.x -= drag * velocity.x * absXVelocity
    velocity.y -= drag * velocity.y * absYVelocity
    if (xSpeed != Math.sign(velocity.x)) velocity.x = 0
    if (ySpeed != Math.sign(velocity.y)) velocity.y = 0
    px = px + (speed * velocity.x)
    py = py + (speed * velocity.y)
}

const update = dt => {
    updatePlayer()
}

const render = () => {
    clear()
    for (let j = 0; j < currentRoom.walls.length; j++) {
        for (let i = 0; i < currentRoom.walls[j].length; i++) {
            stage.fillStyle = '#666'
            stage.fillRect(i * 20, j * 20, 20, 20)
        }
    }
    stage.fillStyle = 'yellow'
    stage.fillRect(px, py, 20, 20)
}

Promise.all([
    loadLevel('1-1')
]).then(([levelData]) => {
    currentRoom = levelData
    const loop = () => {
        const now = Date.now()
        , dt = now - then
        update(dt / 1000)
        render()
        then = now
        window.requestAnimationFrame(loop)
    }
    window.requestAnimationFrame(loop)
}).catch(err => console.log(err))
