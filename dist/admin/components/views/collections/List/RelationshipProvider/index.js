import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import querystring from 'qs';
import { useConfig } from '../../../../utilities/Config';
import { reducer } from './reducer';
import useDebounce from '../../../../../hooks/useDebounce';
const Context = createContext({});
export const RelationshipProvider = ({ children }) => {
    const [documents, dispatchDocuments] = useReducer(reducer, {});
    const debouncedDocuments = useDebounce(documents, 100);
    const config = useConfig();
    const { serverURL, routes: { api }, } = config;
    useEffect(() => {
        Object.entries(debouncedDocuments).forEach(async ([slug, docs]) => {
            const idsToLoad = [];
            Object.entries(docs).forEach(([id, value]) => {
                if (value === null) {
                    idsToLoad.push(id);
                }
            });
            if (idsToLoad.length > 0) {
                const url = `${serverURL}${api}/${slug}`;
                const params = {
                    depth: 0,
                    'where[id][in]': idsToLoad,
                    pagination: false,
                };
                const query = querystring.stringify(params, { addQueryPrefix: true });
                const result = await fetch(`${url}${query}`);
                if (result.ok) {
                    const json = await result.json();
                    if (json.docs) {
                        dispatchDocuments({ type: 'ADD_LOADED', docs: json.docs, relationTo: slug, idsToLoad });
                    }
                }
                else {
                    dispatchDocuments({ type: 'ADD_LOADED', docs: [], relationTo: slug, idsToLoad });
                }
            }
        });
    }, [serverURL, api, debouncedDocuments]);
    const getRelationships = useCallback(async (relationships) => {
        dispatchDocuments({ type: 'REQUEST', docs: relationships });
    }, []);
    return (React.createElement(Context.Provider, { value: { getRelationships, documents } }, children));
};
export const useListRelationships = () => useContext(Context);
