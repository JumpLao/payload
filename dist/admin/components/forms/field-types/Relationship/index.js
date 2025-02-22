import React, { useCallback, useEffect, useState, useReducer, } from 'react';
import equal from 'deep-equal';
import qs from 'qs';
import { useConfig } from '../../../utilities/Config';
import { useAuth } from '../../../utilities/Auth';
import withCondition from '../../withCondition';
import ReactSelect from '../../../elements/ReactSelect';
import useField from '../../useField';
import Label from '../../Label';
import Error from '../../Error';
import FieldDescription from '../../FieldDescription';
import { relationship } from '../../../../../fields/validations';
import { useFormProcessing, useWatchForm } from '../../Form/context';
import optionsReducer from './optionsReducer';
import { createRelationMap } from './createRelationMap';
import { useDebouncedCallback } from '../../../../hooks/useDebouncedCallback';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import { getFilterOptionsQuery } from '../getFilterOptionsQuery';
import './index.scss';
const maxResultsPerRequest = 10;
const baseClass = 'relationship';
const Relationship = (props) => {
    const { relationTo, validate = relationship, path, name, required, label, hasMany, filterOptions, admin: { readOnly, style, className, width, description, condition, } = {}, } = props;
    const { serverURL, routes: { api, }, collections, } = useConfig();
    const { id } = useDocumentInfo();
    const { user, permissions } = useAuth();
    const { getData, getSiblingData } = useWatchForm();
    const formProcessing = useFormProcessing();
    const hasMultipleRelations = Array.isArray(relationTo);
    const [options, dispatchOptions] = useReducer(optionsReducer, required || hasMany ? [] : [{ value: null, label: 'None' }]);
    const [lastFullyLoadedRelation, setLastFullyLoadedRelation] = useState(-1);
    const [lastLoadedPage, setLastLoadedPage] = useState(1);
    const [errorLoading, setErrorLoading] = useState('');
    const [optionFilters, setOptionFilters] = useState();
    const [hasLoadedValueOptions, setHasLoadedValueOptions] = useState(false);
    const [search, setSearch] = useState('');
    const memoizedValidate = useCallback((value, validationOptions) => {
        return validate(value, { ...validationOptions, required });
    }, [validate, required]);
    const { value, showError, errorMessage, setValue, initialValue, } = useField({
        path: path || name,
        validate: memoizedValidate,
        condition,
    });
    const getResults = useCallback(async ({ lastFullyLoadedRelation: lastFullyLoadedRelationArg, lastLoadedPage: lastLoadedPageArg, search: searchArg, value: valueArg, sort, }) => {
        if (!permissions) {
            return;
        }
        let lastLoadedPageToUse = typeof lastLoadedPageArg !== 'undefined' ? lastLoadedPageArg : 1;
        const lastFullyLoadedRelationToUse = typeof lastFullyLoadedRelationArg !== 'undefined' ? lastFullyLoadedRelationArg : -1;
        const relations = Array.isArray(relationTo) ? relationTo : [relationTo];
        const relationsToFetch = lastFullyLoadedRelationToUse === -1 ? relations : relations.slice(lastFullyLoadedRelationToUse + 1);
        let resultsFetched = 0;
        const relationMap = createRelationMap({ hasMany, relationTo, value: valueArg });
        if (!errorLoading) {
            relationsToFetch.reduce(async (priorRelation, relation) => {
                var _a;
                await priorRelation;
                if (resultsFetched < 10) {
                    const collection = collections.find((coll) => coll.slug === relation);
                    const fieldToSearch = ((_a = collection === null || collection === void 0 ? void 0 : collection.admin) === null || _a === void 0 ? void 0 : _a.useAsTitle) || 'id';
                    const query = {
                        where: {
                            and: [
                                {
                                    id: {
                                        not_in: relationMap[relation],
                                    },
                                },
                            ],
                        },
                        limit: maxResultsPerRequest,
                        page: lastLoadedPageToUse,
                        sort: fieldToSearch,
                        depth: 0,
                    };
                    if (searchArg) {
                        query.where.and.push({
                            [fieldToSearch]: {
                                like: searchArg,
                            },
                        });
                    }
                    if (optionFilters === null || optionFilters === void 0 ? void 0 : optionFilters[relation]) {
                        query.where.and.push(optionFilters[relation]);
                    }
                    const response = await fetch(`${serverURL}${api}/${relation}?${qs.stringify(query)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.docs.length > 0) {
                            resultsFetched += data.docs.length;
                            dispatchOptions({ type: 'ADD', data, relation, hasMultipleRelations, collection, sort });
                            setLastLoadedPage(data.page);
                            if (!data.nextPage) {
                                setLastFullyLoadedRelation(relations.indexOf(relation));
                                // If there are more relations to search, need to reset lastLoadedPage to 1
                                // both locally within function and state
                                if (relations.indexOf(relation) + 1 < relations.length) {
                                    lastLoadedPageToUse = 1;
                                }
                            }
                        }
                    }
                    else if (response.status === 403) {
                        setLastFullyLoadedRelation(relations.indexOf(relation));
                        lastLoadedPageToUse = 1;
                        dispatchOptions({ type: 'ADD', data: { docs: [] }, relation, hasMultipleRelations, collection, sort, ids: relationMap[relation] });
                    }
                    else {
                        setErrorLoading('An error has occurred.');
                    }
                }
            }, Promise.resolve());
        }
    }, [
        permissions,
        relationTo,
        hasMany,
        errorLoading,
        collections,
        optionFilters,
        serverURL,
        api,
        hasMultipleRelations,
    ]);
    const findOptionsByValue = useCallback(() => {
        if (value) {
            if (hasMany) {
                if (Array.isArray(value)) {
                    return value.map((val) => {
                        if (hasMultipleRelations) {
                            let matchedOption;
                            options.forEach((opt) => {
                                if (opt.options) {
                                    opt.options.some((subOpt) => {
                                        if ((subOpt === null || subOpt === void 0 ? void 0 : subOpt.value) === val.value) {
                                            matchedOption = subOpt;
                                            return true;
                                        }
                                        return false;
                                    });
                                }
                            });
                            return matchedOption;
                        }
                        return options.find((opt) => opt.value === val);
                    });
                }
                return undefined;
            }
            if (hasMultipleRelations) {
                let matchedOption;
                const valueWithRelation = value;
                options.forEach((opt) => {
                    if (opt === null || opt === void 0 ? void 0 : opt.options) {
                        opt.options.some((subOpt) => {
                            if ((subOpt === null || subOpt === void 0 ? void 0 : subOpt.value) === valueWithRelation.value) {
                                matchedOption = subOpt;
                                return true;
                            }
                            return false;
                        });
                    }
                });
                return matchedOption;
            }
            return options.find((opt) => opt.value === value);
        }
        return undefined;
    }, [hasMany, hasMultipleRelations, value, options]);
    const updateSearch = useDebouncedCallback((searchArg, valueArg) => {
        getResults({ search: searchArg, value: valueArg, sort: true });
        setSearch(searchArg);
    }, [getResults]);
    const handleInputChange = (searchArg, valueArg) => {
        if (search !== searchArg) {
            updateSearch(searchArg, valueArg);
        }
    };
    // ///////////////////////////
    // Fetch value options when initialValue changes
    // ///////////////////////////
    useEffect(() => {
        if (initialValue && !hasLoadedValueOptions) {
            const relationMap = createRelationMap({
                hasMany,
                relationTo,
                value: initialValue,
            });
            Object.entries(relationMap).reduce(async (priorRelation, [relation, ids]) => {
                await priorRelation;
                if (ids.length > 0) {
                    const query = {
                        where: {
                            id: {
                                in: ids,
                            },
                        },
                        depth: 0,
                        limit: ids.length,
                    };
                    if (!errorLoading) {
                        const response = await fetch(`${serverURL}${api}/${relation}?${qs.stringify(query)}`);
                        const collection = collections.find((coll) => coll.slug === relation);
                        if (response.ok) {
                            const data = await response.json();
                            dispatchOptions({ type: 'ADD', data, relation, hasMultipleRelations, collection, sort: true, ids });
                        }
                        else if (response.status === 403) {
                            dispatchOptions({ type: 'ADD', data: { docs: [] }, relation, hasMultipleRelations, collection, sort: true, ids });
                        }
                    }
                }
            }, Promise.resolve());
            setHasLoadedValueOptions(true);
        }
    }, [hasMany, hasMultipleRelations, relationTo, initialValue, hasLoadedValueOptions, errorLoading, collections, api, serverURL]);
    const data = getData();
    const siblingData = getSiblingData(path);
    useEffect(() => {
        if (!filterOptions) {
            return;
        }
        const newOptionFilters = getFilterOptionsQuery(filterOptions, {
            id,
            data,
            relationTo,
            siblingData,
            user,
        });
        if (!equal(newOptionFilters, optionFilters)) {
            setOptionFilters(newOptionFilters);
            dispatchOptions({
                type: 'CLEAR',
                required,
            });
        }
    }, [relationTo, filterOptions, optionFilters, id, data, siblingData, path, user, required]);
    useEffect(() => {
        if (optionFilters || !filterOptions) {
            setHasLoadedValueOptions(false);
            getResults({
                value: initialValue,
            });
        }
    }, [initialValue, getResults, optionFilters, filterOptions]);
    const classes = [
        'field-type',
        baseClass,
        className,
        showError && 'error',
        errorLoading && 'error-loading',
        readOnly && `${baseClass}--read-only`,
    ].filter(Boolean).join(' ');
    const valueToRender = (findOptionsByValue() || value);
    if ((valueToRender === null || valueToRender === void 0 ? void 0 : valueToRender.value) === 'null')
        valueToRender.value = null;
    return (React.createElement("div", { id: `field-${(path || name).replace(/\./gi, '__')}`, className: classes, style: {
            ...style,
            width,
        } },
        React.createElement(Error, { showError: showError, message: errorMessage }),
        React.createElement(Label, { htmlFor: path, label: label, required: required }),
        !errorLoading && (React.createElement(ReactSelect, { isDisabled: readOnly, onInputChange: (newSearch) => handleInputChange(newSearch, value), onChange: !readOnly ? (selected) => {
                if (hasMany) {
                    setValue(selected ? selected.map((option) => {
                        if (hasMultipleRelations) {
                            return {
                                relationTo: option.relationTo,
                                value: option.value,
                            };
                        }
                        return option.value;
                    }) : null);
                }
                else if (hasMultipleRelations) {
                    setValue({
                        relationTo: selected.relationTo,
                        value: selected.value,
                    });
                }
                else {
                    setValue(selected.value);
                }
            } : undefined, onMenuScrollToBottom: () => {
                getResults({
                    lastFullyLoadedRelation,
                    lastLoadedPage: lastLoadedPage + 1,
                    search,
                    value: initialValue,
                    sort: false,
                });
            }, value: valueToRender, showError: showError, disabled: formProcessing, options: options, isMulti: hasMany })),
        errorLoading && (React.createElement("div", { className: `${baseClass}__error-loading` }, errorLoading)),
        React.createElement(FieldDescription, { value: value, description: description })));
};
export default withCondition(Relationship);
