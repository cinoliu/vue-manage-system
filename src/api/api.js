import axios from 'axios';

let base ='api';
//let base = 'http://cpre.sweetmartmarketing.com/wechatMember';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };



export const getUserList = params => { return axios.post(`${base}/role/queryRolePage.do`, params).then(res => res.data); };