type ActionType = {
    type: 'CreatePage',
} | {
    type: 'ConfigurePage'
    index: number;
    url: string;
    image_url: string;
};

export default ActionType;
