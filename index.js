export default {
    install(Vue, options = {}) {
        const idleEventBus = new Vue({
            data() {
                return {
                    time: options.idleTime || 30,
                    trigger: options.trigger || ['mousedown', 'touchstart'],
                    timer: -1
                }
            },
            created() {
                this.trigger.forEach(x => document.addEventListener(x, this.restart))
            },
            methods: {
                start() {
                    this.stop()
                    this.timer = setTimeout(() => {
                        this.$emit('idle')
                    }, this.time * 1000)
                },
                stop() {
                    clearTimeout(this.timer)
                },
                restart() {
                    idleEventBus.$emit('reset')
                    this.start()
                }
            }
        })
        Vue.prototype.$idle = idleEventBus
    }
}
