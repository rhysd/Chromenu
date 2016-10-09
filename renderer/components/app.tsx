import * as React from 'react';
import {connect} from 'react-redux';
import State from '../states/root';

interface AppProps extends React.Props<any> {
}

function select(_: State): AppProps {
    return {
    };
}

export const App = (_: AppProps) => (
    <div>Hello!</div>
);

export default connect(select)(App);
