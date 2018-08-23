# Cache

Cache 库为各种前端缓存提供丰富而统一的 API。默认缓存使用的是 js 全局变量作为缓存驱动。启发于 laravel 中的 Cache 门面。

#### 安装和使用

```bash
npm install web-cache-facade
```

```js
import Cache from 'web-cache-facade'

const Cache = require('web-cache-facade')

window.CacheFacade
```

#### 访问多个缓存存储

目前支持 `externStorage`、`localStorage`、`sessionStorage`。

```js
Cache.store('externStorage').put('bar', 'baz', 1000);

Cache.store('localStorage').get('foo');

Cache.store('sessionStorage').add('ping');

```

#### 在缓存中存储数据
你可以使用 Cache 的 put 方法来将数据存储到缓存中。当你在缓存中存放数据时，你需要使用第三个参数来设定缓存的过期时间(单位是 ms)：

```js
Cache.store('sessionStorage').put('key', 'value', millisecond);
```

#### 只存储没有的数据

add 方法将不存在于缓存中的数据放入缓存中，如果存放成功返回 true ，否则返回 false ：

```js
Cache.store('sessionStorage').add('key', 'value', millisecond);
```

#### 从缓存中获取数据

get 方法是用来从缓存中获取数据的方法。如果该数据不存在于缓存中，则该方法返回 null。你也可以向 get 方法传递第二个参数，用来指定如果查找的数据不存在时，你希望返回的默认值：

```js
Cache.store('localStorage').get('key');

Cache.store('localStorage').get('key', 'default');
```

#### 确认 key 是否存在

has 方法可用于确定缓存中是否存在 key。如果值为 null，则此方法将返回 false：

```js
if (Cache.store('localStorage').has('key')) {
    //
}
```

#### 递增与递减值

increment 和 decrement 方法可以用来调整缓存中整数项的值。这两个方法都可以传入第二个可选参数，用来指示要递增或递减值的数量：

```js
Cache.store('localStorage').increment('key');
Cache.store('localStorage').increment('key', amount);
Cache.store('localStorage').decrement('key');
Cache.store('localStorage').decrement('key', amount);
```

#### 获取和删除

如果你需要从缓存中获取到数据之后再删除它，你可以使用 pull 方法。和 get 方法一样，如果缓存中不存在该数据， 则返回 null :

```js
let value = Cache.store('localStorage').pull('key');
```

#### 数据永久存储

forever 方法可以用来将数据永久存入缓存中。因为这些缓存数据不会过期，所以必须通过 forget 方法从缓存中手动删除它们：

**当然，这个要根据缓存驱动而言，如果是全局便变量，那么是用户刷新之前有效，如果是sessionStorage，那么是会话期间有效，只有 localStorage才可能是永久不会过期**

```js
Cache.store('localStorage').forever('key', 'value');
```

#### 删除缓存中的数据

你可以使用 forget 方法从缓存中删除数据：

```js
Cache.store('localStorage').forget('key');
```

你也可以使用 flush 方法清空所有缓存：

```js
Cache.store('localStorage').flush();
```
