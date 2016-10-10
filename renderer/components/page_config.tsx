import * as React from 'react';
import {Page} from '../states/pages';
import {Dispatch} from '../store';
import {configurePage} from '../actions/pages';

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
    }

    onSubmit(e: React.MouseEvent<HTMLInputElement>) {
        e.stopPropagation();
        console.log('TODO: Submit configuration', this.refs.url_input);
        const url = this.refs.url_input.value;
        const image_url = this.refs.image_input.value || '';
        if (!url) {
            this.refs.url_input.className = 'input is-danger';
            return;
        }
        this.props.dispatch(configurePage(this.props.index, url, image_url));
    }

    onCancel(e: React.MouseEvent<HTMLInputElement>) {
        e.stopPropagation();
        console.log('TODO: Cancel configuration', this.refs.image_input);
    }

    render() {
        return (
            <div className="page-config">
                <h1 className="title">Configuration</h1>
                <div className="page-config__input">
                    <label className="label">Page URL</label>
                    <p className="control">
                        <input className="input is-primary" type="text" placeholder="required" ref="url_input"/>
                    </p>
                </div>
                <div className="page-config__input">
                    <label className="label">Icon image URL</label>
                    <p className="control">
                        <input className="input is-primary" type="text" placeholder="optional" ref="image_input"/>
                    </p>
                </div>
                <div className="page-config__buttons">
                    <p className="control">
                        <button className="button is-primary" onClick={this.onSubmit}>OK</button>
                        <button className="button" onClick={this.onCancel}>Cancel</button>
                    </p>
                </div>
            </div>
        );
    }
}
