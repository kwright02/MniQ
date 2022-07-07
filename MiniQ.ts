import Router from "./src/components/Router.ts";
import ComponentMapper from "./src/framework/ComponentMapper.ts";
import { Server } from "https://deno.land/std@0.147.0/http/server.ts";
import HttpHandler from "./src/framework/network/HttpHandler.ts";

export default class MiniQ {

    static readonly DEFAULT_PORT = 3000;

    static mapper: ComponentMapper = new ComponentMapper();
    static router: Router = new Router();
    static server: Server = new Server({ port: this.DEFAULT_PORT, handler: MiniQ.defaultRequestHandler });

    private static defaultRequestHandler(req: Request) {
        
        return HttpHandler.handle(req);

    }

    static async start(port?: number, callback?: Function){
        if(port) MiniQ.server = new Server({ port: port, handler: MiniQ.defaultRequestHandler });
        if(callback) callback(port);
        await this.server.listenAndServe();
    }

    static stop(){
        this.server.close();
    }

}