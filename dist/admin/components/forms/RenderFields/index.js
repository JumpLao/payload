import React, { useEffect, useState } from 'react';
import RenderCustomComponent from '../../utilities/RenderCustomComponent';
import useIntersect from '../../../hooks/useIntersect';
import { fieldAffectsData, fieldIsPresentationalOnly } from '../../../../fields/config/types';
import { useOperation } from '../../utilities/OperationProvider';
const baseClass = 'render-fields';
const intersectionObserverOptions = {
    rootMargin: '1000px',
};
const RenderFields = (props) => {
    var _a;
    const { fieldSchema, fieldTypes, filter, permissions, readOnly: readOnlyOverride, className, forceRender, } = props;
    const [hasRendered, setHasRendered] = useState(false);
    const [intersectionRef, entry] = useIntersect(intersectionObserverOptions);
    const operation = useOperation();
    const isIntersecting = Boolean(entry === null || entry === void 0 ? void 0 : entry.isIntersecting);
    const isAboveViewport = ((_a = entry === null || entry === void 0 ? void 0 : entry.boundingClientRect) === null || _a === void 0 ? void 0 : _a.top) < 0;
    const shouldRender = forceRender || isIntersecting || isAboveViewport;
    useEffect(() => {
        if (shouldRender && !hasRendered) {
            setHasRendered(true);
        }
    }, [shouldRender, hasRendered]);
    const classes = [
        baseClass,
        className,
    ].filter(Boolean).join(' ');
    if (fieldSchema) {
        return (React.createElement("div", { ref: intersectionRef, className: classes }, hasRendered && (fieldSchema.map((field, i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const fieldIsPresentational = fieldIsPresentationalOnly(field);
            let FieldComponent = fieldTypes[field.type];
            if (fieldIsPresentational || (!(field === null || field === void 0 ? void 0 : field.hidden) && ((_a = field === null || field === void 0 ? void 0 : field.admin) === null || _a === void 0 ? void 0 : _a.disabled) !== true)) {
                if ((filter && typeof filter === 'function' && filter(field)) || !filter) {
                    if (fieldIsPresentational) {
                        return (React.createElement(FieldComponent, { ...field, key: i }));
                    }
                    if ((_b = field === null || field === void 0 ? void 0 : field.admin) === null || _b === void 0 ? void 0 : _b.hidden) {
                        FieldComponent = fieldTypes.hidden;
                    }
                    const isFieldAffectingData = fieldAffectsData(field);
                    const fieldPermissions = isFieldAffectingData ? permissions === null || permissions === void 0 ? void 0 : permissions[field.name] : permissions;
                    let { admin: { readOnly } = {} } = field;
                    if (readOnlyOverride && readOnly !== false)
                        readOnly = true;
                    if ((isFieldAffectingData && ((_d = (_c = permissions === null || permissions === void 0 ? void 0 : permissions[field === null || field === void 0 ? void 0 : field.name]) === null || _c === void 0 ? void 0 : _c.read) === null || _d === void 0 ? void 0 : _d.permission) !== false) || !isFieldAffectingData) {
                        if (isFieldAffectingData && ((_f = (_e = permissions === null || permissions === void 0 ? void 0 : permissions[field === null || field === void 0 ? void 0 : field.name]) === null || _e === void 0 ? void 0 : _e[operation]) === null || _f === void 0 ? void 0 : _f.permission) === false) {
                            readOnly = true;
                        }
                        if (FieldComponent) {
                            return (React.createElement(RenderCustomComponent, { key: i, CustomComponent: (_h = (_g = field === null || field === void 0 ? void 0 : field.admin) === null || _g === void 0 ? void 0 : _g.components) === null || _h === void 0 ? void 0 : _h.Field, DefaultComponent: FieldComponent, componentProps: {
                                    ...field,
                                    path: field.path || (isFieldAffectingData ? field.name : undefined),
                                    fieldTypes,
                                    admin: {
                                        ...(field.admin || {}),
                                        readOnly,
                                    },
                                    permissions: fieldPermissions,
                                } }));
                        }
                        return (React.createElement("div", { className: "missing-field", key: i },
                            "No matched field found for",
                            ' ',
                            "\"",
                            field.label,
                            "\""));
                    }
                }
                return null;
            }
            return null;
        }))));
    }
    return null;
};
export default RenderFields;
