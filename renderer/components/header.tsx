import * as React from 'react';
import {List} from 'immutable';
import Icon from './icon';
import AddPage from './add_page';
import {Page} from '../states/pages';

interface HeaderProps extends React.Props<any> {
    pages: List<Page>;
}

const Header = (props: HeaderProps) => (
    <div className="icons-header">
        {props.pages.toArray().map((p, i) => <Icon page={p} key={i}/>)}
        <AddPage/>
    </div>
);
export default Header;
