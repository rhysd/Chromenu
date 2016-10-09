import * as React from 'react';
import {connect} from 'react-redux';
import Header from './header';
import Landing from './landing';
import State from '../states/root';

interface T extends React.Props<any> {
}
type AppProps = T & State;

function renderMain(props: AppProps): React.ReactElement<any> {
    if (props.pages.all.size === 0) {
        return <Landing/>;
    }
    return undefined;
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
