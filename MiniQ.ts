import Router from "./src/components/Router.ts";
import ComponentMapper from "./src/framework/ComponentMapper.ts";

export default class MiniQ {

    static mapper: ComponentMapper = new ComponentMapper();
    static router: Router = new Router();

}