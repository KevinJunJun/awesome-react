import {ReduxComponent} from "./bootstrap";
import {RouteComponentProps} from "guguder";
import * as React from "react";
import {ReduxSchemaForm} from "redux-schema-form";
const DatePicker= require('antd/lib/date-picker');
const message =require("antd/lib/message")
import {push} from "react-router-redux";
import {Sidebar} from "./components/sidebar";
import {Topbar} from "./components/topbar";
import {Breadcrumb} from 'antd';
import {Link} from "react-router-dom"
import "./config/http"

const breadcrumbNameMap = {
    '/apps': 'Application List',
    '/apps/1': 'Application1',
    '/apps/2': 'Application2',
    '/apps/1/detail': 'Detail',
    '/apps/2/detail': 'Detail',
};

const schema = [{
    key:"parent",
    label:"父",
    type:"text",
    onValueChange:(v)=>{
        if(v=="123"){
            return [{
                key:"son",
                hide:false
            }]
        }else{
            return [{
                key:"son",
                hide:true
            }]
        }

    }
},{
    key:"son",
    label:"子",
    type:"text"
}]


@ReduxComponent({
    selector:s=>({
        todos:s.todos
    })
})
export class App extends React.PureComponent<RouteComponentProps&{
    dispatch?,
    todos,
    location
},{}>{
    state={
        date:""
    }
    handleChange(date) {
        message.info('您选择的日期是: ' + date.toString());
        this.setState({ date });
    }
    onSubmit=(formData)=>{

    }
    componentDidMount(){
        if(this.props.location.pathname==="/"){
            this.props.dispatch(push("/billing"))
        }

    }
    getBrandcrumb=(location)=>{
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {breadcrumbNameMap[url]}
                    </Link>
                </Breadcrumb.Item>
            );
        });
        const breadcrumbItems = [(
            <Breadcrumb.Item key="home">
                <Link to="/">Home</Link>
            </Breadcrumb.Item>
        )].concat(extraBreadcrumbItems);
        return breadcrumbItems;
    }
    render(){
         const { location } = this.props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {breadcrumbNameMap[url]}
                    </Link>
                </Breadcrumb.Item>
            );
        });
        const breadcrumbItems = [(
            <Breadcrumb.Item key="home">
                <Link to="/">Home</Link>
            </Breadcrumb.Item>
        )].concat(extraBreadcrumbItems);
        return <div >
            <div id="topbar-wrapper">
              <Topbar/>
            </div>
            <div id="page-content-wrapper">

                <div id="sidebar-wrapper">
                    <Sidebar currentPathname={this.props.location.pathname}/>
                </div>
                <div id="page-content">
                    <div style={{marginBottom:8}}>
                    <Breadcrumb>
                        {breadcrumbItems}
                    </Breadcrumb>
                    </div>
                    {this.props.children}
                </div>
            </div>


            {/* <div className="footer">
                Copyright@<a target="_blank" href="http://github.com/kevinJunJun">github.com/kevinJunJun</a>
            </div>
            */}

        </div>


    }
}