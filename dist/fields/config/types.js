"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldAffectsData = exports.fieldIsPresentationalOnly = exports.fieldHasMaxDepth = exports.fieldSupportsMany = exports.optionIsValue = exports.optionsAreObjects = exports.optionIsObject = exports.fieldIsBlockType = exports.fieldIsArrayType = exports.fieldHasSubFields = exports.valueIsValueWithRelation = void 0;
function valueIsValueWithRelation(value) {
    return typeof value === 'object' && 'relationTo' in value && 'value' in value;
}
exports.valueIsValueWithRelation = valueIsValueWithRelation;
function fieldHasSubFields(field) {
    return (field.type === 'group' || field.type === 'array' || field.type === 'row' || field.type === 'collapsible');
}
exports.fieldHasSubFields = fieldHasSubFields;
function fieldIsArrayType(field) {
    return field.type === 'array';
}
exports.fieldIsArrayType = fieldIsArrayType;
function fieldIsBlockType(field) {
    return field.type === 'blocks';
}
exports.fieldIsBlockType = fieldIsBlockType;
function optionIsObject(option) {
    return typeof option === 'object';
}
exports.optionIsObject = optionIsObject;
function optionsAreObjects(options) {
    return Array.isArray(options) && typeof (options === null || options === void 0 ? void 0 : options[0]) === 'object';
}
exports.optionsAreObjects = optionsAreObjects;
function optionIsValue(option) {
    return typeof option === 'string';
}
exports.optionIsValue = optionIsValue;
function fieldSupportsMany(field) {
    return field.type === 'select' || field.type === 'relationship';
}
exports.fieldSupportsMany = fieldSupportsMany;
function fieldHasMaxDepth(field) {
    return (field.type === 'upload' || field.type === 'relationship') && typeof field.maxDepth === 'number';
}
exports.fieldHasMaxDepth = fieldHasMaxDepth;
function fieldIsPresentationalOnly(field) {
    return field.type === 'ui';
}
exports.fieldIsPresentationalOnly = fieldIsPresentationalOnly;
function fieldAffectsData(field) {
    return 'name' in field && !fieldIsPresentationalOnly(field);
}
exports.fieldAffectsData = fieldAffectsData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZmllbGRzL2NvbmZpZy90eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF5UEEsU0FBZ0Isd0JBQXdCLENBQUMsS0FBYztJQUNyRCxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxZQUFZLElBQUksS0FBSyxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUM7QUFDaEYsQ0FBQztBQUZELDREQUVDO0FBaUtELFNBQWdCLGlCQUFpQixDQUFDLEtBQVk7SUFDNUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLENBQUM7QUFDcEgsQ0FBQztBQUZELDhDQUVDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsS0FBWTtJQUMzQyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO0FBQ2hDLENBQUM7QUFGRCw0Q0FFQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLEtBQVk7SUFDM0MsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztBQUNqQyxDQUFDO0FBRkQsNENBRUM7QUFFRCxTQUFnQixjQUFjLENBQUMsTUFBYztJQUMzQyxPQUFPLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQztBQUNwQyxDQUFDO0FBRkQsd0NBRUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxPQUFpQjtJQUNqRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRyxDQUFDLENBQUMsQ0FBQSxLQUFLLFFBQVEsQ0FBQztBQUNwRSxDQUFDO0FBRkQsOENBRUM7QUFFRCxTQUFnQixhQUFhLENBQUMsTUFBYztJQUMxQyxPQUFPLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQztBQUNwQyxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxLQUFZO0lBQzVDLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxjQUFjLENBQUM7QUFDbEUsQ0FBQztBQUZELDhDQUVDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsS0FBWTtJQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDO0FBQzFHLENBQUM7QUFGRCw0Q0FFQztBQUVELFNBQWdCLHlCQUF5QixDQUFDLEtBQVk7SUFDcEQsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztBQUM3QixDQUFDO0FBRkQsOERBRUM7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxLQUFZO0lBQzNDLE9BQU8sTUFBTSxJQUFJLEtBQUssSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFGRCw0Q0FFQyJ9