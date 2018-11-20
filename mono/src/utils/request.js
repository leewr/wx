import Axios from 'axios'
import { getCookie } from '../utils/common'
const instance = Axios.create({
    timeout: 1000,
    headers: {'x-csrf-token': getCookie('csrfToken')}
  });
export default {
    get (url, params) {
        console.log(params)
        return new Promise((resolve, reject) => {
            instance.get(url, { params: params })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
        });
    },
    post (url, params) {
        return new Promise((resolve, reject) => {
            instance.post(url, params)
            .then(res => {
                // 处理api接口权限
                if (res.status === 200) {
                    if (res.success) {
                        resolve(res.data)
                    }
                } else if (res.status === 403) {
                    // 页面跳转
                }
               
            })
            .catch(err => {
                reject(err);
            });
        });
    }
};