import * as React from 'react';
import {connect} from 'react-redux';
import Header from './header';
// import Landing from './landing';
import WebView from './webview';
import State from '../states/root';

type AppProps = State & React.Props<any>;

function renderMain(props: AppProps): React.ReactElement<any> {
    if (props.pages.index === null || props.pages.all.size === 0) {
        return <WebView src="https://devdocs.io"/>;
        // return <Landing/>;
    }
    const current = props.pages.all.get(props.pages.index);
    return <WebView src={current.url}/>;
}

export const App = (props: AppProps) => (
    <div className="app-root">
        <Header pages={props.pages.all}/>
        {renderMain(props)}
    </div>
);

function select(s: State): AppProps {
    return s;
}

export default connect(select)(App);
