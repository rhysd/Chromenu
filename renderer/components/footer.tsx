import * as React from 'react';
import {ArrowLeft, ArrowRight, Home, Reload, Close, External} from 'react-bytesize-icons';
import ControlButton from './control_button';
import {Dispatch} from '../store';

interface FooterProps extends React.Props<Footer> {
    dispatch: Dispatch;
    canGoBack: boolean;
    canGoForward: boolean;
    loading: boolean;
    pageUrl: string | null;
}

export default class Footer extends React.PureComponent<FooterProps, {}> {
    constructor(props: FooterProps) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.openInExternalBrowser = this.openInExternalBrowser.bind(this);
        this.resetPage = this.resetPage.bind(this);
    }

    goBack(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO');
    }

    goForward(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO');
    }

    resetPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO');
    }

    stopLoading(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO');
    }

    reloadPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO');
    }

    openInExternalBrowser(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        console.log('TODO');
    }

    render() {
        const reload_icon = this.props.loading ? Close : Reload;
        const reload_handler = this.props.loading ? this.stopLoading : this.reloadPage;
        const page_open = this.props.pageUrl !== null;
        return (
            <div className="controls-footer">
                <ControlButton icon={ArrowLeft} onClick={this.goBack} enabled={this.props.canGoBack}/>
                <ControlButton icon={ArrowRight} onClick={this.goForward} enabled={this.props.canGoForward}/>
                <ControlButton icon={Home} onClick={this.resetPage} enabled={page_open}/>
                <ControlButton icon={reload_icon} onClick={reload_handler} enabled={page_open}/>
                <ControlButton icon={External} onClick={this.openInExternalBrowser} enabled={page_open}/>
            </div>
        );
    }
}
