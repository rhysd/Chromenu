import Action from './type';

export function createPage(): Action {
    return {
        type: 'CreatePage',
    };
}

export function configurePage(index: number, url: string, image_url: string): Action {
    return {
        type: 'ConfigurePage',
        index,
        url,
        image_url,
    };
}

export function setConfigured(index: number, value: boolean): Action {
    return {
        type: 'SetConfigured',
        index,
        value,
    };
}

export function deletePage(index: number): Action {
    return {
        type: 'DeletePage',
        index,
    };
}
