import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";

export declare type RequestHandler = {
    path: string,
    middleware: AbstractHandler
}

export interface AbstractHandler {

    handle(req: req, res: Response): Response;

}

export declare type req = {
    bodyUsed: boolean,
    headers: any,
    method: string,
    redirect: string,
    url: string,
    params: any,
    query: any
}

export class DefaultErrorHandler implements AbstractHandler {

    message = "There was an error handling that request";
    status = 500;

    constructor(message: string, status?: number) {
        this.message = message;
        this.status = status ? status : 500;
    }

    handle(req: req, res: Response) {
        res = new Response(this.message, { status: this.status });
        return res;
    }

}

const getreqs: RequestHandler[] = [];
const postreqs: RequestHandler[] = [];
// deno-lint-ignore no-var
var response: Response = new Response(JSON.stringify({ message: "Default response" }), { status: 200 });

export default class HttpHandler {

    private foundHandler = false;
    static errorHandler: AbstractHandler;

    constructor() {
        HttpHandler.errorHandler = new DefaultErrorHandler("There was an error handling that request");
    }

    setErrorHandler(errorHandler: AbstractHandler){
        console.log("Called", errorHandler);
        HttpHandler.errorHandler = errorHandler;
    }

    get(path: string, middleware: AbstractHandler){
        getreqs.push({ path: path, middleware: middleware } as RequestHandler);
    }
    
    post(path: string, middleware: AbstractHandler){
        postreqs.push({ path: path, middleware: middleware } as RequestHandler);
    }

    handle(req: Request){

        this.foundHandler = false;

        const path = (req.url.replace(/(?:[^\/]*\/){3}/g, "") === "" ? "/" : "/" + req.url.replace(/(?:[^\/]*\/){3}/g, ""));

        const cosntructed_request: req = {
            bodyUsed: req.bodyUsed,
            headers: req.headers,
            method: req.method,
            redirect: req.redirect,
            url: req.url,
            params: {},
            query: {}
        }

        switch(req.method) {
            case "GET":
                for(let i = 0; i < getreqs.length; i++){
                    const handler = getreqs[i];

                    if(handler.path.split("/:")[0] === path || path.startsWith(handler.path.split("/:")[0])){
                        
                        const raw_params = (handler.path.match(/(\/\:([\a-\z]|[\A-\Z]|\_)+)/g) || []);

                        const params: any = {};
    
                        const path_params_raw: string[] = path.split("/");
    
                        path_params_raw.shift();
                        path_params_raw.shift();
    
                        for(let i = 0; i < raw_params.length; i++){
                            
                            const raw = raw_params[i].replace("/:", "");
    
                            params[raw] = path_params_raw[i].replace(/\?.*/, "");
    
                        }
    
                        console.log(`${chalk.red("[Debug]")} ${chalk.yellow("Params")}`, params);

                        cosntructed_request.params = params;
                        
                        const query_raw = path.split("?")[1];

                        if(Object.entries(params).length > 0){

                            const query_raw_params = query_raw.split("&");

                            const query: any = {};

                            query_raw_params.forEach(qp => {
                                query[qp.split("=")[0]] = qp.split("=")[1];
                            });

                            console.log("Query", query);

                        }

                        const opres = handler.middleware.handle(cosntructed_request, response);
                        if(opres) response = opres;
                        this.foundHandler = true;
                    }
                }
                break;
            case "POST":
                postreqs.forEach(handler => {
                    if(handler.path === path){
                        response = handler.middleware.handle(cosntructed_request, response);
                        this.foundHandler = true;
                    }
                });
                break;
            default:
                this.foundHandler = true;
                response = new Response("That type of request is not supported on this application", { status: 200 });
                break;
        }

        if(!this.foundHandler){
            if(!HttpHandler.errorHandler){
                response = new DefaultErrorHandler("The request could not be completed").handle(cosntructed_request, response);
            } else {
                response = HttpHandler.errorHandler.handle(cosntructed_request, response);
            }
        }

        console.log(chalk.bold.inverse(req.method), chalk.cyan(path), chalk.green(response.status));

        return response;

    }

}