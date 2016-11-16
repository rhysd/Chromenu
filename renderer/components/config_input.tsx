import * as React from 'react';

export type FormType = 'primary' | 'danger';

interface Props extends React.Props<ConfigInput> {
    label: string;
    placeholder: string;
    type?: FormType;
    errorMessage?: string;
    onRef: (r: HTMLInputElement) => void;
}

export default class ConfigInput extends React.PureComponent<Props, {}> {
    render() {
        const type = this.props.type || 'primary';
        const success = !this.props.errorMessage || type === 'primary';
        const style = {
            marginBottom: success ? '8px' : undefined,
        };
        return (
            <div className="config-input">
                <label className="label">{this.props.label}</label>
                <p className="control">
                    <input
                        className={'input is-' + type}
                        type="text"
                        placeholder={this.props.placeholder}
                        autoComplete="off"
                        autoFocus
                        style={style}
                        ref={this.props.onRef}
                    />
                </p>
            </div>
        );
        // TODO: Add error message label with icon in <input>
    }
}
