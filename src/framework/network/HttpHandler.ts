export class Middleware {

    constructor(req: Request, res: Response){

    }

}

export default class HttpHandler {

    listeners: any[] = [];

    constructor() {}

    get(path: string, middleware: Middleware){
        this.listeners.push({ type: 'GET', path: path, middleware: middleware });
    }
    
    post(path: string, middleware: Middleware){
        this.listeners.push({ type: 'POST', path: path, middleware: middleware });
    }

    static handle(req: Request){

        const path = ((req.url.match('/\//g') || []).length === 3 ? "/" : req.url.split("/")[2]);

        console.log(path);

        const res = new Response();

        return res;

    }

}