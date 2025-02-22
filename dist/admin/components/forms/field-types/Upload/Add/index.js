import React, { useCallback } from 'react';
import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '../../../../utilities/Config';
import { useAuth } from '../../../../utilities/Auth';
import MinimalTemplate from '../../../../templates/Minimal';
import Form from '../../../Form';
import Button from '../../../../elements/Button';
import RenderFields from '../../../RenderFields';
import FormSubmit from '../../../Submit';
import Upload from '../../../../views/collections/Edit/Upload';
import ViewDescription from '../../../../elements/ViewDescription';
import './index.scss';
const baseClass = 'add-upload-modal';
const AddUploadModal = (props) => {
    var _a, _b;
    const { collection, collection: { admin: { description, } = {}, } = {}, slug, fieldTypes, setValue, } = props;
    const { permissions } = useAuth();
    const { serverURL, routes: { api } } = useConfig();
    const { closeAll } = useModal();
    const onSuccess = useCallback((json) => {
        closeAll();
        setValue(json.doc);
    }, [closeAll, setValue]);
    const classes = [
        baseClass,
    ].filter(Boolean).join(' ');
    const collectionPermissions = (_b = (_a = permissions === null || permissions === void 0 ? void 0 : permissions.collections) === null || _a === void 0 ? void 0 : _a[collection.slug]) === null || _b === void 0 ? void 0 : _b.fields;
    return (React.createElement(Modal, { className: classes, slug: slug },
        React.createElement(MinimalTemplate, { width: "wide" },
            React.createElement(Form, { method: "post", action: `${serverURL}${api}/${collection.slug}`, onSuccess: onSuccess, disableSuccessStatus: true, validationOperation: "create" },
                React.createElement("header", { className: `${baseClass}__header` },
                    React.createElement("div", null,
                        React.createElement("h1", null,
                            "New",
                            ' ',
                            collection.labels.singular),
                        React.createElement(FormSubmit, null, "Save"),
                        React.createElement(Button, { icon: "x", round: true, buttonStyle: "icon-label", iconStyle: "with-border", onClick: closeAll })),
                    description && (React.createElement("div", { className: `${baseClass}__sub-header` },
                        React.createElement(ViewDescription, { description: description })))),
                React.createElement(Upload, { collection: collection }),
                React.createElement(RenderFields, { permissions: collectionPermissions, readOnly: false, fieldTypes: fieldTypes, fieldSchema: collection.fields })))));
};
export default AddUploadModal;
