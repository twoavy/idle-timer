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
                start() {
                    this.stop()
                    this.paused = false
                    this.timer = setTimeout(() => {
                        this.$emit('idle')
                    }, this.time * 1000)
                    for (let i = 0; i < this.additionalTimers.length; i++) {
                        this.additionalTimers[i].timer = setTimeout(timer => {
                            this.$emit(timer.name)
                        }, this.additionalTimers[i].time * 1000, this.additionalTimers[i])
                    }
                },
                pause() {
                    this.paused = true
                    this.stop()
                },
                stop() {
                    clearTimeout(this.timer)
                    for (let i = 0; i < this.additionalTimers.length; i++) {
                        clearTimeout(this.additionalTimers[i].timer)
                        this.additionalTimers[i].timer = -1
                    }
                },
                restart() {
                    if (!this.paused) {
                        idleEventBus.$emit('reset')
                        this.start()
                    }
                },
                addTimer(name, time) {
                    this.additionalTimers.push({ name, time, timer: -1 })
                }
            }
        })
        Vue.prototype.$idle = idleEventBus
    }
}
