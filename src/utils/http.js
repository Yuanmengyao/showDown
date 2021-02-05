/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';



// 创建axios实例
let instance = axios.create({
  timeout: 1000 * 12
});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

/*环境的切换
if (process.env.NODE_ENV == 'development') {    
    axios.defaults.baseURL = 'https://www.baidu.com';} 
else if (process.env.NODE_ENV == 'debug') {    
    axios.defaults.baseURL = 'https://www.ceshi.com';
} 
else if (process.env.NODE_ENV == 'production') {    
    axios.defaults.baseURL = 'https://www.production.com';
}*/
/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
// instance.interceptors.request.use(    
//     config => {        
//         // 登录流程控制中，根据本地是否存在token判断用户的登录情况        
//         // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token        
//         // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码        
//         // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。        
//         const token = store.state.token;        
//         token && (config.headers.Authorization = token);        
//         return config;    
//     },    
//     error => Promise.error(error))

// 响应拦截器
// instance.interceptors.response.use(    
//     // 请求成功
//     res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),    
//     // 请求失败
//     error => {
//         return Promise.reject(error.res)

//         // const { response } = error;
//         // if (response) {
//         //     // 请求已发出，但是不在2xx的范围 
//         //     // errorHandle(response.status, response.data.message);
//         //     return Promise.reject(response);
//         // }
//     });

export default instance;
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 **/
export function post(url, params) {
  return new Promise((resolve, reject) => {

    instance.post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}