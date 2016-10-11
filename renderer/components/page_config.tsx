import * as React from 'react';
import {Page} from '../states/pages';
import {Dispatch} from '../store';
import log from '../log';

interface PageConfigProps extends React.Props<PageConfig> {
    dispatch: Dispatch;
    page: Page;
    index: number;
}

export default class PageConfig extends React.Component<PageConfigProps, {}> {
    refs: {
        url_input: HTMLInputElement;
        image_input: HTMLInputElement;
    };

    constructor(props: PageConfigProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onSubmit(e: React.MouseEvent<HTMLInputElement>) {
        e.stopPropagation();
        const url = this.refs.url_input.value;
        const image_url = this.refs.image_input.value || '';
        if (!url) {
            this.refs.url_input.className = 'input is-danger';
            log.debug('Invalid URL input:', url);
            return;
        }
        log.debug('Configure page: url:', url, 'image url:', image_url);
        this.props.dispatch({
            type: 'ConfigurePage',
            index: this.props.index,
            url,
            image_url,
        });
    }

    onCancel(e: React.MouseEvent<HTMLInputElement>) {
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

    onDelete(e: React.MouseEvent<HTMLInputElement>) {
        e.stopPropagation();
        log.debug('Delete this page:', this.refs.url_input.value);
        const {dispatch, index} = this.props;
        dispatch({
            type: 'DeletePage',
            index,
        });
    }

    componentDidMount() {
        const {page} = this.props;
        if (page.url) {
            this.refs.url_input.value = page.url;
        }
        if (page.icon_image) {
            this.refs.image_input.value = page.icon_image;
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
                            placeholder="required"
                            ref="url_input"
                        />
                    </p>
                </div>
                <div className="page-config__input">
                    <label className="label">Icon image URL</label>
                    <p className="control">
                        <input
                            className="input is-primary"
                            type="text"
                            placeholder="optional"
                            ref="image_input"
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
        );
    }
}
