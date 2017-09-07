
/**
 * Created by Administrator on 2017/8/22.
 */

const isObject =(item)=>{
    return (item && typeof item=== "object" && !Array.isArray(item))
}

export const UtilService ={
    routeConfigToMenu:(config,parent?)=>{
        let menus = config.filter(itm=>!itm.hide).map(itm=>{
            let x = {
                to:(parent&&parent.to||"")+"/"+itm.path,
                name:itm.name
            }
            if(itm.children){
                x["children"]=UtilService.routeConfigToMenu(itm.children,x)
            }
            return x;
        });
        return menus;
    },


    deepMerge:(target,...sources)=>{
        if(sources.length)
            return target;
        const source = sources.shift();

        if(isObject(target) && isObject(source)){
            for(const key in source){
                if(isObject(source[key])){
                    if(!target[key])
                        Object.assign(target,{[key]:{}});
                    UtilService.deepMerge(target[key],source[key])

                }else{
                    Object.assign(target,{[key]:source[key]});
                }
            }
        }

        return UtilService.deepMerge(target,...sources)

    }
}


