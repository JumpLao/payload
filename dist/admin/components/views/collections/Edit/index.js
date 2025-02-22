import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { useConfig } from '../../../utilities/Config';
import { useAuth } from '../../../utilities/Auth';
import { useStepNav } from '../../../elements/StepNav';
import usePayloadAPI from '../../../../hooks/usePayloadAPI';
import RenderCustomComponent from '../../../utilities/RenderCustomComponent';
import DefaultEdit from './Default';
import formatFields from './formatFields';
import buildStateFromSchema from '../../../forms/Form/buildStateFromSchema';
import { useLocale } from '../../../utilities/Locale';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import { usePreferences } from '../../../utilities/Preferences';
const EditView = (props) => {
    var _a, _b, _c;
    const { collection: incomingCollection, isEditing } = props;
    const { slug, labels: { plural: pluralLabel, }, admin: { useAsTitle, components: { views: { Edit: CustomEdit, } = {}, } = {}, } = {}, } = incomingCollection;
    const [fields] = useState(() => formatFields(incomingCollection, isEditing));
    const [collection] = useState(() => ({ ...incomingCollection, fields }));
    const locale = useLocale();
    const { serverURL, routes: { admin, api } } = useConfig();
    const { params: { id } = {} } = useRouteMatch();
    const { state: locationState } = useLocation();
    const history = useHistory();
    const { setStepNav } = useStepNav();
    const [initialState, setInitialState] = useState();
    const { permissions, user } = useAuth();
    const { getVersions, preferencesKey } = useDocumentInfo();
    const { getPreference } = usePreferences();
    const onSave = useCallback(async (json) => {
        var _a;
        getVersions();
        if (!isEditing) {
            history.push(`${admin}/collections/${collection.slug}/${(_a = json === null || json === void 0 ? void 0 : json.doc) === null || _a === void 0 ? void 0 : _a.id}`);
        }
        else {
            const state = await buildStateFromSchema({ fieldSchema: collection.fields, data: json.doc, user, id, operation: 'update', locale });
            setInitialState(state);
        }
    }, [admin, collection, history, isEditing, getVersions, user, id, locale]);
    const [{ data, isLoading: isLoadingDocument, isError }] = usePayloadAPI((isEditing ? `${serverURL}${api}/${slug}/${id}` : null), { initialParams: { 'fallback-locale': 'null', depth: 0, draft: 'true' } });
    const dataToRender = (locationState === null || locationState === void 0 ? void 0 : locationState.data) || data;
    useEffect(() => {
        const nav = [{
                url: `${admin}/collections/${slug}`,
                label: pluralLabel,
            }];
        if (isEditing) {
            let label = '';
            if (dataToRender) {
                if (useAsTitle) {
                    if (dataToRender[useAsTitle]) {
                        label = dataToRender[useAsTitle];
                    }
                    else {
                        label = '[Untitled]';
                    }
                }
                else {
                    label = dataToRender.id;
                }
            }
            nav.push({
                label,
            });
        }
        else {
            nav.push({
                label: 'Create New',
            });
        }
        setStepNav(nav);
    }, [setStepNav, isEditing, pluralLabel, dataToRender, slug, useAsTitle, admin]);
    useEffect(() => {
        if (isLoadingDocument) {
            return;
        }
        const awaitInitialState = async () => {
            const state = await buildStateFromSchema({ fieldSchema: fields, data: dataToRender, user, operation: isEditing ? 'update' : 'create', id, locale });
            await getPreference(preferencesKey);
            setInitialState(state);
        };
        awaitInitialState();
    }, [dataToRender, fields, isEditing, id, user, locale, isLoadingDocument, preferencesKey, getPreference]);
    if (isError) {
        return (React.createElement(Redirect, { to: `${admin}/not-found` }));
    }
    const collectionPermissions = (_a = permissions === null || permissions === void 0 ? void 0 : permissions.collections) === null || _a === void 0 ? void 0 : _a[slug];
    const apiURL = `${serverURL}${api}/${slug}/${id}${collection.versions.drafts ? '?draft=true' : ''}`;
    const action = `${serverURL}${api}/${slug}${isEditing ? `/${id}` : ''}?locale=${locale}&depth=0&fallback-locale=null`;
    const hasSavePermission = (isEditing && ((_b = collectionPermissions === null || collectionPermissions === void 0 ? void 0 : collectionPermissions.update) === null || _b === void 0 ? void 0 : _b.permission)) || (!isEditing && ((_c = collectionPermissions === null || collectionPermissions === void 0 ? void 0 : collectionPermissions.create) === null || _c === void 0 ? void 0 : _c.permission));
    return (React.createElement(RenderCustomComponent, { DefaultComponent: DefaultEdit, CustomComponent: CustomEdit, componentProps: {
            isLoading: !initialState,
            data: dataToRender,
            collection,
            permissions: collectionPermissions,
            isEditing,
            onSave,
            initialState,
            hasSavePermission,
            apiURL,
            action,
        } }));
};
export default EditView;
