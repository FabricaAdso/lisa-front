export interface QueryUrl{
    included?:string[];
    filter?:{[key:string]:string|boolean|number}
}