import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../../utilities/Config';
import { useAuth } from '../../utilities/Auth';
import { useStepNav } from '../../elements/StepNav';
import usePayloadAPI from '../../../hooks/usePayloadAPI';
import { useLocale } from '../../utilities/Locale';
import DefaultAccount from './Default';
import buildStateFromSchema from '../../forms/Form/buildStateFromSchema';
import RenderCustomComponent from '../../utilities/RenderCustomComponent';
import { useDocumentInfo } from '../../utilities/DocumentInfo';
import { usePreferences } from '../../utilities/Preferences';
const AccountView = () => {
    var _a, _b;
    const { state: locationState } = useLocation();
    const locale = useLocale();
    const { setStepNav } = useStepNav();
    const { user, permissions } = useAuth();
    const [initialState, setInitialState] = useState();
    const { id, preferencesKey } = useDocumentInfo();
    const { getPreference } = usePreferences();
    const { serverURL, routes: { api }, collections, admin: { user: adminUser, components: { views: { Account: CustomAccount, } = {
        Account: undefined,
    }, } = {}, } = {
        user: 'users',
    }, } = useConfig();
    const collection = collections.find((coll) => coll.slug === user.collection);
    const { fields } = collection;
    const collectionPermissions = (_a = permissions === null || permissions === void 0 ? void 0 : permissions.collections) === null || _a === void 0 ? void 0 : _a[adminUser];
    const [{ data }] = usePayloadAPI(`${serverURL}${api}/${collection === null || collection === void 0 ? void 0 : collection.slug}/${user === null || user === void 0 ? void 0 : user.id}?depth=0`, { initialParams: { 'fallback-locale': 'null' } });
    const hasSavePermission = (_b = collectionPermissions === null || collectionPermissions === void 0 ? void 0 : collectionPermissions.update) === null || _b === void 0 ? void 0 : _b.permission;
    const dataToRender = (locationState === null || locationState === void 0 ? void 0 : locationState.data) || data;
    const apiURL = `${serverURL}${api}/${user.collection}/${data === null || data === void 0 ? void 0 : data.id}`;
    const action = `${serverURL}${api}/${user.collection}/${data === null || data === void 0 ? void 0 : data.id}?locale=${locale}&depth=0`;
    useEffect(() => {
        const nav = [{
                label: 'Account',
            }];
        setStepNav(nav);
    }, [setStepNav]);
    useEffect(() => {
        const awaitInitialState = async () => {
            const state = await buildStateFromSchema({ fieldSchema: fields, data: dataToRender, operation: 'update', id, user, locale });
            await getPreference(preferencesKey);
            setInitialState(state);
        };
        awaitInitialState();
    }, [dataToRender, fields, id, user, locale, preferencesKey, getPreference]);
    return (React.createElement(RenderCustomComponent, { DefaultComponent: DefaultAccount, CustomComponent: CustomAccount, componentProps: {
            action,
            data,
            collection,
            permissions: collectionPermissions,
            hasSavePermission,
            initialState,
            apiURL,
            isLoading: !initialState,
        } }));
};
export default AccountView;
