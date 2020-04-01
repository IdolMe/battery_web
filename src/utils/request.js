import axios from 'axios';
import rectAxios from 'react-axios';
import { request } from 'https';
import { reject } from 'q';
import { resolve } from 'url';
import {urlPrefix} from '../utils/constants';

const requestData = (url, method, data={}, headerOptions = null) => {
    const reqUrl = urlPrefix + url;
    return axios({
        method: method,
        url: reqUrl,
        data: data
    });
}

export default requestData;