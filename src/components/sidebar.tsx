/**
 * Created by Administrator on 2017/8/18.
 */
import * as React from "react"
import {UtilService} from "../services/utilService";
import {appRoutes} from "../config/routes";
import {history} from "../bootstrap"
const { Menu, Icon } =require( 'antd/lib');
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const getMenus=(menus)=>{
    return menus.map(itm=>{
        if(itm.children){
            return <SubMenu
                key={itm.to}
                title={itm.name}

            >
                {getMenus(itm.children)}
            </SubMenu>
        }else{
            return <Menu.Item
                key={itm.to}
            >
                {itm.name}
            </Menu.Item>
        }
    })
}
export class Sidebar extends React.PureComponent<{currentPathname:string},any>{
    handleClick = (itm) => {
        console.log(itm.key);
        history.push(itm.key);
    }

    render(){
        const {currentPathname} = this.props;
        const defaultOpenKeys=currentPathname.slice(0,currentPathname.lastIndexOf("/"))
        return <div>
            <Menu
                onClick={this.handleClick}
                defaultSelectedKeys={[this.props.currentPathname]}
                mode="inline"
                theme="dark"
                defaultOpenKeys={[defaultOpenKeys]}
            >
                {

                    getMenus(UtilService.routeConfigToMenu(appRoutes))
                }
            </Menu>
        </div>
    }
}