import * as React from 'react';
import {connect} from 'react-redux';
import Header from './header';
import State from '../states/root';

interface T extends React.Props<any> {
}
type AppProps = T & State;

export const App = (props: AppProps) => (
    <div className="app-root">
        <Header pages={props.pages.all}/>
    </div>
);

function select(s: State): AppProps {
    return s;
}

export default connect(select)(App);
