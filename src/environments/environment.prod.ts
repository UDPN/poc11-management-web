/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:32:33
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 10:15:11
 * @Description:
 */
export const http = window.location.protocol;
export const ip = window.location.hostname;

// export const port = "8082";
// export const localUrl = `http://${ip}:${port}`;
// // export const localUrl = ``;
// if (window.location.port === '8082') {

// }
export const environment = {
  production: true,
  localUrl: '',
  clientName: '',
  password: ''
};
