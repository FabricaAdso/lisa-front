import { QueryUrl } from "@shared/models/query-url.model";

export function getQueryUrl(url: string, data?: QueryUrl) {
    if (data) {
        url += '?';
        const { included, filter, page , elements } = data;
        if (included) {
            url += `included=${included.join(',')}`
        }

        if (filter) {
            url += url.split('').at(-1) === '?' ? '' : '&';
            Object.keys(filter).forEach(key => {
                url += `filter[${key}]=${filter[key]}`
                url += Object.keys(key).at(-1) !== key ? '' : '&';
            });
        }

        if(page){
            url += url.split('').at(-1) === '?' ? '' : '&';
            url += `page=${page}`
        }

        if(elements){
            url += url.split('').at(-1) === '?' ? '' : '&';
            url += `elements=${elements}`
        }
    }
    return url;
}