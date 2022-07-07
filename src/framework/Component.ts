import MiniQ from "../../MiniQ.ts";
import { ComponentMap } from "./ComponentMapper.ts";

export interface Component {

    onInit(): void;

}

export default class AbstractComponent implements Component {

    constructor() {}

    onInit(): void {
        
    }

}

export const template = (component_mapping: ComponentMap) => {
    
    MiniQ.mapper.addComponentMapping(component_mapping);

    return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => { return; }

}