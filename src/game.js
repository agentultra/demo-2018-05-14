const canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, stageW = 800
, stageH = 480
, PI = Math.PI
, state = {}
, buttons = {
    Left: 0,
    Up: 0,
    Right: 0,
    Down: 0
}

canvas.width = stageW
canvas.height = stageH

const deg2rad = d => d * (PI / 180)

const midPoint = (p1, p2) => ({
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
})

const range = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const btn = name => buttons.hasOwnProperty(name) && buttons[name]

const clr = () => {
    stage.fillStyle = 'black'
    stage.fillRect(0, 0, stageW, stageH)
}

const init = () => Object.assign(state, {
    tick: 0,
    apple: {x: range(10, stageW - 10),
            y: range(10, stageH - 10)},
    player: {
        x: Math.floor(stageW / 2),
        y: Math.floor(stageH / 2),
        w: 24, h: 24,
        angle: 0,
        rotSpeed: 4,
        tailLength: 30,
        tail: []
    }
})

const TailPoint = (x, y, duration = 100) => ({
    x, y, duration, dead: false
})

const update = dt => {
    const {player} = state

    if (btn('Left')) {
        player.angle = player.angle - player.rotSpeed <= 0
            ? 360 - (player.angle - player.rotSpeed)
            : player.angle - player.rotSpeed
    } else if (btn('Right')) {
        player.angle = player.angle + player.rotSpeed >= 360
            ? 0 + ((player.angle + player.rotSpeed) - 360)
            : player.angle + player.rotSpeed
    }

    const {x: oldX, y: oldY} = player
    , newX = player.x + (Math.cos(deg2rad(player.angle)) * 5)
    , newY = player.y + (Math.sin(deg2rad(player.angle)) * 5)
    player.x = newX
    player.y = newY
    player.tail.push(TailPoint(oldX, oldY, player.tailLength))

    if (player.x > stageW + Math.floor(player.w / 2)) {
        player.x = 0 - Math.floor(player.w / 2)
    }
    if (player.x < 0 - Math.floor(player.w / 2)) {
        player.x = stageW + Math.floor(player.w / 2)
    }
    if (player.y > stageH + Math.floor(player.h / 2)) {
        player.y = 0 - Math.floor(player.h / 2)
    }
    if (player.y < 0 - Math.floor(player.h / 2)) {
        player.y = stageH + Math.floor(player.h / 2)
    }

    for (let tp of player.tail) {
        tp.duration--;
        if (tp.duration === 0) {
            tp.dead = true
        }
    }

    player.tail = player.tail.filter(tp => tp.dead === false)

    state.tick++
}

const drawPlayer = () => {
    const {player} = state

    stage.save()
    stage.translate(player.x, player.y)
    stage.rotate(deg2rad(player.angle))
    stage.fillStyle = 'yellow'
    stage.fillRect(-Math.floor(player.w / 2),
                   -Math.floor(player.h / 2),
                   player.w,
                   player.h)
    stage.strokeStyle = 'red'
    stage.beginPath()
    stage.moveTo(0, 0)
    stage.lineTo(20, 0)
    stage.stroke()
    stage.restore()
}

const drawTail = () => {
    const {player} = state
    , {tail: points} = player

    stage.save()
    if (points.length >= 2) {
        let p1 = points[0]
        , p2 = points[1]a

        stage.strokeStyle = 'purple'
        stage.lineWidth = 4
        stage.lineJoin = stage.lineCap = 'round'
        stage.beginPath()
        stage.moveTo(p1.x, p1.y)

        for (let i = 1; i < points.length; i++) {
            const mid = midPoint(p1, p2)
            stage.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y)
            p1 = points[i]
            p2 = points[i+1]
        }

        stage.lineTo(p1.x, p1.y)
        stage.stroke()
    }
    stage.restore()
}

const drawApple = () => {
    const {apple} = state

    stage.fillStyle = 'red'
    stage.fillRect(apple.x, apple.y, 10, 10)
}

const render = () => {
    clr()
    drawPlayer()
    drawTail()
    drawApple()
}

const loop = dt => {
    update(dt)
    render()
    window.requestAnimationFrame(loop)
}

init()
window.requestAnimationFrame(loop)

document.addEventListener('keydown', ev => {
    if (ev.key === 'w') {
        buttons.Up = 1
    } else if (ev.key === 'a') {
        buttons.Left = 1
    }  else if (ev.key === 's') {
        buttons.Down = 1
    }  else if (ev.key === 'd') {
        buttons.Right = 1
    }
})

document.addEventListener('keyup', ev => {
    if (ev.key === 'w') {
        buttons.Up = 0
    } else if (ev.key === 'a') {
        buttons.Left = 0
    }  else if (ev.key === 's') {
        buttons.Down = 0
    }  else if (ev.key === 'd') {
        buttons.Right = 0
    }
})
