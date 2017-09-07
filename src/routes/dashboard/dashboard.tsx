/**
 * Created by buhi on 2017/5/3.
 */
import * as React from "react"
import {ReduxComponent, RootState} from "../../bootstrap"
import {createSelector} from "reselect"

@ReduxComponent({
    selector:createSelector<RootState,any,any,any>(
        s=>null,
        s=>null,
        ()=>({
            todos:[]
        })
    )
})
export class DashboardPage extends React.PureComponent<{
    todos:any[],
    dispatch
},{}>{
    render(){
        return <div>
            todo
        </div>
    }
}