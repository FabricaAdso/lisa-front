import { QueryUrl } from "@shared/models/query-url.model";
import { normalizeString } from "./string.functions";


export function getQueryUrl(url: string, data?: QueryUrl): string {
  if (data) {
    // almacena un array pra cada paremetro
    let params: string[] = [];
    const { included, filter, page,  } = data;
    // si inclided se unen en una cadena separa por coma
    if (included) {
      params.push(`included=${included.join(',')}`);
    }

    if (filter) {
      // itera cada clave dek objeto
      Object.keys(filter).forEach((key) => {
        let filter_value: string = '';
        if (typeof filter[key] === 'number') {
          filter_value = filter[key].toString();
        } else {
          filter_value = filter[key] as string;
        }

        // si tiwne una función de normalización
        filter_value = normalizeString(filter_value).replace(/ /g, '-').toLowerCase();
        params.push(`filter[${key}]=${filter_value}`);
      });
    }

    if (page) {
      params.push(`page_number=${page}`);
    }

    /* if (page_size) {
      params.push(`page_size=${page_size}`);
    } */

    url += '?' + params.join('&');
  }
  return url;
}


