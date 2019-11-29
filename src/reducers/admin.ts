import {setTitle} from "../utils/helper";

const stateDefault = {
    user: {},
    allUser: [],
    menu: [],
    request: [],
    auth: [],
    userGroup: [],
    currentMenu: {},
    currentMenus: [],
}
export const reducer = (state = stateDefault, action) => {
    switch (action.type) {
        case "ADMIN_USER":
            return {...state, user: action.data}
        case "ADMIN_ALLUSER":
            return {...state, allUser: action.data}
        case "ADMIN_MENU":
            return {...state, menu: action.data}
        case "ADMIN_REQUEST":
            return {...state, request: action.data}
        case "ADMIN_AUTH":
            return {...state, auth: action.data}
        case "ADMIN_USERGROUP":
            return {...state, userGroup: action.data}
        case "ADMIN_CURRENT_MENU":
            let currentMenu = {}
            let currentMenus: object[] = []
            for (let i = 0; i < state.menu.length; i++) {
                const item = state.menu[i]
                if (item['url'] === action.data) {
                    currentMenu = item
                    setTitle(item['name'])
                }
            }

            const getParent = function (parentId) {
                for (let i = 0; i < state.menu.length; i++) {
                    if (state.menu[i]['id'] === parentId) {
                        return state.menu[i]
                    }
                }
                return {}
            }

            if (currentMenu['id']) {
                currentMenus.push(currentMenu)
                let parentId = currentMenu['parent_id']
                while (parentId) {
                    const parent = getParent(parentId)
                    parentId = parent['parent_id']
                    if (parent['id']) {
                        currentMenus.push(parent)
                    }
                }
            }
            return {...state, currentMenu: currentMenu, currentMenus: currentMenus.reverse()}
        case "ADMIN_ALL":
            return {...state, ...action.data}
    }
    return state
}

export const action = {
    user(data = {}) {
        return {type: "ADMIN_USER", data}
    },
    allUser(data) {
        return {type: "ADMIN_ALLUSER", data}
    },
    menu(data) {
        return {type: "ADMIN_MENU", data}
    },
    request(data) {
        return {type: "ADMIN_REQUEST", data}
    },
    auth(data) {
        return {type: "ADMIN_AUTH", data}
    },
    userGroup(data) {
        return {type: "ADMIN_USERGROUP", data}
    },
    currentMenu(data) {
        return {type: "ADMIN_CURRENT_MENU", data}
    },
    logout() {
        return {
            type: "ADMIN_ALL", data: {
                user: {},
                allUser: [],
                menu: [],
                request: [],
                auth: [],
                userGroup: [],
            }
        }
    },
    all(data) {
        return {type: "ADMIN_ALL", data}
    }
}
