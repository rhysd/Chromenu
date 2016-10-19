import * as React from 'react';

interface ProgressProps extends React.Props<any> {
    loading: boolean;
    value: number;
}

const Progress = (props: ProgressProps) => {
    if (!props.loading) {
        return null;
    }
    return <div className="progress-container">
        <div className="progress-bar" style={{width: props.value + '%'}}/>
    </div>;
};

export default Progress;
