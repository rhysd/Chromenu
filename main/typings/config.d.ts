interface Config {
    hot_key: string;
    icon_color: 'black' | 'white';
    always_on_top: boolean;
    normal_window: boolean;
    url_blacklist: string[];
    keymaps: { [key: string]: string | null };
}
