import React, { Fragment, useEffect, useState } from 'react';
import { Modal, useModal } from '@faceless-ui/modal';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { useConfig } from '../../../../../../utilities/Config';
import ElementButton from '../../Button';
import UploadIcon from '../../../../../../icons/Upload';
import usePayloadAPI from '../../../../../../../hooks/usePayloadAPI';
import UploadGallery from '../../../../../../elements/UploadGallery';
import ListControls from '../../../../../../elements/ListControls';
import ReactSelect from '../../../../../../elements/ReactSelect';
import Paginator from '../../../../../../elements/Paginator';
import formatFields from '../../../../../../views/collections/List/formatFields';
import Label from '../../../../../Label';
import MinimalTemplate from '../../../../../../templates/Minimal';
import Button from '../../../../../../elements/Button';
import PerPage from '../../../../../../elements/PerPage';
import { injectVoidElement } from '../../injectVoid';
import './index.scss';
import '../addSwapModals.scss';
const baseClass = 'upload-rich-text-button';
const baseModalClass = 'rich-text-upload-modal';
const insertUpload = (editor, { value, relationTo }) => {
    const text = { text: ' ' };
    const upload = {
        type: 'upload',
        value,
        relationTo,
        children: [
            text,
        ],
    };
    if (editor.blurSelection) {
        Transforms.select(editor, editor.blurSelection);
    }
    injectVoidElement(editor, upload);
    ReactEditor.focus(editor);
};
const UploadButton = ({ path }) => {
    var _a, _b;
    const { open, closeAll, currentModal } = useModal();
    const editor = useSlate();
    const { serverURL, routes: { api }, collections } = useConfig();
    const [availableCollections] = useState(() => collections.filter(({ admin: { enableRichTextRelationship }, upload }) => (Boolean(upload) && enableRichTextRelationship)));
    const [renderModal, setRenderModal] = useState(false);
    const [modalCollectionOption, setModalCollectionOption] = useState(() => {
        const firstAvailableCollection = collections.find(({ admin: { enableRichTextRelationship }, upload }) => (Boolean(upload) && enableRichTextRelationship));
        if (firstAvailableCollection) {
            return { label: firstAvailableCollection.labels.singular, value: firstAvailableCollection.slug };
        }
        return undefined;
    });
    const [modalCollection, setModalCollection] = useState(() => collections.find(({ admin: { enableRichTextRelationship }, upload }) => (Boolean(upload) && enableRichTextRelationship)));
    const [fields, setFields] = useState(() => (modalCollection ? formatFields(modalCollection) : undefined));
    const [limit, setLimit] = useState();
    const [sort, setSort] = useState(null);
    const [where, setWhere] = useState(null);
    const [page, setPage] = useState(null);
    const modalSlug = `${path}-add-upload`;
    const moreThanOneAvailableCollection = availableCollections.length > 1;
    const isOpen = currentModal === modalSlug;
    // If modal is open, get active page of upload gallery
    const apiURL = isOpen ? `${serverURL}${api}/${modalCollection.slug}` : null;
    const [{ data }, { setParams }] = usePayloadAPI(apiURL, {});
    useEffect(() => {
        if (modalCollection) {
            setFields(formatFields(modalCollection));
        }
    }, [modalCollection]);
    useEffect(() => {
        if (renderModal) {
            open(modalSlug);
        }
    }, [renderModal, open, modalSlug]);
    useEffect(() => {
        const params = {};
        if (page)
            params.page = page;
        if (where)
            params.where = where;
        if (sort)
            params.sort = sort;
        if (limit)
            params.limit = limit;
        setParams(params);
    }, [setParams, page, sort, where, limit]);
    useEffect(() => {
        if (modalCollectionOption) {
            setModalCollection(collections.find(({ slug }) => modalCollectionOption.value === slug));
        }
    }, [modalCollectionOption, collections]);
    if (!modalCollection) {
        return null;
    }
    return (React.createElement(Fragment, null,
        React.createElement(ElementButton, { className: baseClass, format: "upload", onClick: () => setRenderModal(true) },
            React.createElement(UploadIcon, null)),
        renderModal && (React.createElement(Modal, { className: baseModalClass, slug: modalSlug }, isOpen && (React.createElement(MinimalTemplate, { width: "wide" },
            React.createElement("header", { className: `${baseModalClass}__header` },
                React.createElement("h1", null,
                    "Add",
                    ' ',
                    modalCollection.labels.singular),
                React.createElement(Button, { icon: "x", round: true, buttonStyle: "icon-label", iconStyle: "with-border", onClick: () => {
                        closeAll();
                        setRenderModal(false);
                    } })),
            moreThanOneAvailableCollection && (React.createElement("div", { className: `${baseModalClass}__select-collection-wrap` },
                React.createElement(Label, { label: "Select a Collection to Browse" }),
                React.createElement(ReactSelect, { className: `${baseClass}__select-collection`, value: modalCollectionOption, onChange: setModalCollectionOption, options: availableCollections.map((coll) => ({ label: coll.labels.singular, value: coll.slug })) }))),
            React.createElement(ListControls, { collection: {
                    ...modalCollection,
                    fields,
                }, enableColumns: false, enableSort: true, modifySearchQuery: false, handleSortChange: setSort, handleWhereChange: setWhere }),
            React.createElement(UploadGallery, { docs: data === null || data === void 0 ? void 0 : data.docs, collection: modalCollection, onCardClick: (doc) => {
                    insertUpload(editor, {
                        value: {
                            id: doc.id,
                        },
                        relationTo: modalCollection.slug,
                    });
                    setRenderModal(false);
                    closeAll();
                } }),
            React.createElement("div", { className: `${baseModalClass}__page-controls` },
                React.createElement(Paginator, { limit: data.limit, totalPages: data.totalPages, page: data.page, hasPrevPage: data.hasPrevPage, hasNextPage: data.hasNextPage, prevPage: data.prevPage, nextPage: data.nextPage, numberOfNeighbors: 1, onChange: setPage, disableHistoryChange: true }),
                (data === null || data === void 0 ? void 0 : data.totalDocs) > 0 && (React.createElement(Fragment, null,
                    React.createElement("div", { className: `${baseModalClass}__page-info` },
                        data.page,
                        "-",
                        data.totalPages > 1 ? data.limit : data.totalDocs,
                        ' ',
                        "of",
                        ' ',
                        data.totalDocs),
                    React.createElement(PerPage, { limits: (_b = (_a = modalCollection === null || modalCollection === void 0 ? void 0 : modalCollection.admin) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.limits, limit: limit, modifySearchParams: false, handleChange: setLimit }))))))))));
};
export default UploadButton;
