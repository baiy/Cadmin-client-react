import axios, {AxiosRequestConfig} from 'axios'
import qs from 'qs'
import nprogress from 'nprogress'
import {notification} from 'antd';
import {actionUrl} from './helper'
import _ from 'lodash'

export interface Response {
    status: string,
    info: string,
    data: any
}

interface ResponseHandleFunc {
    (response: Response): void
}

export const http = function ({type, data, dataType, contentType, url, success, error, complete}) {
    type = (type || 'get').toUpperCase()
    let config: AxiosRequestConfig = {
        method: type || 'get',
        url: url,
        headers: {'content-type': contentType || "application/x-www-form-urlencoded"},
        responseType: dataType || 'json'
    }
    if (_.indexOf(['POST', 'PUT', 'PATCH'], type) === -1) {
        config.params = data
    } else {
        config.data = qs.stringify(data)
    }
    return axios(config).then((response) => {
        complete && complete()
        success && success(response.data)
    }).catch((e) => {
        complete && complete()
        error && error(e)
    })
}

const requestSuccessHandle = function (response: Response, tipSuccess: boolean, tipError: boolean, success: ResponseHandleFunc | undefined, error: ResponseHandleFunc | undefined) {
    if (response.status === 'success') {
        if (tipSuccess) {
            notification.success({
                message: '操作提示',
                description: response.info,
            });
        }
        success && success(response)
    } else {
        if (tipError) {
            notification.error({
                message: '错误提示',
                description: response.info,
                duration: 10
            });
        }
        error && error(response)
    }
}

class request {
    private _type: string = 'get'
    private readonly _action: string = ''
    private _data: object = {}
    private _tipSuccess: boolean = false
    private _tipError: boolean = true
    private _dataType: string = 'json'
    private _contentType: string = 'application/x-www-form-urlencoded'
    private _success: ResponseHandleFunc | undefined = undefined
    private _error: ResponseHandleFunc | undefined = undefined
    private _complete = () => {
    }

    constructor(action: string) {
        this._action = action
    }

    dataType(dataType: string) {
        this._dataType = dataType
        return this
    }

    contentType(contentType: string) {
        this._contentType = contentType
        return this
    }

    data(data: object) {
        this._data = {...this._data, ...data}
        return this
    }

    showSuccessTip() {
        this._tipSuccess = true
        return this
    }

    hideErrorTip() {
        this._tipError = false
        return this
    }

    success(success: ResponseHandleFunc) {
        this._success = success
        return this
    }

    error(error: ResponseHandleFunc) {
        this._error = error
        return this
    }

    complete(complete) {
        this._complete = complete
        return this
    }

    get() {
        return this.execute('get')
    }

    post() {
        return this.execute('post')
    }

    execute(type: string) {
        this._type = type
        nprogress.start()
        return http({
            type: this._type,
            dataType: this._dataType,
            contentType: this._contentType,
            data: this._data,
            url: actionUrl(this._action),
            success: (response) => {
                requestSuccessHandle(
                    response,
                    this._tipSuccess,
                    this._tipError,
                    this._success,
                    this._error
                )
            },
            error: () => {
                notification.error({message: '对不起您请求的数据不存在或者返回异常', duration: 5})
            },
            complete: () => {
                nprogress.done()
                this['_complete'] && this['_complete']()
            }
        })
    }
}

export default (action) => new request(action)