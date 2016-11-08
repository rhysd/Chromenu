import * as React from 'react';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';
import {Page} from '../states';
import {Dispatch} from '../store';
import log from '../log';
import * as tryTo from '../try_to';

interface PageConfigProps extends React.Props<PageConfig> {
    dispatch: Dispatch;
    page: Page;
    index: number;
}

export default class PageConfig extends React.PureComponent<PageConfigProps, {}> {
    url_input: HTMLInputElement;
    image_input: HTMLInputElement;
    title_input: HTMLInputElement;

    onUrlInputRef = (ref: HTMLInputElement) => {
        this.url_input = ref;
    }

    onImageInputRef = (ref: HTMLInputElement) => {
        this.image_input = ref;
    }

    onTitleInputRef = (ref: HTMLInputElement) => {
        this.title_input = ref;
    }

    onSubmit = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const url = this.url_input.value;

        if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
            this.url_input.className = 'input is-danger';
            log.debug('Invalid URL input:', url);
            return;
        }

        Promise.all([
            this.getTitle(url),
            this.getIconUrl(url),
        ]).then(([title, image_url]) => {
            log.debug('Configure page: url:', url, 'image url:', image_url, 'title:', title);
            this.props.dispatch({
                type: 'ConfigurePage',
                index: this.props.index,
                url,
                image_url,
                title,
            });
        });
    }

    onCancel = (e: React.MouseEvent<HTMLInputElement>) => {
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

    onDelete = (e: React.MouseEvent<HTMLInputElement>) => {
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
    }

    render() {
        return (
            <CSSTransitionGroup
                transitionName="config-anim"
                transitionAppear={true}
                transitionAppearTimeout={300}
                transitionLeave={true}
                transitionLeaveTimeout={300}
            >
                <div className="page-config">
                    <h1 className="title">Configuration</h1>
                    <div className="page-config__input">
                        <label className="label">Page URL</label>
                        <p className="control">
                            <input
                                className="input is-primary"
                                type="text"
                                placeholder="required"
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
                                placeholder="optional"
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
                                placeholder="optional"
                                ref={this.onTitleInputRef}
                            />
                        </p>
                    </div>
                    <div className="page-config__buttons">
                        <p className="control">
                            <button className="button is-primary" onClick={this.onSubmit}>OK</button>
                            <button className="button" onClick={this.onCancel}>Cancel</button>
                            <button className="button is-danger" onClick={this.onDelete}>Delete</button>
                        </p>
                    </div>
                </div>
            </CSSTransitionGroup>
        );
    }
}
