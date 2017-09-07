
declare interface NodeRequire{
    ensure(deps:string[],callback:(require:NodeRequire)=>void,errcb:()=>void,bundleName?:string):void
}

declare namespace ENV{
    const ERROR_REPORTING_URL:string
    const SERVICE_WORKER_ON:boolean
    const API_URL:string
}