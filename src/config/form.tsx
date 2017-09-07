/**
 * Created by Administrator on 2017/8/1.
 */
import * as React from "react"
const {Radio} = require("antd/lib");
const RadioGroup = Radio.Group;

const Input = require("antd/lib/input");
const {TextArea} =Input;
const DatePicker = require("antd/lib/date-picker");
const {RangePicker} = DatePicker;
const Select = require("antd/lib/select");
const Option = Select.Option;
const Checkbox = require("antd/lib/checkbox");
const InputNumber = require("antd/lib/input-number");
import {addType} from "redux-schema-form"
const {Field,FieldArray} =require("redux-form");
const moment = require("moment")
const errorStyle={color:"red"};
class CheckboxInput extends React.Component<any,any>{
    componentDidMount(){
        this.props.input.onChange(!!this.props.input.value)
    }
    render(){
        return <Checkbox
            onBlur={(e)=>{this.props.input.onBlur(!!this.props.input.value)}}
            style={Object.assign({width:"100%"},this.props.fieldSchema.hide?null:{lineHeight:"50px",height:"50px"})}
            disabled={this.props.disabled}
            onChange={(e)=>this.props.input.onChange(e.target["checked"])}
            checked={Boolean(this.props.input.value)}
        >{this.props.fieldSchema.label}{this.props.fieldSchema.required&&<span style={errorStyle}>*</span>}</Checkbox>;
    }
}

class  AntdSelectInput extends React.Component<any,any>{

    render(){
        return<div
            style={this.props.fieldSchema.hide?{}:{height:"50px"}}
        >
            <div>{this.props.fieldSchema.label}{this.props.fieldSchema.required&&<span style={errorStyle}>*</span>}</div>
            <Select
                showSearch
                placeholder={this.props.fieldSchema.placeholder}
                style={{ width: "100%" }}
                disabled={this.props.disabled}
                mode={this.props.fieldSchema.multiple?"multiple":"default"}
                optionFilterProp="children"
                value={this.props.fieldSchema.multiple?((this.props.input.value instanceof Array)?(this.props.input.value.map(itm=>(""+itm))):[]):""+this.props.input.value}
                onChange={(value)=>this.props.input.onChange(isNaN(Number(value))?value:((Number(value))==value?Number(value):value))}
                filterOption={(input, option) => {
                    return option["props"].children.toLowerCase().indexOf(input.toLowerCase()) >= 0}}

            >

                {this.props.fieldSchema.options.map(option=>(
                    <Option key={option.name} value={""+option.value}>{option.name}</Option>
                ))}
            </Select>
            {this.props.meta.touched&&this.props.meta.error&&<div style={errorStyle}>{this.props.meta.error}</div>}
        </div>
    }

}

function NumberInput(props){
    let required={
        required:props.required
    };
    return <div
        style={Object.assign({width:"100%"},props.fieldSchema.hide?null:{height:"50px"})}
    >
        <div>{props.fieldSchema.label}{props.fieldSchema.required&&<span style={errorStyle}>*</span>}</div>

        <InputNumber
            {...required as any}
            style={{width:"100%"}}
            id={props.input.name}
            min={0}
            disabled={props.disabled}
            value={props.input.value===""?undefined:Number(props.input.value)}
            placeholder={props.fieldSchema.placeholder}
            onChange={(value)=>{if(isNaN(parseFloat(value as any))){
                props.input.onChange(0)
            }else{
                props.input.onChange(Number(value as any) )
            }
            }} />
        {props.meta.touched&&props.meta.error&&<div style={errorStyle}>{props.meta.error}</div>}

    </div>
}
function DateInput(props){
    let required={
        required:props.required
    };
    let value= null;
    if(props.input.value){
        if(!(props.input.value instanceof moment))
            value=new moment(props.input.value);
    }

    return<div
        style={props.fieldSchema.hide?{}:{height:"50px"}}
    >
        <div>{props.fieldSchema.label}{props.fieldSchema.required&&<span style={errorStyle}>*</span>}</div>
        <DatePicker
            {...required as any}
            key={props.fieldSchema.name}
            value={value}
            disabled={props.disabled}
            style={{width:"100%"}}
            onChange={(date,dateString)=>{props.input.onChange(dateString)}}
        />
        {props.meta.touched&&props.meta.error&&<div style={errorStyle}>{props.meta.error}</div>}
    </div>
}


function TextInput(props){
    let required={
        required:props.required
    };
    return <div style={props.fieldSchema.hide?{}:{height:"50px"}}>
        <div>{props.fieldSchema.label}{props.fieldSchema.required&&<span style={errorStyle}>*</span>}</div>
        <Input type={props.type}
               placeholder={props.fieldSchema.placeholder}
               id={props.input.name}
               className="full-width"
               style={{width:"100%"}}
               name={props.input.name}
            {...required as any}
               onBlur={props.input.onBlur}
               disabled={props.disabled}
               value={props.input.value}
               onChange={props.input.onChange}

        />
        {props.meta.touched&&props.meta.error&&<div style={errorStyle}>{props.meta.error}</div>}
    </div>
}


addType("password",TextInput);
addType("email",TextInput);
addType('text',TextInput);
addType('date',function (props){
    return <div>
        <Field name={props.keyPath} {...props} component={DateInput} />
    </div>
});
addType('checkbox',function (props){
    return <div>
        <Field name={props.keyPath} {...props} component={CheckboxInput} />
    </div>
});
addType('select',function (props){
    return <div>
        <Field name={props.keyPath} {...props} component={AntdSelectInput} />
    </div>
});
addType('number',function (props){
    return <div>
        <Field name={props.keyPath} {...props} component={NumberInput} />
    </div>
});
