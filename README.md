# idle-timer

A Vue plugin to track idle time

## Installation

```js
npm i @twoavy/idle-timer
OR
yarn add @twoavy/idle-timer
```
```js
import idleTimer from 'idle-timer';
```

## Usage

####Initialize (main.js)
```
app.use(idleTimer, {
    idleTime: 30, // secs
    trigger: ['mousedown', 'touchstart']
})
```


####In component (within setup)
```
const emitter = inject('idle-emitter')
emitter.on('idle', () => {
console.log('idle')
})
```
