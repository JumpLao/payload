import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import format from 'date-fns/format';
import { useConfig } from '../../../utilities/Config';
import Eyebrow from '../../../elements/Eyebrow';
import Form from '../../../forms/Form';
import Loading from '../../../elements/Loading';
import PreviewButton from '../../../elements/PreviewButton';
import FormSubmit from '../../../forms/Submit';
import RenderFields from '../../../forms/RenderFields';
import CopyToClipboard from '../../../elements/CopyToClipboard';
import DuplicateDocument from '../../../elements/DuplicateDocument';
import DeleteDocument from '../../../elements/DeleteDocument';
import Meta from '../../../utilities/Meta';
import fieldTypes from '../../../forms/field-types';
import RenderTitle from '../../../elements/RenderTitle';
import LeaveWithoutSaving from '../../../modals/LeaveWithoutSaving';
import Auth from './Auth';
import VersionsCount from '../../../elements/VersionsCount';
import Upload from './Upload';
import Autosave from '../../../elements/Autosave';
import Status from '../../../elements/Status';
import Publish from '../../../elements/Publish';
import SaveDraft from '../../../elements/SaveDraft';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import { OperationContext } from '../../../utilities/OperationProvider';
import { Gutter } from '../../../elements/Gutter';
import './index.scss';
const baseClass = 'collection-edit';
const DefaultEditView = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const { params: { id } = {} } = useRouteMatch();
    const { admin: { dateFormat }, routes: { admin } } = useConfig();
    const { publishedDoc } = useDocumentInfo();
    const { collection, isEditing, data, onSave, permissions, isLoading, initialState, apiURL, action, hasSavePermission, } = props;
    const { slug, fields, admin: { useAsTitle, disableDuplicate, preview, hideAPIURL, }, versions, timestamps, auth, upload, } = collection;
    const classes = [
        baseClass,
        isEditing && `${baseClass}--is-editing`,
    ].filter(Boolean).join(' ');
    const operation = isEditing ? 'update' : 'create';
    return (React.createElement("div", { className: classes },
        isLoading && (React.createElement(Loading, null)),
        !isLoading && (React.createElement(OperationContext.Provider, { value: operation },
            React.createElement(Form, { className: `${baseClass}__form`, method: id ? 'put' : 'post', action: action, onSuccess: onSave, disabled: !hasSavePermission, initialState: initialState },
                React.createElement("div", { className: `${baseClass}__main` },
                    React.createElement(Meta, { title: `${isEditing ? 'Editing' : 'Creating'} - ${collection.labels.singular}`, description: `${isEditing ? 'Editing' : 'Creating'} - ${collection.labels.singular}`, keywords: `${collection.labels.singular}, Payload, CMS` }),
                    React.createElement(Eyebrow, null),
                    !(((_a = collection.versions) === null || _a === void 0 ? void 0 : _a.drafts) && ((_c = (_b = collection.versions) === null || _b === void 0 ? void 0 : _b.drafts) === null || _c === void 0 ? void 0 : _c.autosave)) && (React.createElement(LeaveWithoutSaving, null)),
                    React.createElement(Gutter, { className: `${baseClass}__edit` },
                        React.createElement("header", { className: `${baseClass}__header` },
                            React.createElement("h1", null,
                                React.createElement(RenderTitle, { ...{ data, useAsTitle, fallback: '[Untitled]' } }))),
                        auth && (React.createElement(Auth, { useAPIKey: auth.useAPIKey, requirePassword: !isEditing, verify: auth.verify, collection: collection, email: data === null || data === void 0 ? void 0 : data.email, operation: operation })),
                        upload && (React.createElement(Upload, { data: data, collection: collection })),
                        React.createElement(RenderFields, { readOnly: !hasSavePermission, permissions: permissions.fields, filter: (field) => { var _a, _b; return (!((_a = field === null || field === void 0 ? void 0 : field.admin) === null || _a === void 0 ? void 0 : _a.position) || (((_b = field === null || field === void 0 ? void 0 : field.admin) === null || _b === void 0 ? void 0 : _b.position) !== 'sidebar')); }, fieldTypes: fieldTypes, fieldSchema: fields }))),
                React.createElement("div", { className: `${baseClass}__sidebar-wrap` },
                    React.createElement("div", { className: `${baseClass}__sidebar` },
                        React.createElement("div", { className: `${baseClass}__sidebar-sticky-wrap` },
                            React.createElement("ul", { className: `${baseClass}__collection-actions` },
                                ((_d = permissions === null || permissions === void 0 ? void 0 : permissions.create) === null || _d === void 0 ? void 0 : _d.permission) && (React.createElement(React.Fragment, null,
                                    React.createElement("li", null,
                                        React.createElement(Link, { id: "action-create", to: `${admin}/collections/${slug}/create` }, "Create New")),
                                    !disableDuplicate && (React.createElement("li", null,
                                        React.createElement(DuplicateDocument, { slug: slug }))))),
                                ((_e = permissions === null || permissions === void 0 ? void 0 : permissions.delete) === null || _e === void 0 ? void 0 : _e.permission) && (React.createElement("li", null,
                                    React.createElement(DeleteDocument, { collection: collection, id: id, buttonId: "action-delete" })))),
                            React.createElement("div", { className: `${baseClass}__document-actions${((((_f = collection.versions) === null || _f === void 0 ? void 0 : _f.drafts) && !((_h = (_g = collection.versions) === null || _g === void 0 ? void 0 : _g.drafts) === null || _h === void 0 ? void 0 : _h.autosave)) || (isEditing && preview)) ? ` ${baseClass}__document-actions--has-2` : ''}` },
                                (preview && (!((_j = collection.versions) === null || _j === void 0 ? void 0 : _j.drafts) || ((_l = (_k = collection.versions) === null || _k === void 0 ? void 0 : _k.drafts) === null || _l === void 0 ? void 0 : _l.autosave))) && (React.createElement(PreviewButton, { generatePreviewURL: preview, data: data })),
                                hasSavePermission && (React.createElement(React.Fragment, null,
                                    ((_m = collection.versions) === null || _m === void 0 ? void 0 : _m.drafts) && (React.createElement(React.Fragment, null,
                                        !collection.versions.drafts.autosave && (React.createElement(SaveDraft, null)),
                                        React.createElement(Publish, null))),
                                    !((_o = collection.versions) === null || _o === void 0 ? void 0 : _o.drafts) && (React.createElement(FormSubmit, { buttonId: "action-save" }, "Save"))))),
                            React.createElement("div", { className: `${baseClass}__sidebar-fields` },
                                (isEditing && preview && (((_p = collection.versions) === null || _p === void 0 ? void 0 : _p.drafts) && !((_r = (_q = collection.versions) === null || _q === void 0 ? void 0 : _q.drafts) === null || _r === void 0 ? void 0 : _r.autosave))) && (React.createElement(PreviewButton, { generatePreviewURL: preview, data: data })),
                                ((_s = collection.versions) === null || _s === void 0 ? void 0 : _s.drafts) && (React.createElement(React.Fragment, null,
                                    React.createElement(Status, null),
                                    (((_t = collection.versions) === null || _t === void 0 ? void 0 : _t.drafts.autosave) && hasSavePermission) && (React.createElement(Autosave, { publishedDocUpdatedAt: (publishedDoc === null || publishedDoc === void 0 ? void 0 : publishedDoc.updatedAt) || (data === null || data === void 0 ? void 0 : data.createdAt), collection: collection, id: id })))),
                                React.createElement(RenderFields, { readOnly: !hasSavePermission, permissions: permissions.fields, filter: (field) => { var _a; return ((_a = field === null || field === void 0 ? void 0 : field.admin) === null || _a === void 0 ? void 0 : _a.position) === 'sidebar'; }, fieldTypes: fieldTypes, fieldSchema: fields })),
                            isEditing && (React.createElement("ul", { className: `${baseClass}__meta` },
                                !hideAPIURL && (React.createElement("li", { className: `${baseClass}__api-url` },
                                    React.createElement("span", { className: `${baseClass}__label` },
                                        "API URL",
                                        ' ',
                                        React.createElement(CopyToClipboard, { value: apiURL })),
                                    React.createElement("a", { href: apiURL, target: "_blank", rel: "noopener noreferrer" }, apiURL))),
                                versions && (React.createElement("li", null,
                                    React.createElement("div", { className: `${baseClass}__label` }, "Versions"),
                                    React.createElement(VersionsCount, { collection: collection, id: id }))),
                                timestamps && (React.createElement(React.Fragment, null,
                                    data.updatedAt && (React.createElement("li", null,
                                        React.createElement("div", { className: `${baseClass}__label` }, "Last Modified"),
                                        React.createElement("div", null, format(new Date(data.updatedAt), dateFormat)))),
                                    ((publishedDoc === null || publishedDoc === void 0 ? void 0 : publishedDoc.createdAt) || (data === null || data === void 0 ? void 0 : data.createdAt)) && (React.createElement("li", null,
                                        React.createElement("div", { className: `${baseClass}__label` }, "Created"),
                                        React.createElement("div", null, format(new Date((publishedDoc === null || publishedDoc === void 0 ? void 0 : publishedDoc.createdAt) || (data === null || data === void 0 ? void 0 : data.createdAt)), dateFormat))))))))))))))));
};
export default DefaultEditView;
