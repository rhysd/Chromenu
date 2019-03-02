import * as React from 'react';
import { List } from 'immutable';
import PageIcon from './page_icon';
import AddPage from './add_page';
import { Page } from '../states';
import { Dispatch } from '../store';

function cancel(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
}

interface HeaderProps extends React.Props<any> {
    readonly pages: List<Page>;
    readonly index: number | null;
    readonly dispatch: Dispatch;
}

const Header = (props: HeaderProps) => (
    <div className="icons-header" onDrop={cancel} onDragOver={cancel} onDragEnter={cancel}>
        {props.pages.toArray().map((p, i) => (
            <PageIcon page={p} isCurrent={i === props.index} index={i} dispatch={props.dispatch} key={i} />
        ))}
        <AddPage dispatch={props.dispatch} />
    </div>
);
export default Header;
