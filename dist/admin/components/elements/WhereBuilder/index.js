import React, { useState, useReducer } from 'react';
import queryString from 'qs';
import { useHistory } from 'react-router-dom';
import useThrottledEffect from '../../../hooks/useThrottledEffect';
import Button from '../Button';
import reducer from './reducer';
import Condition from './Condition';
import fieldTypes from './field-types';
import flattenTopLevelFields from '../../../../utilities/flattenTopLevelFields';
import { useSearchParams } from '../../utilities/SearchParams';
import validateWhereQuery from './validateWhereQuery';
import './index.scss';
const baseClass = 'where-builder';
const reduceFields = (fields) => flattenTopLevelFields(fields).reduce((reduced, field) => {
    if (typeof fieldTypes[field.type] === 'object') {
        const formattedField = {
            label: field.label,
            value: field.name,
            ...fieldTypes[field.type],
            props: {
                ...field,
            },
        };
        return [
            ...reduced,
            formattedField,
        ];
    }
    return reduced;
}, []);
const WhereBuilder = (props) => {
    const { collection, modifySearchQuery = true, handleChange, collection: { labels: { plural, } = {}, } = {}, } = props;
    const history = useHistory();
    const params = useSearchParams();
    const [conditions, dispatchConditions] = useReducer(reducer, params.where, (whereFromSearch) => {
        if (modifySearchQuery && validateWhereQuery(whereFromSearch)) {
            return whereFromSearch.or;
        }
        return [];
    });
    const [reducedFields] = useState(() => reduceFields(collection.fields));
    useThrottledEffect(() => {
        const currentParams = queryString.parse(history.location.search, { ignoreQueryPrefix: true, depth: 10 });
        const newWhereQuery = {
            ...typeof (currentParams === null || currentParams === void 0 ? void 0 : currentParams.where) === 'object' ? currentParams.where : {},
            or: conditions,
        };
        if (handleChange)
            handleChange(newWhereQuery);
        if (modifySearchQuery) {
            history.replace({
                search: queryString.stringify({
                    ...currentParams,
                    page: 1,
                    where: newWhereQuery,
                }, { addQueryPrefix: true }),
            });
        }
    }, 500, [conditions, modifySearchQuery, handleChange]);
    return (React.createElement("div", { className: baseClass },
        conditions.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: `${baseClass}__label` },
                "Filter",
                ' ',
                plural,
                ' ',
                "where"),
            React.createElement("ul", { className: `${baseClass}__or-filters` }, conditions.map((or, orIndex) => (React.createElement("li", { key: orIndex },
                orIndex !== 0 && (React.createElement("div", { className: `${baseClass}__label` }, "Or")),
                React.createElement("ul", { className: `${baseClass}__and-filters` }, Array.isArray(or === null || or === void 0 ? void 0 : or.and) && or.and.map((_, andIndex) => (React.createElement("li", { key: andIndex },
                    andIndex !== 0 && (React.createElement("div", { className: `${baseClass}__label` }, "And")),
                    React.createElement(Condition, { value: conditions[orIndex].and[andIndex], orIndex: orIndex, andIndex: andIndex, key: andIndex, fields: reducedFields, dispatch: dispatchConditions }))))))))),
            React.createElement(Button, { className: `${baseClass}__add-or`, icon: "plus", buttonStyle: "icon-label", iconPosition: "left", iconStyle: "with-border", onClick: () => dispatchConditions({ type: 'add', field: reducedFields[0].value }) }, "Or"))),
        conditions.length === 0 && (React.createElement("div", { className: `${baseClass}__no-filters` },
            React.createElement("div", { className: `${baseClass}__label` }, "No filters set"),
            React.createElement(Button, { className: `${baseClass}__add-first-filter`, icon: "plus", buttonStyle: "icon-label", iconPosition: "left", iconStyle: "with-border", onClick: () => dispatchConditions({ type: 'add', field: reducedFields[0].value }) }, "Add filter")))));
};
export default WhereBuilder;
