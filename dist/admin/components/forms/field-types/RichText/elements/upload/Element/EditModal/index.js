import React, { useCallback, useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Modal } from '@faceless-ui/modal';
import { useAuth } from '../../../../../../../utilities/Auth';
import buildStateFromSchema from '../../../../../../Form/buildStateFromSchema';
import MinimalTemplate from '../../../../../../../templates/Minimal';
import Button from '../../../../../../../elements/Button';
import RenderFields from '../../../../../../RenderFields';
import fieldTypes from '../../../../..';
import Form from '../../../../../../Form';
import reduceFieldsToValues from '../../../../../../Form/reduceFieldsToValues';
import Submit from '../../../../../../Submit';
import { useLocale } from '../../../../../../../utilities/Locale';
import './index.scss';
const baseClass = 'edit-upload-modal';
export const EditModal = ({ slug, closeModal, relatedCollectionConfig, fieldSchema, element }) => {
    const editor = useSlateStatic();
    const [initialState, setInitialState] = useState({});
    const { user } = useAuth();
    const locale = useLocale();
    const handleUpdateEditData = useCallback((fields) => {
        const newNode = {
            fields: reduceFieldsToValues(fields, true),
        };
        const elementPath = ReactEditor.findPath(editor, element);
        Transforms.setNodes(editor, newNode, { at: elementPath });
        closeModal();
    }, [closeModal, editor, element]);
    useEffect(() => {
        const awaitInitialState = async () => {
            const state = await buildStateFromSchema({ fieldSchema, data: { ...(element === null || element === void 0 ? void 0 : element.fields) || {} }, user, operation: 'update', locale });
            setInitialState(state);
        };
        awaitInitialState();
    }, [fieldSchema, element.fields, user, locale]);
    return (React.createElement(Modal, { slug: slug, className: baseClass },
        React.createElement(MinimalTemplate, { width: "wide" },
            React.createElement("header", { className: `${baseClass}__header` },
                React.createElement("h1", null,
                    "Edit",
                    ' ',
                    relatedCollectionConfig.labels.singular,
                    ' ',
                    "data"),
                React.createElement(Button, { icon: "x", round: true, buttonStyle: "icon-label", onClick: closeModal })),
            React.createElement("div", null,
                React.createElement(Form, { onSubmit: handleUpdateEditData, initialState: initialState },
                    React.createElement(RenderFields, { readOnly: false, fieldTypes: fieldTypes, fieldSchema: fieldSchema }),
                    React.createElement(Submit, null, "Save changes"))))));
};
