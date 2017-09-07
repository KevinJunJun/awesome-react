/**
 * Created by Administrator on 2017/8/21.
 */
import * as React from "react"
import {Table,Button,Popconfirm,Input,DatePicker,Icon} from "antd";
import {typeOptions, globalSearchKey} from "../services/constantService";
import {createSelector} from "reselect";
import {TableProps} from "antd/es/table/Table";
const {RangePicker} = DatePicker;
export type columnType = "text"|"number"|"select"|"checkbox"|"date"|"datetime-local"|"datetime"|"group"|"time"|null;
export type Options = {name:string,value:string|number,color?:string}[]
export type AsyncFormatter = (value:any)=>Promise<string>
export type AsyncOptions = ()=>Promise<Options>;
const datetimeFormatOptions = {year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false};
const timeFormatOptions = {hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false};
const dateFormatOptions = {year:"numeric",month:"2-digit",day:"2-digit"};
const fuzzy = require("fuzzy");
const moment = require("moment")

export interface ITableSchema{
    key:string,
    label:string,
    type:columnType,
    options?:Options | AsyncFormatter | AsyncOptions,
}

export interface gridSchema {
    title:string,
    dataIndex:string,
    key:string,
    sort:()=>boolean
}
export class SchemaTable extends React.Component< TableProps<any>&{rowKey?:()=>string|string,noSearch?:boolean,selectionStyle?:"checkbox",actions?:any[],schema:any[],data:any[],},any>{

    state={
        schema:[],
        staticActions:[],
        selectedRowKeys:[],
        text:null,
        data:[],
        originData:[],
        filterDropdownVisible:false,
        dateFiltered:false
    }
    renderSchema=(itm,schemaItem)=>{
       schemaItem["render"]=(value)=>{
           let option = itm.options.find(x=>x.value===value);
           return option&&option.name||value
       };
       return schemaItem;
    }

    getActions(){
        let gridActions = [];
        let staticActions=[];
        this.props.actions&&this.props.actions.forEach(itm=>{
            if(itm.isStatic){
                staticActions.push(itm)
            }else{
                gridActions.push(itm);
            }
        });
        return {staticActions,gridActions}
    }


    confirm=(data,itm)=>{
        itm.call(data);
    }

    cancel=()=>{

    }
    onFilterChange=()=>{
        let data = this.state.originData.slice();
        data =this.filterOptions.reduce((prev,current)=>{
            if(current.type==="date"){
                return prev.filter(x=>(moment(x[current.key]).isAfter(moment(current.rule[0]))&&moment(x[current.key]).isBefore(moment(current.rule[1]))))
            }else{
                return prev;
            }
        },data);
        let index = this.filterOptions.findIndex(x=>x.key===globalSearchKey);
        if(index>=0){
            let results= fuzzy.filter(this.filterOptions[index].text,data,this.searchOptions);
            data = results.map(itm=>itm.original)
        }
        this.setState({data});
    }

