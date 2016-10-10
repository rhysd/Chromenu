import * as React from 'react';

function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    console.log('TODO: Should show "Add Page" view');
}

const AddPage = () => (
    <div className="add-icon" onClick={onClick}>
        <i className="fa fa-plus fa-5x" aria-hidden="true"></i>
    </div>
);
export default AddPage;
