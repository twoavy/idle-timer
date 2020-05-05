export default {
    install(Vue, options = {}) {
        const idleEventBus = new Vue({
            data() {
                return {
                    time: options.idleTime || 30,
                    trigger: options.trigger || ['mousedown', 'touchstart'],
                    timer: -1,
                    paused: false,
                    additionalTimers: []
                }
            },
            created() {
                this.trigger.forEach(x => document.addEventListener(x, this.restart))
            },
            methods: {
                start(name = null) {
                    this.stop(name)
                    const timer = this.getTimer(name)
                    if (timer) {
                        timer.paused = false
                        timer.timer = setTimeout(() => {
                            this.$emit(timer.name)
                        }, timer.time * 1000)
                    } else {
                        this.paused = false
                        this.timer = setTimeout(() => {
                            this.$emit('idle')
                        }, this.time * 1000)
                        for (let i = 0; i < this.additionalTimers.length; i++) {
                            this.additionalTimers[i].timer = setTimeout(timer => {
                                this.$emit(timer.name)
                            }, this.additionalTimers[i].time * 1000, this.additionalTimers[i])
                        }
                    }
                },
                pause(name = null) {
                    this.stop(name)
                    const timer = this.getTimer(name)
                    if (timer) {
                        this.additionalTimers[timer.index].paused = true
                    } else {
                        this.paused = true
                    }
                },
                stop(name = null) {
                    const timer = this.getTimer(name)
                    if (timer) {
                        clearTimeout(timer.timer)
                        timer.timer = -1
                    } else {
                        clearTimeout(this.timer)
                        for (let i = 0; i < this.additionalTimers.length; i++) {
                            clearTimeout(this.additionalTimers[i].timer)
                            this.additionalTimers[i].timer = -1
                        }
                    }
                },
                restart() {
                    if (!this.paused) {
                        idleEventBus.$emit('reset')
                        this.start()
                    }
                    this.additionalTimers.forEach(timer => {
                        if (!timer.paused) {
                            this.start(timer.name)
                        }
                    })
                },
                addTimer(name, time) {
                    this.additionalTimers.push({ name, time, timer: -1, paused: false })
                },
                getTimer(name) {
                    if (name && name.length > 0) {
                        return this.additionalTimers.find(x => x.name === name)
                    }
                    return null
                }
            }
        })
        Vue.prototype.$idle = idleEventBus
    }
}
