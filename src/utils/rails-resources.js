/*
    * 这段令人疑惑的代码实现了一个简单的rails restful风格路由映射
        * example
        resources(model-name)
        =>
            class ModelName {
                static index(){
                    return request.get(`api/v1/${model-name}`);
                }
                ...
            }
*/
import request from './request';

const resources = model => {
    return class Model {
        static index(page) {
            return request.get(`/api/v1/${model}`, {
                page
            });
        }

        static show(id) {
            return request.get(`/api/v1/${model}/${id}`);
        }

        static create(params) {
            return request.post(`/api/v1/${model}`, {
                params
            });
        }

        static update(id, params) {
            return request.put(`/api/v1/${model}/${id}`, {
                params
            });
        }

        static delete(id) {
            return request.delete(`/api/v1/${model}/${id}`);
        }
    };
};

export default resources;