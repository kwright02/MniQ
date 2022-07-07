export declare type ComponentMap = {
    html: string,
    css: string,
    ts: string
}

export default class ComponentMapper {

    private component_mappings: ComponentMap[] = [];

    constructor(){}

    addComponentMapping(component_mapping: ComponentMap): void {
        this.component_mappings.push(component_mapping);
    }

    getComponentMappings(): ComponentMap[] {
        return this.component_mappings;
    }

    removeComponentMapping(component_mapping: ComponentMap): void {
        
        const temp_mappings: ComponentMap[] = [];

        this.component_mappings.forEach(mapping => {
            if(mapping !== component_mapping){
                temp_mappings.push(mapping);
            }
        });

        this.component_mappings = temp_mappings;

    }

    clearComponentMappings(): void {
        this.component_mappings = [];
    }


}