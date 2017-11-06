const
  canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, buttons = {
    Left: 0,
    Right: 0,
    Up: 0,
    Down: 0
}
, wdth = window.innerWidth
, hght = window.innerHeight

let
then = Date.now()
  px = 100
, py = 100
, acceleration = 0.895
, velocity = {x: 0, y: 0}
, drag = 3
, speed = 8

canvas.width = wdth
canvas.height = hght

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
    stage.fillStyle = 'yellow'
    stage.fillRect(px, py, 20, 20)
}

const loop = () => {
    const now = Date.now()
    , dt = now - then
    update(dt / 1000)
    render()
    then = now
    window.requestAnimationFrame(loop)
}
window.requestAnimationFrame(loop)
