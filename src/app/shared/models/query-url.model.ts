export interface QueryUrl{
    included?:string[];
    filter?:{[key:string]:string|boolean|number}
    page?:number;
    elements?:number;
    per_page?: number;
    [key: string]: any; // permitir propiedades adicionales como "month"
}
