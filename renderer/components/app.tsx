import * as React from 'react';
import {connect} from 'react-redux';
import Header from './header';
import Footer from './footer';
import Landing from './landing';
import WebView from './webview';
import PageConfig from './page_config';
import Progress from './progress';
import State, {PagesState} from '../states';
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

function renderProgress(props: AppProps) {
    if (!props.webview.loading) {
        return null;
    }
    return <Progress value={props.webview.progress}/>;
}

function getCurrentPageUrl(state: PagesState): string | null {
    if (state.index === null) {
        return null;
    }
    const current = state.all.get(state.index);
    if (!current || !current.configured) {
        return null;
    }
    return current.url || null;
}

export const App = (props: AppProps) => (
    <div className="app-root">
        <Header pages={props.pages.all} index={props.pages.index} dispatch={props.dispatch!}/>
        {renderProgress(props)}
        {renderMain(props)}
        <Footer
            loading={props.webview.loading}
            pageUrl={getCurrentPageUrl(props.pages)}
            element={props.webview.element}
            search={props.webview.search}
            dispatch={props.dispatch!}
        />
    </div>
);

function select(s: State): AppProps {
    return s;
}

export default connect(select)(App);
