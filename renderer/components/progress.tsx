import * as React from 'react';

interface ProgressProps extends React.Props<any> {
    value: number;
}

const Progress = (props: ProgressProps) => {
    return <div className="progress-container">
        <div className="progress-bar" style={{width: props.value + '%'}}/>
    </div>;
};

export default Progress;
