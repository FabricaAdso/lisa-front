import { QueryUrl } from "@shared/models/query-url.model";

export function getQueryUrl(url: string, data?: QueryUrl) {
    if (data) {
        url += '?';
        const { included, filter } = data;
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
    }
    return url;
}