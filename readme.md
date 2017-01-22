## 拍拍贷爬虫

主要获取每个投资单的url，以及投资单详情

## 使用

### use git

```bash
git clone https://github.com/GaryChangCN/paipaidai-spider.git
```

### download

download zip 本页面右上部

```bash
npm install
node getUrl.js  //获取url
node info.js //获取投资单详情（需要先获得url）
```

## 说明

`getUrl.js` 

使用balala函数开启，第一个参数是风险等级编号，第二个参数是数组，每一项是魔镜等级编号。编号对应如下。

|编号|对应|
|:--:|:--:|
|"8"| "低风险"|
|"4"| "中风险"|
|"5"| "高风险"|
|"1,"|AAA|
|"2,"|AA|
|"3,"|A|
|"4,"|B|
|"5,"|C|
|"6,"|D|
|"7,"|E|
|"8,"|F|

```javascript
balala("5", ["7,", "8,"], 40);

```

`info.js`  直接运行获取不同数据只需更改 filename 名字 这里filename 对应着获取到的链接json

```js
var fileName = "4.json";
```

## 附加

本仓库附带的有我爬好的，爬去时间是 2017-1-22 18:00

getUrl.js  使用 `Promise.all` 来做循环异步，
info.js 使用递归来请求和解析数据。
