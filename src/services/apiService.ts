/**
 * Created by Administrator on 2017/8/21.
 */
import {Http} from "../config/http";
export const ApiService = {
    getBillingOrders:()=>{
        return Http.get(ENV.API_URL+"/special_line/getAllBills").then(res=>{
            return res.data
        })
    },
    addBillingOrder:(data)=>{
        return Http.post(ENV.API_URL+"/special_line/hand_pay",data).then(res=>{
            return res
        })
    }
}