import React, { useCallback } from 'react';
import withCondition from '../../withCondition';
import useField from '../../useField';
import Label from '../../Label';
import Error from '../../Error';
import FieldDescription from '../../FieldDescription';
import { email } from '../../../../../fields/validations';
import './index.scss';
const Email = (props) => {
    const { name, path: pathFromProps, required, validate = email, admin: { readOnly, style, className, width, placeholder, autoComplete, description, condition, } = {}, label, } = props;
    const path = pathFromProps || name;
    const memoizedValidate = useCallback((value, options) => {
        return validate(value, { ...options, required });
    }, [validate, required]);
    const fieldType = useField({
        path,
        validate: memoizedValidate,
        enableDebouncedValue: true,
        condition,
    });
    const { value, showError, setValue, errorMessage, } = fieldType;
    const classes = [
        'field-type',
        'email',
        className,
        showError && 'error',
        readOnly && 'read-only',
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes, style: {
            ...style,
            width,
        } },
        React.createElement(Error, { showError: showError, message: errorMessage }),
        React.createElement(Label, { htmlFor: `field-${path.replace(/\./gi, '__')}`, label: label, required: required }),
        React.createElement("input", { id: `field-${path.replace(/\./gi, '__')}`, value: value || '', onChange: setValue, disabled: Boolean(readOnly), placeholder: placeholder, type: "email", name: path, autoComplete: autoComplete }),
        React.createElement(FieldDescription, { value: value, description: description })));
};
export default withCondition(Email);
