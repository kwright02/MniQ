import Router from "./src/components/Router.ts";
import ComponentMapper from "./src/framework/ComponentMapper.ts";
import { Server } from "https://deno.land/std@0.147.0/http/server.ts";
import HttpHandler, { AbstractHandler } from "./src/framework/network/HttpHandler.ts";

export default class MiniQ {

    readonly DEFAULT_PORT = 3000;

    mapper: ComponentMapper = new ComponentMapper();
    router: Router = new Router();
    handler: HttpHandler = new HttpHandler();
    server: Server = new Server({ port: this.DEFAULT_PORT, handler: this.handler.handle });

    get(path: string, middleware: AbstractHandler){
        this.handler.get(path, middleware);
    }

    post(path: string, middleware: AbstractHandler){
        this.handler.post(path, middleware);
    }

    async start(port?: number, callback?: Function){

        if(port) this.server = new Server({ port: port, handler: this.handler.handle });
        if(callback) callback(port);

        console.log(this.handler);

        await this.server.listenAndServe();
    }

    stop(){
        this.server.close();
    }

}