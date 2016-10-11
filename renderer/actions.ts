type ActionType = {
    type: 'CreatePage';
} | {
    type: 'ConfigurePage';
    index: number;
    url: string;
    image_url: string;
} | {
    type: 'SetConfigured';
    index: number;
    value: boolean;
} | {
    type: 'DeletePage';
    index: number;
};

export default ActionType;
