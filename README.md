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


```js
app.use(idleTimer, {
    idleTime: 30, // secs
    trigger: ['mousedown', 'touchstart']
})
```
