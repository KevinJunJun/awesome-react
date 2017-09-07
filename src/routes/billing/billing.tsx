/**
 * Created by Administrator on 2017/8/21.
 */
import * as React from "react"
import {SchemaTable} from "../../components/schema-table";
import {getBillingOrders, setBillingOrders, addBillingOrder, setBillingVisible} from "../../actions";
import {handler} from "guguder";
import {ReduxComponent, RootState} from "../../bootstrap";
import {takeLatest,put,take} from "redux-saga/effects";
import {ApiService} from "../../services/apiService";
import { Modal,Button } from 'antd';
import {ReduxSchemaForm} from "redux-schema-form"
import "redux-schema-form/"
import {createSelector} from "reselect"
import {Theme} from "../../config/theme";
import {validate} from "../../services/validate";
import {
    typeOptions, productIdOptions, buOptions, billingSchema,
    basicBillingSchema
} from "../../services/constantService";




export function* BillingOrdersSaga() {
    yield takeLatest<any>("getBillingOrders",function *() {
        try{
            const data = yield ApiService.getBillingOrders();
            yield put(setBillingOrders(data))
        }catch (e){
            handler.handle(e)
        }
    });
    yield takeLatest<any>("addBillingOrder",function *({payload}) {
        try{
            yield ApiService.addBillingOrder(payload);
            yield put(getBillingOrders())
            yield put(setBillingVisible(false))
        }catch (e){
            handler.handle(e);
        }
    });
}

export const todos = new Array(10).fill(0).map((itm,i)=>({
    count:i
}))

@ReduxComponent({
    selector:s=>({
        data:s.billing.get("data"),
        form:s.form,
        visible:s.billing.get("visible")
    }),
    initial:{
        billing:{
            data:[],
            visible:false
        }
    },
    reducers:{
        setBillingOrders(prev,payload){
            return prev.update("billing",billing=>billing.set("data",payload));
        },
        setBillingVisible(prev,payload){
            return prev.update("billing",billing=>billing.set("visible",payload))
        }
    },
    saga: BillingOrdersSaga
})
export class Billing extends React.PureComponent<{visible:boolean,form:any,data:any,dispatch:any},any>{
    componentDidMount(){
        this.props.dispatch(getBillingOrders());

    }

    getTodos = createSelector(
        array=>array as any,
        (array)=>{
        return array.filter(itm=>itm.count>5)
    })

    handleClick=()=>{
        const filterTodos = this.getTodos(todos);
        console.log(filterTodos)
    }

    state={
        modelKey:"",
        operation:"",
        entity:{},
        deleteVisible:false
    }
    gridActions = [/*{
        call:(data)=>{
            this.props.dispatch(setBillingVisible(true))
           this.setState({operation:"编辑",visible:true,entity:data})
        },
        displayName:"编辑",
    },{
        call:(data)=>{
          console.log(data)
        },
        displayName:"删除",
        confirmed:true
    },*/{
        call:(data)=>{
            this.props.dispatch(setBillingVisible(true))
            this.setState({operation:"new",modelKey:Math.random()})
        },
        displayName:"+ 新建",
        isStatic:true
    }]

    handleClose=()=>{
        this.props.dispatch(setBillingVisible(false))
        this.setState({deleteVisible:false})

    }
    onSubmit=(formData)=>{
        if(formData.type==="month_pay"){
            if(!formData.month_num){
                formData.month_num=0;
            }
        }
        if(formData.type==="one_time_year_pay"){
            if(!formData.year_num){
                formData.year_num=0;
            }
        }
            this.props.dispatch(addBillingOrder(formData));
            this.setState({visible:false})
    }
 render(){
        return <div>
            {/*    <Button
            onClick={this.handleClick}
            ></Button>
            */}
            {<SchemaTable
                selectionStyle="checkbox"
                schema={basicBillingSchema}
                data={this.props.data}
                actions={this.gridActions}
                expandedRowRender={record => <p>{record.company}</p>}
            />}
            <Modal
               visible={this.props.visible}
               title={this.state.operation==="new"?"+ 新建":"编辑"}
               onCancel={this.handleClose}
               footer={null}
               width="70%"
               key={this.state.modelKey}
            >
                {this.state.operation==="new"?<div>
                    <p style={{color:Theme.accent1Color,fontSize:"14px"}}>提示:类型为月付或者年付,请选择专线接入月租;类型为一次性费用,请选择专线接入一次性费用;没有数据中心,输入0</p>
                    <ReduxSchemaForm
                    key="add"
                    form="addBilling"
                    schema={billingSchema}
                    onSubmit={this.onSubmit}
                    getFormState={s=>s.get("form")}
                    destroyOnUnmount={true}
                    enableReinitialize={true}
                    initialValues={{}}
                    validate={v=>{return validate(v,billingSchema)}}
                />
                   </div> :
                    <ReduxSchemaForm
                        key="edit"
                        form="editBilling"
                        schema={billingSchema}
                        onSubmit={this.onSubmit}
                        getFormState={s=>s.get("form")}
                        destroyOnUnmount={true}
                        enableReinitialize={true}
                        initialValues={this.state.entity}
                        noButton={true}
                    />
                }
            </Modal>
        </div>
    }
}