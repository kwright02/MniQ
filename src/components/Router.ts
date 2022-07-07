import { Component } from "../framework/Component.ts";

export declare type RouterPath = {
    path: string,
    component: Component
}

export default class Router {

    private routes: RouterPath[] = [];

    constructor() {}

    addPath(path: RouterPath){
         this.routes.push(path);
    }

    addPaths(paths: RouterPath[]){
        this.routes.concat(paths);
    }

    push(path: string){

        if(this.routeExists(path)){
            //change state
            console.log('[Router] Navigating to', path);
        } else {
            console.error(new Error("The path '" + path + "' does not exist."))
        }

    }

    routeExists(path: string) {
        this.routes.forEach(mapping => {
            if (path == mapping.path){
                return true;
            }
        });
        return false;
    }

}