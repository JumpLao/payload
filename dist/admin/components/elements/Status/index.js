import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '../../utilities/Config';
import { useDocumentInfo } from '../../utilities/DocumentInfo';
import Button from '../Button';
import { MinimalTemplate } from '../..';
import { requests } from '../../../api';
import { useForm } from '../../forms/Form/context';
import { useLocale } from '../../utilities/Locale';
import './index.scss';
const baseClass = 'status';
const unPublishModalSlug = 'confirm-un-publish';
const revertModalSlug = 'confirm-revert';
const Status = () => {
    var _a, _b;
    const { publishedDoc, unpublishedVersions, collection, global, id, getVersions } = useDocumentInfo();
    const { toggle, closeAll: closeAllModals } = useModal();
    const { serverURL, routes: { api } } = useConfig();
    const [processing, setProcessing] = useState(false);
    const { reset: resetForm } = useForm();
    const locale = useLocale();
    let statusToRender;
    if (((_a = unpublishedVersions === null || unpublishedVersions === void 0 ? void 0 : unpublishedVersions.docs) === null || _a === void 0 ? void 0 : _a.length) > 0 && publishedDoc) {
        statusToRender = 'Changed';
    }
    else if (!publishedDoc) {
        statusToRender = 'Draft';
    }
    else if (publishedDoc && ((_b = unpublishedVersions === null || unpublishedVersions === void 0 ? void 0 : unpublishedVersions.docs) === null || _b === void 0 ? void 0 : _b.length) <= 1) {
        statusToRender = 'Published';
    }
    const performAction = useCallback(async (action) => {
        let url;
        let method;
        let body;
        setProcessing(true);
        if (action === 'unpublish') {
            body = {
                _status: 'draft',
            };
        }
        if (action === 'revert') {
            body = publishedDoc;
        }
        if (collection) {
            url = `${serverURL}${api}/${collection.slug}/${id}?depth=0&locale=${locale}&fallback-locale=null`;
            method = 'put';
        }
        if (global) {
            url = `${serverURL}${api}/globals/${global.slug}?depth=0&locale=${locale}&fallback-locale=null`;
            method = 'post';
        }
        const res = await requests[method](url, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            let data;
            let fields;
            const json = await res.json();
            if (global) {
                data = json.result;
                fields = global.fields;
            }
            if (collection) {
                data = json.doc;
                fields = collection.fields;
            }
            resetForm(fields, data);
            toast.success(json.message);
            getVersions();
        }
        else {
            toast.error('There was a problem while un-publishing this document.');
        }
        setProcessing(false);
        closeAllModals();
    }, [closeAllModals, collection, global, serverURL, api, resetForm, id, locale, getVersions, publishedDoc]);
    if (statusToRender) {
        return (React.createElement("div", { className: baseClass },
            React.createElement("div", { className: `${baseClass}__value-wrap` },
                React.createElement("span", { className: `${baseClass}__value` }, statusToRender),
                statusToRender === 'Published' && (React.createElement(React.Fragment, null,
                    "\u00A0\u2014\u00A0",
                    React.createElement(Button, { onClick: () => toggle(unPublishModalSlug), className: `${baseClass}__action`, buttonStyle: "none" }, "Unpublish"),
                    React.createElement(Modal, { slug: unPublishModalSlug, className: `${baseClass}__modal` },
                        React.createElement(MinimalTemplate, { className: `${baseClass}__modal-template` },
                            React.createElement("h1", null, "Confirm unpublish"),
                            React.createElement("p", null, "You are about to unpublish this document. Are you sure?"),
                            React.createElement(Button, { buttonStyle: "secondary", type: "button", onClick: processing ? undefined : () => toggle(unPublishModalSlug) }, "Cancel"),
                            React.createElement(Button, { onClick: processing ? undefined : () => performAction('unpublish') }, processing ? 'Unpublishing...' : 'Confirm'))))),
                statusToRender === 'Changed' && (React.createElement(React.Fragment, null,
                    "\u00A0\u2014\u00A0",
                    React.createElement(Button, { onClick: () => toggle(revertModalSlug), className: `${baseClass}__action`, buttonStyle: "none" }, "Revert to published"),
                    React.createElement(Modal, { slug: revertModalSlug, className: `${baseClass}__modal` },
                        React.createElement(MinimalTemplate, { className: `${baseClass}__modal-template` },
                            React.createElement("h1", null, "Confirm revert to saved"),
                            React.createElement("p", null, "You are about to revert this document's changes to its published state. Are you sure?"),
                            React.createElement(Button, { buttonStyle: "secondary", type: "button", onClick: processing ? undefined : () => toggle(revertModalSlug) }, "Cancel"),
                            React.createElement(Button, { onClick: processing ? undefined : () => performAction('revert') }, processing ? 'Reverting...' : 'Confirm'))))))));
    }
    return null;
};
export default Status;
