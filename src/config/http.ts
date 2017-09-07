/**
 * Created by Administrator on 2017/8/21.
 */
import {HttpService} from "guguder";
/**
 * Created by buhi on 2017/3/21.
 */

export const Http = new HttpService();

Http.config = {
    credentials:"include",
    headers:{
        "Content-Type":"application/json"
    },
};

Http.addResponseMiddleware(({res,url,params,config})=>{
    if(res.status<600 && res.status>=400){
        if(res.status === 404) {
            alert("请求地址不存在")
        }
        else if(res.status === 403) {
            alert("权限不足");
        }
        else if(res.status === 401) {
            this.tryLogout();
        }
        else if(res.status === 400) {
            const clone = res.clone();
            clone.json().then(({meta,data})=>{
                meta.message && alert(meta.message);
                return data;
            });
        }
        else if(res.status>490 && res.status<500){
            const clone = res.clone();
            throw clone.json();
        }
        else if(res.status === 500) {
            const clone = res.clone();
            clone.json().then(({meta,data})=>{
                if(meta.message)
                    alert(meta.message);
                return data;
            })
        }else{
            const clone = res.clone();
            clone.json().then(({meta,data})=>{
                if(meta.message)
                    alert(meta.message);
                return data;
            })
        }
    }
    return res
});
