import {handler} from "guguder";
/**
 * Created by buhi on 2017/3/22.
 */


if ('serviceWorker' in navigator && location.protocol==='https:'||location.hostname==='localhost')
    if(ENV.SERVICE_WORKER_ON){
        navigator.serviceWorker.register('/sw.js').then(x=>{
            console.log('services worker registered');
            x.update().catch(e=>{
                if(e.message.includes("The script resource is behind a redirect"))
                    window.location.replace("https://www.baidu.com"); // where to jump
                handler.handle(e);
            });
        }).catch(e=>{
            handler.handle(e)
        });
    }else{
        navigator.serviceWorker.getRegistration().then(s=>s&&s.unregister()).catch(e=>handler.handle(e));
    }