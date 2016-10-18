import * as React from 'react';
import {List} from 'immutable';
import Icon from './icon';
import AddPage from './add_page';
import {Page} from '../states';
import {Dispatch} from '../store';

interface HeaderProps extends React.Props<any> {
    pages: List<Page>;
    index: number;
    dispatch: Dispatch;
}

const Header = (props: HeaderProps) => (
    <div className="icons-header">
        {props.pages.toArray().map((p, i) =>
            <Icon
                page={p}
                isCurrent={i === props.index}
                index={i}
                dispatch={props.dispatch}
                key={i}
            />)}
        <AddPage dispatch={props.dispatch}/>
    </div>
);
export default Header;
