# idle-timer

A Vue plugin to track idle time

## Installation

```js
npm i @twoavy/idle-timer
OR
yarn add @twoavy/idle-timer
```
```js
import IdleTimer from 'idle-timer';
```

## Usage


```js
Vue.use(IdleTimer, {
    idleTime: 30, // secs
    trigger: ['mousedown', 'touchstart']
})
```

inside component:

```js
this.$idle.$on('idle', () => {
    console.log('idle!')
})

this.$idle.$on('reset', () => {
    console.log('resetting idle timer')
})
```

manually trigger functions:

```js
this.$idle.start() 
this.$idle.stop() 
this.$idle.restart()
```
