import * as React from 'react';
import {List} from 'immutable';
import {Page} from '../states/pages';

interface HeaderProps extends React.Props<any> {
    pages: List<Page>;
}

const Header = (props: HeaderProps) => (
    <div className="icons-header">
        {props.pages.toArray().map(_ => <div/>)}
    </div>
);
export default Header;
