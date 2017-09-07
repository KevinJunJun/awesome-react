/**
 * Created by Administrator on 2017/8/30.
 */
export const typeOptions=[{
    name:"月付",
    value:"month_pay"
},{
    name:"一次性费用",
    value:"one_time_pay"
},{
    name:"年付",
    value:"one_time_year_pay"
},{
    name:"补单",
    value:"supply_pay"
}]


export const buOptions = [{
    name:"互联网事业部",
    value:"IBU"
},{
    name:"企业事业部",
    value:"TEU",
},{
    name:"互动娱乐事业部",
    value:"IEU",
},{
    name:"多媒体事业部",
    value:"MMU"
},{
    name:"中小客户线",
    value:"SML"
},{
    name:"创新产品线",
    value:"IPL"
},{
    name:"平台产品线",
    value:"PPL"
}]

export const productIdOptions =[{
    name:"专线接入月租",
    value:1230006
},{
    name:"专线接入一次性费用",
    value:1230007
}]


export const billingSchema = [{
    key:"type",
    label:"类型",
    type:"select",
    options:typeOptions,
    required:true,

},{
    key:"product_id",
    label:"产品",
    type:"select",
    options:()=>Promise.resolve(productIdOptions),
    required:true
},{
    key:"company",
    label:"公司",
    type:"text",
    required:true,
},{
    key:"top_organization_id",
    label:"公司/账户ID",
    type:"number",
    required:true
},{
    key:"organization_id",
    label:"项目ID",
    type:"number",
    required:true
},{
    key:"region_id",
    label:"数据中心ID",
    type:"number"
},{
    key:"start_date",
    label:"开始日期",
    type:"date",
    required:true
},{
    key:"month_num",
    label:"月数",
    type:"number",
    listens:{
        type:v=>((v&&v!=="one_time_year_pay")?{hide:false}:{hide:true})
    }
},{
    key:"year_num",
    label:"年数",
    type:"number",
    listens:{
        type:v=>(v==="one_time_year_pay"?{hide:false}:{hide:true})
    }
},{
    key:"inner_price",
    label:"内部价格",
    type:"number",
    required:true,
    placeholder:"保留小数点后面两位",
    parse:v=>{
        return v?Number(v.toFixed(2)):0
    }
},{
    key:"discount",
    label:"折扣(%)",
    type:"number",
    required:true,
    placeholder:"保留小数点后面两位",
    parse:v=>{
        return v?Number(v.toFixed(2)):0
    }
},{
    key:"real_price",
    label:"实际售价",
    type:"number",
    required:true,
    placeholder:"输入整数",
    parse:(v)=>{
        return v?Math.floor(v):0
    },


},{
    key:"bu",
    label:"结算部门",
    type:"select",
    options:buOptions,
    required:true
},{
    key:"remark",
    label:"备注",
    type:"textarea",

}] as any

export const basicBillingSchema = [{
    key:"order_no",
    type:"text",
    label:"订单号"
}].concat(billingSchema)

//table global search key

export const globalSearchKey = "$$GLOBALSEARCH"