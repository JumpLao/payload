import { useCallback, useEffect, useState, } from 'react';
import { useAuth } from '../../utilities/Auth';
import { useFormProcessing, useFormSubmitted, useFormModified, useForm } from '../Form/context';
import useDebounce from '../../../hooks/useDebounce';
import { useDocumentInfo } from '../../utilities/DocumentInfo';
import { useOperation } from '../../utilities/OperationProvider';
const useField = (options) => {
    const { path, validate, enableDebouncedValue, disableFormData, condition, } = options;
    const formContext = useForm();
    const submitted = useFormSubmitted();
    const processing = useFormProcessing();
    const modified = useFormModified();
    const { user } = useAuth();
    const { id } = useDocumentInfo();
    const operation = useOperation();
    const { dispatchFields, getField, getData, getSiblingData, setModified, } = formContext || {};
    // Get field by path
    const field = getField(path);
    const initialValue = field === null || field === void 0 ? void 0 : field.initialValue;
    const [internalInitialValue, setInternalInitialValue] = useState(() => field === null || field === void 0 ? void 0 : field.initialValue);
    const [internalValue, setInternalValue] = useState(() => field === null || field === void 0 ? void 0 : field.value);
    const [internallyValid, setInternallyValid] = useState(undefined);
    // Debounce internal values to update form state only every 60ms
    const debouncedValue = useDebounce(internalValue, 120);
    // Validation is defined by two ways -
    // 1. by field state
    // 2. maintained locally to reflect instant validation state changes
    let valid = true;
    if (field && typeof field.valid === 'boolean') {
        valid = field.valid;
    }
    if (typeof internallyValid === 'boolean') {
        valid = internallyValid;
    }
    const showError = valid === false && submitted;
    // Method to send update field values from field component(s)
    // Should only be used internally
    const sendField = useCallback(async (valueToSend) => {
        const fieldToDispatch = {
            path,
            disableFormData,
            initialValue,
            validate,
            condition,
            value: valueToSend,
            valid: false,
            errorMessage: undefined,
        };
        const validateOptions = {
            id,
            user,
            data: getData(),
            siblingData: getSiblingData(path),
            operation,
        };
        const validationResult = typeof validate === 'function' ? await validate(valueToSend, validateOptions) : true;
        if (typeof validationResult === 'string') {
            fieldToDispatch.errorMessage = validationResult;
            fieldToDispatch.valid = false;
            setInternallyValid(false);
        }
        else {
            fieldToDispatch.valid = validationResult;
            fieldToDispatch.errorMessage = undefined;
            setInternallyValid(true);
        }
        if (typeof dispatchFields === 'function') {
            dispatchFields(fieldToDispatch);
        }
    }, [
        condition,
        disableFormData,
        dispatchFields,
        getData,
        getSiblingData,
        id,
        initialValue,
        operation,
        path,
        user,
        validate,
    ]);
    // Method to return from `useField`, used to
    // update internal field values from field component(s)
    // as fast as they arrive. NOTE - this method is NOT debounced
    const setValue = useCallback((e, disableModifyingForm = false) => {
        const val = (e && e.target) ? e.target.value : e;
        if (!modified && !disableModifyingForm) {
            if (typeof setModified === 'function') {
                setModified(true);
            }
        }
        setInternalValue(val);
    }, [
        setModified,
        modified,
    ]);
    useEffect(() => {
        if (internalInitialValue !== initialValue) {
            setInternalValue(initialValue);
            setInternalInitialValue(initialValue);
        }
        setInternallyValid(undefined);
    }, [initialValue, internalInitialValue]);
    // The only time that the FORM value should be updated
    // is when the debounced value updates. So, when the debounced value updates,
    // send it up to the form
    const valueToSend = enableDebouncedValue ? debouncedValue : internalValue;
    useEffect(() => {
        if (((field === null || field === void 0 ? void 0 : field.value) !== valueToSend && valueToSend !== undefined) || disableFormData !== (field === null || field === void 0 ? void 0 : field.disableFormData)) {
            sendField(valueToSend);
        }
    }, [
        path,
        valueToSend,
        sendField,
        field,
        disableFormData,
    ]);
    return {
        ...options,
        showError,
        errorMessage: field === null || field === void 0 ? void 0 : field.errorMessage,
        value: internalValue,
        formSubmitted: submitted,
        formProcessing: processing,
        setValue,
        initialValue,
    };
};
export default useField;
