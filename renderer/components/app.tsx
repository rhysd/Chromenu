import * as React from 'react';
import {connect} from 'react-redux';
import Header from './header';
import Landing from './landing';
import WebView from './webview';
import PageConfig from './page_config';
import Progress from './progress';
import State from '../states';
import {Dispatch} from '../store';

type AppProps = State & React.Props<any> & {
    dispatch?: Dispatch;
};

function renderMain(props: AppProps): React.ReactElement<any> {
    if (props.pages.index === null || props.pages.all.size === 0) {
        return <Landing/>;
    }

    const current = props.pages.all.get(props.pages.index);

    if (!current.configured || !current.url) {
        return <PageConfig page={current} index={props.pages.index} dispatch={props.dispatch!}/>;
    }

    return <WebView src={current.url} dispatch={props.dispatch!}/>;
}

export const App = (props: AppProps) => (
    <div className="app-root">
        <Header pages={props.pages.all} index={props.pages.index} dispatch={props.dispatch!}/>
        {renderMain(props)}
        <Progress loading={props.webview.loading} value={props.webview.progress}/>
    </div>
);

function select(s: State): AppProps {
    return s;
}

export default connect(select)(App);
