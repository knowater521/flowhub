<h1 align="center"> Flow Hub </h1>

<p align="center">
  <a href="https://www.npmjs.org/package/flowhub">
    <img alt="NPM" src="http://img.shields.io/npm/v/flowhub" />
  </a>
  <a href="">
    <img alt="Size" src="https://img.shields.io/badge/size-6kb-green.svg" />
  </a>
</p>

## 为什么使用

满足绝大部分情况事件驱动的情况，适合用于处理各种事件流，简单、轻量 (gzip 2kb) 的 JS 库。

对于各种组件系统的框架，如：React、Vue.js 等等，非父子组件之间的通讯是一件麻烦的事情，但通过使用 flowhub 会变得轻松简单。

## 安装

```sh
npm i hub-js --save
```

或者

```html
<script src="https://cdn.jsdelivr.net/npm/hub-js/dist/hub.min.js"></script>
```

## 简单使用

```js
import $hub from 'hub-js';

// 注册监听者
$hub.on('test', data => console.log('test', data))

setInterval(() => {
  // 发送 'test' 事件
  $hub.emit('test', { code: 1 })
}, 1000)
```

## 更多

### 移除监听

```js
const listener = $hub.on('test', data => console.log(data))

$hub.emit('test', { code: 1 })

listener.off()
// 或者
// $hub.off('test', listener)

$hub.emit('test', { code: 2 })
```

### 单次

```js
const listener = $hub.once('test', data => console.log(data))

$hub.emit('test', { code: 1 })

$hub.emit('test', { code: 2 })
```

### 复数

```js
const listener = $hub.on(['test', 'test-1', 'test-2'], data => console.log(data))

$hub.emit(['test', 'test-1', 'test-2'], { code: 1 })

listener.off()
// 或者
// $hub.off(['test', 'test-1' ], listener)

$hub.emit(['test', 'test-1', 'test-2'], { code: 2 })
```

注意，监听者会接收到每次适配到的事件源发生。例如上述例子，则会产生三条日志。


### Proxy Store

```js
// 设置 store 值
$hub.store.code = 1

// 监听 store 里具体 某个数值
// 若 这个数值已存在 “当前值”，则监听成功后，立即返回 “当前值”，就像 Rx.BehaviorSubject
$hub.on('@store/code', data => console.log('store code', data))

setInterval(() => {
    ++$hub.store.code
    // 或者
    // $hub.emit('@store/code', 1)
}, 1000)
```

### DOM 元素

```js
const dispatcher = $hub.DOM('button')
                        .from('click')
                        .emit('dom-click-event')
                        .from('mousedown')
                        .emit('dom-mousedown-event')

$hub.on('dom-click-event', event => console.log('button click', event))

$hub.on('dom-mousedown-event', event => console.log('button mousedown', event))

setTimeout(dispatcher.off, 10000)
```

### Fetch

```js
const dispatcher = $hub.Fetch('https://xxxxx')
                        .emit('fetch-event1')
                        .emit('fetch-event2')

setTimeout(dispatcher.reload, 2000)

$hub.on('fetch-event1', result => console.log('fetch1', result))

$hub.on('fetch-event2', result => console.log('fetch2', result))
```

### WebSocket

```js
const dispatcher = $hub.WS('ws://xxxxx')
                        .emit('ws-event1')
                        .emit('ws-event2')

$hub.on('ws-event1', result => console.log('ws1: ', result))
$hub.on('ws-event2', result => console.log('ws2: ', result))

setTimeout(dispatcher.off, 3000)
```

### socket.io

```html
<script src="./lib/socket.io.min.js"></script>

<script>
const dispatcher = $hub.IO('http://xxxxx')
                        .from('mock')
                        .emit('io-event')

dispatcher.socket.emit('mock', { key: 'xxxxx' })

$hub.on('io-event', result => console.log('io:', result))

setTimeout(dispatcher.off, 3000)
</script>
```

### 通道链式

```js
$hub.chain('test')
        .pipe(
          d => new Promise(resolve => setTimeout(() => resolve(d + 1), 2000)),
          d => d + 2,
          d => d + 3
        )
        .pipe(d => d + 3)

$hub.on('@chain/test', d => console.log(d))

$hub.emit('@chain/test', 1) // 10
```

### 链式 & 转换器

```js
// 注册转换器
$hub.converter.DOMEventFormat1 = function (event) {
  return [event.type, event.target]
}
$hub.converter.DOMEventFormat2 = function (event) {
  return [e.target, e.type]
}

// 可以通过自由组合 链式 衔接的顺序，进行对流的控制，从而达到你想要的效果
const dispatcher = $hub.DOM('button')
                        .from('click')
                        .convert('DOMEventFormat1')
                        .emit('dom-click-event')
                        .from('mousedown')
                        .convert('DOMEventFormat1')
                        .emit('dom-mousedown-event')
// 或者
// $hub.DOM('button').from('click').convert('DOMEventFormat1' ).emit('dom-click-event1').emit('dom-click-event2' )
// $hub.DOM('button').from('click').convert('DOMEventFormat1' ).convert('DOMEventFormat2').emit('dom-click-event1' )

// 其他
// $hub.Fetch('https://xxx' ).emit('e1').convert('converter' ).emit('e2')
// $hub.WS('ws://xxx' ).emit('e1').convert('converter' ).emit('e2')
// $hub.IO('https://xxx').from('x1' ).convert('converter').emit('e1' ).from('x2').emit('e1' )

$hub.on('dom-click-event', event => console.log('button click', event))

$hub.on('dom-mousedown-event', event => console.log('button mousedown', event))

setTimeout(dispatcher.off, 10000)
```

## 许可

[MIT](./LICENSE)
