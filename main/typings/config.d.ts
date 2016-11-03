type KeymapAction
    = 'page1'
    | 'page2'
    | 'page3'
    | 'page4'
    | 'page5'
    | 'page6'
    | 'page7'
    | 'page8'
    | 'page9'
    | 'reload'
    | 'back'
    | 'forward'
    | 'home'
    | 'open-external-browser'
    | 'next-page'
    | 'previous-page'
    | 'scroll-down'
    | 'scroll-up'
    | 'scroll-left'
    | 'scroll-right'
    | 'scroll-down-half-page'
    | 'scroll-up-half-page'
    | 'scroll-down-page'
    | 'scroll-up-page'
    | 'scroll-top'
    | 'scroll-bottom'
;

interface Config {
    hot_key: string;
    icon_color: 'black' | 'white';
    always_on_top: boolean;
    keymaps: {[key: string]: KeymapAction};
}
