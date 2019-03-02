import * as React from 'react';
import {Page} from '../states';
import {Dispatch} from '../store';
import log from '../log';
import * as tryTo from '../try_to';
import ActionType from '../actions';

interface PageConfigProps extends React.Props<PageConfig> {
    readonly dispatch: Dispatch;
    readonly page: Page;
    readonly index: number;
}

export default class PageConfig extends React.PureComponent<PageConfigProps, {}> {
    url_input: HTMLInputElement;
    image_input: HTMLInputElement;
    title_input: HTMLInputElement;
    reload_on_show_checkbox: HTMLInputElement;
    reload_min_interval_input: HTMLInputElement;

    onUrlInputRef = (ref: HTMLInputElement) => {
        this.url_input = ref;
    }

    onImageInputRef = (ref: HTMLInputElement) => {
        this.image_input = ref;
    }

    onTitleInputRef = (ref: HTMLInputElement) => {
        this.title_input = ref;
    }

    onReloadOnShowCheckboxRef = (ref: HTMLInputElement) => {
        this.reload_on_show_checkbox = ref;
    }

    onReloadMinIntervalRef = (ref: HTMLInputElement) => {
        this.reload_min_interval_input = ref;
    }

    onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const url = this.url_input.value;
        const reload_on_show = this.reload_on_show_checkbox.checked;

        if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
            this.url_input.className = 'input is-danger';
            log.debug('Invalid URL input:', url);
            return;
        }

        let reload_min_interval = null as number | null;
        if (this.reload_min_interval_input.value !== '') {
            const v = parseInt(this.reload_min_interval_input.value, 10);
            if (!isNaN(v) && v > 0) {
                reload_min_interval = v;
            }
        }

        Promise.all([
            this.getTitle(url),
            this.getIconUrl(url),
        ]).then(([title, image_url]) => {
            const action = {
                type: 'ConfigurePage',
                index: this.props.index,
                url,
                image_url,
                title,
                reload_on_show,
                reload_min_interval,
            } as ActionType;
            log.debug('Configure page:', action);
            this.props.dispatch(action);
        });
    }

    onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const {page, dispatch, index} = this.props;
        if (page.url === '') {
            log.debug('Delete this page because configuration for this page has not been done yet');
            dispatch({
                type: 'DeletePage',
                index,
            });
        } else {
            log.debug('Finish configuration and show a page:', page.url);
            dispatch({
                type: 'SetConfigured',
                index,
                value: true,
            });
        }
    }

    onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        log.debug('Delete this page:', this.url_input.value);
        const {dispatch, index} = this.props;
        dispatch({
            type: 'DeletePage',
            index,
        });
    }

    getTitle(url: string): Promise<string> {
        const title = this.title_input.value || '';
        if (title) {
            return Promise.resolve(title);
        }
        return tryTo.findTitle(url).catch(() => '');
    }

    getIconUrl(url: string): Promise<string> {
        const image_url = this.image_input.value || '';
        if (image_url) {
            return Promise.resolve(image_url);
        }
        return tryTo.findIconUrl(url).then(i => i !== null ? i : '');
    }

    componentDidMount() {
        const {page} = this.props;
        if (page.url) {
            this.url_input.value = page.url;
        }
        if (page.icon_image) {
            this.image_input.value = page.icon_image;
        }
        if (page.title) {
            this.title_input.value = page.title;
        }
        if (page.reload_on_show) {
            this.reload_on_show_checkbox.checked = true;
        }
        if (typeof page.reload_min_interval === 'number') {
            this.reload_min_interval_input.value = page.reload_min_interval.toString();
        }
    }

    render() {
        return (
            <div className="page-config">
                <h1 className="title">Configuration</h1>
                <div className="page-config__input">
                    <label className="label">Page URL</label>
                    <p className="control">
                        <input
                            className="input is-primary"
                            type="text"
                            placeholder="URL must starts with 'https://' or 'http://' (Required)"
                            autoComplete="off"
                            autoFocus={true}
                            ref={this.onUrlInputRef}
                        />
                    </p>
                </div>
                <div className="page-config__input">
                    <label className="label">Icon Image URL</label>
                    <p className="control">
                        <input
                            className="input is-primary"
                            type="text"
                            placeholder="URL to image file for this page (Optional)"
                            ref={this.onImageInputRef}
                        />
                    </p>
                </div>
                <div className="page-config__input">
                    <label className="label">Page Title</label>
                    <p className="control">
                        <input
                            className="input is-primary"
                            type="text"
                            placeholder="Title for this page (Optional)"
                            ref={this.onTitleInputRef}
                        />
                    </p>
                </div>
                <div className="page-config__interval-config">
                    <input className="page-config__reload-config" type="checkbox" ref={this.onReloadOnShowCheckboxRef}/>
                    Reload on show (Minimal interval: <input
                        className="page-config__min-interval-input"
                        type="text"
                        placeholder="sec"
                        ref={this.onReloadMinIntervalRef}
                    />)
                </div>
                <div className="page-config__buttons">
                    <p className="control">
                        <button className="button is-primary" onClick={this.onSubmit}>OK</button>
                        <button className="button" onClick={this.onCancel}>Cancel</button>
                        <button className="button is-danger" onClick={this.onDelete}>Delete</button>
                    </p>
                </div>
            </div>
        );
    }
}
