/**
 * Created by Administrator on 2017/8/21.
 */
import * as React from "react";
const {Button} = require("antd/lib")


export class TextTable extends React.Component<any,any>{
   state={
       text:"123",
   }

    click=()=>{
        this.setState({text:"111"})
    }
    render(){
        return <div>
            <div style={{color:"red"}}>{this.state.text}</div>
                <Button onClick={this.click}>click</Button>
        </div>
    }
}
