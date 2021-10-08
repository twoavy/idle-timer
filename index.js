import mitt from 'mitt'

export default {
    install(app, options = {}) {
        const time = options.idleTime || 30
        const trigger = options.trigger || ['mousedown', 'touchstart']
        let timer = -1
        let paused = false
        const additionalTimers = []

        const emitter = mitt()
        app.provide('idle-emitter', emitter)

        const start = (name = null) => {
            stop(name)
            const timerLocal = getTimer(name)
            if (timerLocal) {
                timerLocal.paused = false
                timerLocal.timer = setTimeout(() => {
                    emitter.emit(timer.name)
                }, timer.time * 1000)
            } else {
                paused = false
                timer = setTimeout(() => {
                    emitter.emit('idle')
                }, time * 1000)
                for (let i = 0; i < additionalTimers.length; i++) {
                    additionalTimers[i].timer = setTimeout(
                        (timer) => {
                            emitter.emit(timer.name)
                        },
                        additionalTimers[i].time * 1000,
                        additionalTimers[i],
                    )
                }
            }
        }

        const pause = (name = null) => {
            stop(name)
            const timerLocal = getTimer(name)
            if (timerLocal) {
                additionalTimers[timerLocal.index].paused = true
            } else {
                paused = true
            }
        }

        const stop = (name = null) => {
            const timerLocal = getTimer(name)
            if (timerLocal) {
                clearTimeout(timerLocal.timer)
                timerLocal.timer = -1
            } else {
                clearTimeout(timer)
                for (let i = 0; i < additionalTimers.length; i++) {
                    clearTimeout(additionalTimers[i].timer)
                    additionalTimers[i].timer = -1
                }
            }
        }

        const restart = () => {
            console.log('restart')
            if (!paused) {
                emitter.emit('reset')
                start()
            }
            additionalTimers.forEach((timer) => {
                if (!timer.paused) {
                    start(timer.name)
                }
            })
        }

        const addTimer = (name, time) => {
            additionalTimers.push({ name, time, timer: -1, paused: false })
        }

        const getTimer = (name) => {
            if (name && name.length > 0) {
                return additionalTimers.find((x) => x.name === name)
            }
            return null
        }

        trigger.forEach((x) => document.addEventListener(x, restart))

        app.provide('idle-timer', options)
    },
}
