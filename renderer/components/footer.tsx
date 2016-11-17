import * as React from 'react';
import {ArrowLeft, ArrowRight, Home, Reload, Close, VerticalEllipsis} from 'react-bytesize-icons';
import {InPageSearch} from 'electron-in-page-search';
import ControlButton from './control_button';
import MoreControl from './more_control';
import {Dispatch} from '../store';

function cancel(e: React.DragEvent<any>) {
    e.preventDefault();
}

interface FooterProps extends React.Props<Footer> {
    dispatch: Dispatch;
    loading: boolean;
    pageUrl: string | null;
    element: Electron.WebViewElement | null;
    search: InPageSearch | null;
}

interface FooterState {
    more: boolean;
}

export default class Footer extends React.PureComponent<FooterProps, FooterState> {
    constructor(props: FooterProps) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.goForward = this.goForward.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.toggleMoreItems = this.toggleMoreItems.bind(this);
        this.resetPage = this.resetPage.bind(this);
        this.state = {
            more: false,
        };
    }

    goBack(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null) {
            return;
        }
        this.props.element.goBack();
    }

    goForward(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null) {
            return;
        }
        this.props.element.goForward();
    }

    resetPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (this.props.element === null || this.props.pageUrl === null) {
            return;
        }
        this.props.element.src = this.props.pageUrl;
    }

    stopLoading(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            element.stop();
        }
    }

    reloadPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        const element = this.props.element;
        if (element) {
            element.reload();
        }
    }

    toggleMoreItems(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        this.setState({
            more: !this.state.more,
        });
    }

    render() {
        const {loading, pageUrl, element, search} = this.props;
        const reload_icon = loading ? Close : Reload;
        const reload_handler = loading ? this.stopLoading : this.reloadPage;
        const reload_tip = loading ? 'Stop' : 'Reload';
        const page_open = pageUrl !== null;
        const more_open = this.state.more && element !== null && search !== null;
        return (
            <div className="controls-footer" onDrop={cancel} onDragEnter={cancel} onDragOver={cancel}>
                <ControlButton icon={ArrowLeft} onClick={this.goBack} enabled={element !== null && element.canGoBack()} tip="Back"/>
                <ControlButton icon={ArrowRight} onClick={this.goForward} enabled={element !== null && element.canGoForward()} tip="Forward"/>
                <ControlButton icon={Home} onClick={this.resetPage} enabled={page_open} tip="Home"/>
                <ControlButton icon={reload_icon} onClick={reload_handler} enabled={page_open} tip={reload_tip}/>
                <ControlButton icon={VerticalEllipsis} onClick={this.toggleMoreItems} enabled={page_open} tip="More..."/>
                <MoreControl opened={more_open} element={element} search={search} onClick={this.toggleMoreItems}/>
            </div>
        );
    }
}
