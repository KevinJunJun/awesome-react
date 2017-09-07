/**
 * Created by Administrator on 2017/8/21.
 */
import * as React from "react"
export class Topbar extends React.PureComponent<any,any>{
    render(){
        return <div id="topbar">
            <div className="topbar-left">
                <span className="logo">
                    UCLOUD
                </span>
                <span className="brand">
                    专线计费系统
                </span>
            </div>
            <div className="topbar-right">

            </div>
        </div>
    }
}