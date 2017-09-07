/**
 * Created by Administrator on 2017/8/25.
 */
export const validate = (values,schema)=>{
    const error = {};
    schema.forEach(itm=>{
        if(itm.required){
            if(values[itm.key]===null||values[itm.key]===undefined){
                error[itm.key]="必填字段"
            }
        }
    });
    return error
}