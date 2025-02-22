import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { fieldAffectsData } from '../../../../fields/config/types';
import SearchFilter from '../SearchFilter';
import ColumnSelector from '../ColumnSelector';
import WhereBuilder from '../WhereBuilder';
import SortComplex from '../SortComplex';
import Button from '../Button';
import { useSearchParams } from '../../utilities/SearchParams';
import validateWhereQuery from '../WhereBuilder/validateWhereQuery';
import './index.scss';
const baseClass = 'list-controls';
const ListControls = (props) => {
    const { collection, enableColumns = true, enableSort = false, columns, setColumns, handleSortChange, handleWhereChange, modifySearchQuery = true, collection: { fields, admin: { useAsTitle, }, }, } = props;
    const params = useSearchParams();
    const shouldInitializeWhereOpened = validateWhereQuery(params === null || params === void 0 ? void 0 : params.where);
    const [titleField] = useState(() => fields.find((field) => fieldAffectsData(field) && field.name === useAsTitle));
    const [visibleDrawer, setVisibleDrawer] = useState(shouldInitializeWhereOpened ? 'where' : undefined);
    return (React.createElement("div", { className: baseClass },
        React.createElement("div", { className: `${baseClass}__wrap` },
            React.createElement(SearchFilter, { fieldName: titleField && fieldAffectsData(titleField) ? titleField.name : undefined, handleChange: handleWhereChange, modifySearchQuery: modifySearchQuery, fieldLabel: titleField && titleField.label ? titleField.label : undefined }),
            React.createElement("div", { className: `${baseClass}__buttons` },
                React.createElement("div", { className: `${baseClass}__buttons-wrap` },
                    enableColumns && (React.createElement(Button, { className: `${baseClass}__toggle-columns`, buttonStyle: visibleDrawer === 'columns' ? undefined : 'secondary', onClick: () => setVisibleDrawer(visibleDrawer !== 'columns' ? 'columns' : undefined), icon: "chevron", iconStyle: "none" }, "Columns")),
                    React.createElement(Button, { className: `${baseClass}__toggle-where`, buttonStyle: visibleDrawer === 'where' ? undefined : 'secondary', onClick: () => setVisibleDrawer(visibleDrawer !== 'where' ? 'where' : undefined), icon: "chevron", iconStyle: "none" }, "Filters"),
                    enableSort && (React.createElement(Button, { className: `${baseClass}__toggle-sort`, buttonStyle: visibleDrawer === 'sort' ? undefined : 'secondary', onClick: () => setVisibleDrawer(visibleDrawer !== 'sort' ? 'sort' : undefined), icon: "chevron", iconStyle: "none" }, "Sort"))))),
        enableColumns && (React.createElement(AnimateHeight, { className: `${baseClass}__columns`, height: visibleDrawer === 'columns' ? 'auto' : 0 },
            React.createElement(ColumnSelector, { collection: collection, columns: columns, setColumns: setColumns }))),
        React.createElement(AnimateHeight, { className: `${baseClass}__where`, height: visibleDrawer === 'where' ? 'auto' : 0 },
            React.createElement(WhereBuilder, { collection: collection, modifySearchQuery: modifySearchQuery, handleChange: handleWhereChange })),
        enableSort && (React.createElement(AnimateHeight, { className: `${baseClass}__sort`, height: visibleDrawer === 'sort' ? 'auto' : 0 },
            React.createElement(SortComplex, { modifySearchQuery: modifySearchQuery, collection: collection, handleChange: handleSortChange })))));
};
export default ListControls;
