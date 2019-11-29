import localStorage from 'localStorage'
import _ from "lodash";
import React from "react";
import Index from "src/pages/index";

export const trim = function (str, char, type) {
    if (char) {
        if (type === 'left') {
            return str.replace(new RegExp('^\\' + char + '+', 'g'), '')
        } else if (type === 'right') {
            return str.replace(new RegExp('\\' + char + '+$', 'g'), '')
        }
        return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '')
    }
    return str.replace(/^\s+|\s+$/g, '')
}

// 配置获取
export const config = function (key: string): string {
    // @ts-ignore
    return process.env['REACT_APP_' + key]
}

export const serverUrl = function (data = {}) {
    let query: string[] = []
    Object.keys(data).forEach((item: string) => {
        query.push(item + '=' + encodeURIComponent(data[item]))
    })
    return config('API_URL_PREFIX') + (query.length > 0 ? ('?' + query.join('&')) : '')
}

export const getToken = () => {
    return localStorage.getItem(config('ADMIN_TOKEN_NAME'))
}
export const setToken = (token: string) => {
    if (token) {
        localStorage.setItem(config('ADMIN_TOKEN_NAME'), token)
    }
}

export const clearToken = () => {
    localStorage.removeItem(config('ADMIN_TOKEN_NAME'))
}

export const actionUrl = function (action) {
    let data = {}
    data[config('API_ACTION_NAME')] = action
    if (getToken()) {
        data[config('API_TOKEN_NAME')] = getToken()
    }
    return serverUrl(data)
}

export const getPages = () => {
    let route: { path: string, component: React.ComponentType }[] = [
        {path: "/", component: Index}
    ]
    const routeComponent = require.context(
        'src/pages',
        true,
        /index\.(tsx)$/
    )
    routeComponent.keys().forEach((fileName, index) => {
        // 过滤组件
        if (fileName.indexOf('components/') !== -1 || fileName === "./index.tsx") {
            return;
        }
        const path: string = "/" + trim(fileName.replace(/^\.\/(.*)\/index\.\w+$/, '$1'), '/', 'left');
        const component: React.ComponentType<any> = routeComponent(fileName).default
        route.push({path, component})
    });
    return route
}

export const setTitle = (title: string) => {
    document.title = config('SITE_TITLE_TPL').replace(/{title}/g, title);
};

// 菜单排序
export const menuSort = function (menus) {
    let m = _.cloneDeep(menus)
    m.sort((item1, item2) => {
        if (item1.sort < item2.sort) {
            return -1
        }
        if (item1.sort === item2.sort) {
            return item1.id < item2.id ? -1 : 1
        }
        return 1
    })
    return m;
}