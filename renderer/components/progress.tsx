import * as React from 'react';

interface ProgressProps extends React.Props<any> {
    readonly value: number;
}

const GOOGLE_COLORS = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];

const Progress = (props: ProgressProps) => {
    const style = {
        width: props.value + '%',
        backgroundColor: GOOGLE_COLORS[(Math.random() * 4) | 0],
    };
    return (
        <div className="progress-container">
            <div className="progress-bar" style={style} />
        </div>
    );
};

export default Progress;
