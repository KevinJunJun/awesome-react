import {IRouteConfig} from "guguder"
import * as React from "react"
import {App} from "../app";
import {Billing} from "../routes/billing/billing";

const Page404 = {
    name:"notFound",
    path:"*",
    component:()=><div>404</div>
};

export const appRoutes:IRouteConfig[] = [
    {
        code:"0",
        name:"专线计费",
        path:"billing",
        exact:true,
        component:Billing
    },{
        name:"系统管理",
        path:"system",
        exact:true,
        component:Billing,
        children:[{
            component:Billing,
            name:"用户管理",
            path:"user"
        },{
            name:"角色管理",
            path:"role",
            component:Billing
        }]
    }
];

export const rootRoutes:IRouteConfig[] = [
    {
        name:"App",
        path:"/",
        component: App,
        children:appRoutes
    },
    Page404
];