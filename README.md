Cadmin的客户端实现 react+ant.design

> 项目地址: [[github](https://github.com/baiy/Cadmin-client-react)] [[gitee](https://gitee.com/baiy/Cadmin-client-react)]
>
> 在线文档地址: <https://baiy.github.io/Cadmin/>

### 依赖
* [react](https://reactjs.org/)
* localStorage
* [redux](https://redux.js.org/)
* [axios](https://github.com/axios/axios)
* [ant.design](https://ant.design/)
* [lodash](https://lodash.com/)

> 整体环境使用[create-react-app](https://create-react-app.dev/)搭建

### 安装

```shell
// 安装
npm install
// 开发
npm start
// 编译
npm run build
```

> 更多开发构建问题见 [create-react-app](https://create-react-app.dev/) 文档

### 配置
配置文件地址:`./env`

> 使用`create-react-app`的[环境变量](https://create-react-app.dev/docs/adding-custom-environment-variables)

| 配置变量名 | 说明| 
| --- | --- |
|REACT_APP_ADMIN_TOKEN_NAME|前端localStorage存储 `token` 名称|
|REACT_APP_API_URL_PREFIX|服务端数据请求入口地址|
|REACT_APP_API_ACTION_NAME|服务端数据请求地址中 `action` 变量名|
|REACT_APP_API_TOKEN_NAME|服务端数据请求地址中 `token` 变量名|
|REACT_APP_INDEX_URL|登录后首页(`/`)跳转地址|
|REACT_APP_SITE_NAME|站点名称 页面左上角|
|REACT_APP_SITE_TITLE_TPL|页面标题模板|

```js
import {config} from "src/utils/helper";
// 获取配置
let name = config('SITE_NAME')
```
> 获取配置时`REACT_APP__`无需填写

### 路由与菜单

##### 路由
系统中页面路由已经实现动态自动加载,加载规则如下:
1. 加载目录`/src/pages`
1. 加载文件`index.tsx`
1. 会自动过滤`components`文件夹中的文件

> 实现代码 `import {getPages} from "src/utils/helper";`

例如:

| 文件路径 | 路由地址| 
| --- | --- |
|/src/pages/system/user/index.tsx|/system/user|
|/src/pages/system/user/index2.tsx|不自动加载|
|/src/pages/a/b/c/d/index.tsx|/a/b/c/d|
|/src/pages/a/components/c/index.tsx|不自动加载|
|/src/pages/components/a/index.tsx|不自动加载|

##### 菜单
菜单分为两种类型:
1. 目录型: 点击该菜单会展示下级菜单,没有真实页面与之对应
1. 页面型: 这种菜单有前端页面对应,点击进入对应的前端页面
1. 链接型: http/https链接

页面型菜单: 后台配置菜单链接时对应这里 `路由地址`

### redux
> `/reducers/`

| - | 路由地址| 
| --- | --- |
|user|当前用户信息|
|allUser|后台所有用户列表|
|menu|用户已授权菜单列表|
|request|用户已授权请求列表|
|auth|用户关联权限|
|userGroup|用户已授权请求列表|
|currentMenu|当前页面菜单信息|
|currentMenus|当前菜单信息(包含父级菜单)|

### 服务端请求

#### 常用方法
```js
import request from "src/utils/request";
// get 请求
request('/system/request/remove').
    data({id:1}).
    showSuccessTip().
    success(r=>{
         console.log(r)
    }).get();       
// post 请求
request('/system/request/remove').
    data({id:1}).
    showSuccessTip().
    success(r=>{
         console.log(r)
    }).get();
```
`request()` 方法参数为服务端请求`action`

`request()` 方法返回值为 `src/utils/request` 中 `request` 对象

发送请求时无需关心`token`,程序会自动附加

##### request对象
| 方法 | 说明| 默认值|
| --- | --- |---|
|dataType(string)|响应格式|json|
|contentType(string)|请求头`Content-Type`|application/x-www-form-urlencoded|
|data(object)|请求数据对象|{}|
|showSuccessTip()|显示业务执行成功页面提示 不调用默认`不提示`||
|hideErrorTip()|隐藏业务执行异常页面提示 不调用默认`提示`||
|success(function)|业务执行成功回调函数|null|
|error(function)|业务执行异常回调函数|null|
|complete(function)|请求完成回调函数|null|
|get()|发起GET请求||
|post()|发起POST请求||

> 只有调用`get()`/`post()`方法才会发起请求

#### 其他

当然你也可以自己导入`axios` 按照`axios`方式发起请求,通过下面的方法生成对应的服务端url以及附加token
```js
import {actionUrl} from 'src/utils/helper'
let url = actionUrl('action')
```

### 内置组件

开发过程除了可以使用[ant.design](https://ant.design/)的组件外, 系统还内置一些与后台开发常用的组件

#### 显示后台指定用户名称

```
import Username from 'src/components/username'
<Username id="1" default="未知用户" />
```
> `id`:用户ID 
> `default`:用户不存在显示文字 可选

#### 权限检查
```
import AuthCheck from 'src/components/authCheck'
<AuthCheck action="/system/auth/assignMenu" without="无权限时展示">
    有权限是展示
</AuthCheck>
```
> `without` 可选
>
> 常用于根据当前用户指定请求的权限判断结果展示不同的内容

#### 字段映射
```
import FieldMap from 'src/components/fieldMap'
let map = [{v: 1, n: '启用'},{v: 2, n: '禁用'}]
<FieldMap value="2" map="{map}" valueField="v" descField="n" />
```
> 以上代码输出:`禁用`
>
> 该组件常用于映射字段的页面输出  `valueField`/`descField` 可选