    filterOptions=[];
    parseSchema = (schema,gridActions)=>{
        let parsedSchema = schema.map(itm=>{
            let schemaItem={
                title:itm.label,
                dataIndex:itm.key,
                key:itm.key,
                sorter:(a,b)=>a[itm.key]-b[itm.key]
            }
            switch (itm.type){
                case "select":
                    if(typeof itm.options ==="object" ){

                        schemaItem["filters"]=itm.options.map(x=>({
                            text:x.name,
                            value:x.value
                        }))
                        schemaItem["onFilter"]=(value,record)=>String(record[itm.key]).indexOf(String(value))===0
                        return this.renderSchema(itm,schemaItem);
                    }
                    break;
                case "time":
                    schemaItem["render"]=(value)=>{
                        return <div>{value?new Date(value).toLocaleString(undefined,timeFormatOptions).replace(/\//g,'-'):""}</div>
                    };
                    return schemaItem;

                case "date":
                    schemaItem["render"]=(value)=>{
                        return <div>{value?new Date(value).toLocaleString(undefined,dateFormatOptions).replace(/\//g,'-'):""}</div>
                    }

                    schemaItem["filterDropdown"]=(<div className="custom-filter-dropdown">
                        <RangePicker
                            getCalendarContainer={() => document.querySelector('.custom-filter-dropdown') as any}
                            onChange={(date,dateString)=>{
                            if(date.length>0){
                                this.setState({dateFiltered:true})
                                let index = this.filterOptions.findIndex(x=>x.key===itm.key);
                                if(index>=0){
                                    this.filterOptions[index].rule=dateString;
                                }else{
                                    this.filterOptions.push({
                                        key:itm.key,
                                        type:"date",
                                        rule:dateString
                                    })
                                };
                            }else{
                                this.setState({dateFiltered:false})
                                let index = this.filterOptions.findIndex(x=>x.key===itm.key);
                                if(index>=0){
                                    this.filterOptions.splice(index,1);
                                }
                            }
                              this.onFilterChange();
                        }}
                        />
                    </div>);
                    schemaItem["filterIcon"]=(<Icon type="filter" style={{ color: this.state.dateFiltered ? '#108ee9' : '#aaa' }} />)
                    schemaItem["filterDropdownVisible"]= this.state.filterDropdownVisible;
                    schemaItem["onFilterDropdownVisibleChange"]=(visible)=>{
                        this.setState({
                            filterDropdownVisible:visible
                        })
                    }
                    return schemaItem;
                case "datetime":
                    schemaItem["render"]=(value)=>{
                        return <div>{value?new Date(value).toLocaleString(undefined,datetimeFormatOptions).replace(/\//g,'-'):""}</div>
                    }
                    return schemaItem;
                case "checkbox":
                    schemaItem["render"]=(value)=>{
                        return <div>
                            {value?"是":"否"}
                        </div>
                    }
                default:
                    return schemaItem
            }
        });
        if(gridActions.length>0){
            parsedSchema.push({
                title:"操作",
                dataIndex:"",
                key:"Actions",
                render:(text,record,index)=>{
                    return <div>
                        {
                            (gridActions).map((itm)=>{
                                if(!itm.confirmed){
                                    return <Button key={itm.displayName}
                                                   disabled={itm.enabled?itm.enabled(record):false}
                                                   onClick={(event)=>{delete record.key;itm.call(record,event)}}>
                                                    {itm.displayName}
                                        </Button>
                                }else{
                                    return <Popconfirm key={itm.displayName} title="确认执行该操作?" onConfirm={()=>this.confirm(record,itm)} onCancel={this.cancel} okText="是" cancelText="否">
                                        <Button
                                                disabled={itm.enabled?itm.enabled(record):false}
                                              >
                                            {itm.displayName}
                                        </Button>
                                    </Popconfirm>
                                }

                            })
                        }
                    </div>
                }
            });
        }
        return parsedSchema;
    }
    updateDateFilter = createSelector(
        s=>(s as any).filterDropdownVisible,
        s=>(s as any).dateFiltered,
        ()=>{
            this.onReady();
        }
    )
    onReady=()=>{
        const {gridActions,staticActions} =this.getActions();
        Promise.all(this.props.schema.map(itm=>{
            if(typeof itm.options ==="function" ){
                return itm.options().then(options=>{
                    itm.options = options;
                    return itm;
                })
            }else{
                return Promise.resolve(itm)
            }
        })).then(attrSchema =>{
            let schema =  this.parseSchema(attrSchema,gridActions);
            this.props.noSearch||(this.searchOptions={
                extract:(el)=>{
                    let text="";
                    attrSchema.forEach(itm=>{
                        if(itm.type==="select"){
                            let option = itm.options.find(x=>x.value===el[itm.key]);
                            let textValue=option?option.name:"";
                            text+=textValue;
                        }else{
                            text+=el[itm.key];
                        }
                    });
                    return text;
                }
            })
            this.setState({schema,staticActions})
        })
    }
    componentDidMount(){
    this.setState({
        originData:this.props.data.map((itm)=>{return {...itm}}),
        data:this.props.data.map((itm)=>{return {...itm}})
    })
    }
    componentWillReceiveProps(newProps){
        if(newProps.data !== this.props.data){
            this.setState({
                data:newProps.data.map((itm)=>{return {...itm}}),
                originData:newProps.data.map((itm)=>{return {...itm}})
            })
        }
    }



    onSelectChange=(selectedRowKeys)=>{
        this.setState({selectedRowKeys});
    }
    updateFilter;
    searchOptions;
    filter=(e)=>{
        let searchText = e.target.value;
        let index = this.filterOptions.findIndex(x=>x.key===globalSearchKey);
        if(!e.target.value){
            if(index>=0){
                this.filterOptions.splice(index,1)
            }
            this.onFilterChange();
        }else{
           if(index>=0){
               this.filterOptions[index].text=searchText
           }else{
               this.filterOptions.push({
                   key:globalSearchKey,
                   type:"text",
                   text:searchText
               })
           }
        }
        if(this.updateFilter)
            clearTimeout(this.updateFilter);
        this.updateFilter=setTimeout(()=>{
         this.onFilterChange();
            },400)

        console.log(e.target.value)
    }
    render(){
        const {data,rowKey,noSearch,selectionStyle,actions,schema,...others}=this.props;
        this.updateDateFilter(this.state);
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange:this.onSelectChange
        }
        const hasSelected = selectedRowKeys.length>0;
        const isCheckbox = this.props.selectionStyle&&this.props.selectionStyle==="checkbox";
        return <div>
            <div style={{color:"red"}}>{this.state.text}</div>
            <div style={{position:"relative"}}>{this.state.staticActions.length>0&&this.state.staticActions.map(itm=>(<Button
                key={itm.displayName}
                disabled={itm.enabled?itm.enabled(selectedRowKeys):false}
                onClick={()=>{itm.call(this.props.data.filter(itm=>selectedRowKeys.indexOf(itm.id)>=0))}}
            >{itm.displayName}</Button>))}
                <span style={{position:"absolute",width:"20%",right:"8px"}}>{this.props.noSearch||<Input onChange={this.filter} placeholder="search..."/>}</span>
            </div>
            <Table style={{marginTop:8}}
                   rowSelection={isCheckbox?rowSelection:null}
                   columns={this.state.schema}
                   rowKey={this.props.rowKey||"id"}
                   dataSource={this.state.data}
                    pagination={{
                        total:this.state.data.length,
                        showSizeChanger:true,
                        showQuickJumper:true,
                        pageSizeOptions:["20","50","100","200"],
                       defaultPageSize:20
                    } }
                {...others}
            />
        </div>
    }
}