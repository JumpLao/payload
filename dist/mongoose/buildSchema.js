"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
const mongoose_1 = require("mongoose");
const types_1 = require("../fields/config/types");
const sortableFieldTypes_1 = __importDefault(require("../fields/sortableFieldTypes"));
const flattenTopLevelFields_1 = __importDefault(require("../utilities/flattenTopLevelFields"));
const setBlockDiscriminators = (fields, schema, config, buildSchemaOptions) => {
    fields.forEach((field) => {
        const blockFieldType = field;
        if (blockFieldType.type === 'blocks' && blockFieldType.blocks && blockFieldType.blocks.length > 0) {
            blockFieldType.blocks.forEach((blockItem) => {
                let blockSchemaFields = {};
                blockItem.fields.forEach((blockField) => {
                    const fieldSchema = fieldToSchemaMap[blockField.type];
                    if (fieldSchema) {
                        blockSchemaFields = fieldSchema(blockField, blockSchemaFields, config, buildSchemaOptions);
                    }
                });
                const blockSchema = new mongoose_1.Schema(blockSchemaFields, { _id: false, id: false });
                if (blockFieldType.localized && config.localization) {
                    config.localization.locales.forEach((locale) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore Possible incorrect typing in mongoose types, this works
                        schema.path(`${field.name}.${locale}`).discriminator(blockItem.slug, blockSchema);
                        setBlockDiscriminators(blockItem.fields, blockSchema, config, buildSchemaOptions);
                    });
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore Possible incorrect typing in mongoose types, this works
                    schema.path(field.name).discriminator(blockItem.slug, blockSchema);
                    setBlockDiscriminators(blockItem.fields, blockSchema, config, buildSchemaOptions);
                }
            });
        }
    });
};
const formatBaseSchema = (field, buildSchemaOptions) => ({
    sparse: field.unique && field.localized,
    unique: (!buildSchemaOptions.disableUnique && field.unique) || false,
    required: false,
    index: field.index || field.unique || false,
});
const localizeSchema = (field, schema, localization) => {
    if (field.localized && localization && Array.isArray(localization.locales)) {
        return {
            type: localization.locales.reduce((localeSchema, locale) => ({
                ...localeSchema,
                [locale]: schema,
            }), {
                _id: false,
            }),
            localized: true,
            index: schema.index,
        };
    }
    return schema;
};
const buildSchema = (config, configFields, buildSchemaOptions = {}) => {
    var _a;
    const { allowIDField, options } = buildSchemaOptions;
    let fields = {};
    let schemaFields = configFields;
    const indexFields = [];
    if (!allowIDField) {
        const idField = schemaFields.find((field) => (0, types_1.fieldAffectsData)(field) && field.name === 'id');
        if (idField) {
            fields = {
                _id: idField.type === 'number' ? Number : String,
            };
            schemaFields = schemaFields.filter((field) => (0, types_1.fieldAffectsData)(field) && field.name !== 'id');
        }
    }
    schemaFields.forEach((field) => {
        if (!(0, types_1.fieldIsPresentationalOnly)(field)) {
            const fieldSchema = fieldToSchemaMap[field.type];
            if (fieldSchema) {
                fields = fieldSchema(field, fields, config, buildSchemaOptions);
            }
            // geospatial field index must be created after the schema is created
            if (fieldIndexMap[field.type]) {
                indexFields.push(...fieldIndexMap[field.type](field, config));
            }
            if (config.indexSortableFields && !buildSchemaOptions.global && !field.index && !field.hidden && sortableFieldTypes_1.default.indexOf(field.type) > -1 && (0, types_1.fieldAffectsData)(field)) {
                indexFields.push({ index: { [field.name]: 1 } });
            }
            else if (field.unique && (0, types_1.fieldAffectsData)(field)) {
                indexFields.push({ index: { [field.name]: 1 }, options: { unique: true, sparse: field.localized || false } });
            }
            else if (field.index && (0, types_1.fieldAffectsData)(field)) {
                indexFields.push({ index: { [field.name]: 1 } });
            }
        }
    });
    if ((_a = buildSchemaOptions === null || buildSchemaOptions === void 0 ? void 0 : buildSchemaOptions.options) === null || _a === void 0 ? void 0 : _a.timestamps) {
        indexFields.push({ index: { createdAt: 1 } });
        indexFields.push({ index: { updatedAt: 1 } });
    }
    const schema = new mongoose_1.Schema(fields, options);
    indexFields.forEach((indexField) => {
        schema.index(indexField.index, indexField.options);
    });
    setBlockDiscriminators((0, flattenTopLevelFields_1.default)(configFields), schema, config, buildSchemaOptions);
    return schema;
};
const fieldIndexMap = {
    point: (field, config) => {
        let direction;
        const options = {
            unique: field.unique || false,
            sparse: (field.localized && field.unique) || false,
        };
        if (field.index === true || field.index === undefined) {
            direction = '2dsphere';
        }
        if (field.localized && config.localization) {
            return config.localization.locales.map((locale) => ({
                index: { [`${field.name}.${locale}`]: direction },
                options,
            }));
        }
        if (field.unique) {
            options.unique = true;
        }
        return [{ index: { [field.name]: direction }, options }];
    },
};
const fieldToSchemaMap = {
    number: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: Number };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    text: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    email: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    textarea: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    richText: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: mongoose_1.Schema.Types.Mixed };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    code: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    point: (field, fields, config) => {
        const baseSchema = {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                sparse: field.unique && field.localized,
                unique: field.unique || false,
                required: false,
                default: field.defaultValue || undefined,
            },
        };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    radio: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: String,
            enum: field.options.map((option) => {
                if (typeof option === 'object')
                    return option.value;
                return option;
            }),
        };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    checkbox: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: Boolean };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    date: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: Date };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    upload: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: mongoose_1.Schema.Types.Mixed,
            ref: field.relationTo,
        };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    relationship: (field, fields, config, buildSchemaOptions) => {
        const hasManyRelations = Array.isArray(field.relationTo);
        let schemaToReturn = {};
        if (field.localized && config.localization) {
            schemaToReturn = {
                type: config.localization.locales.reduce((locales, locale) => {
                    let localeSchema = {};
                    if (hasManyRelations) {
                        localeSchema._id = false;
                        localeSchema.value = {
                            type: mongoose_1.Schema.Types.Mixed,
                            refPath: `${field.name}.${locale}.relationTo`,
                        };
                        localeSchema.relationTo = { type: String, enum: field.relationTo };
                    }
                    else {
                        localeSchema = {
                            ...formatBaseSchema(field, buildSchemaOptions),
                            type: mongoose_1.Schema.Types.Mixed,
                            ref: field.relationTo,
                        };
                    }
                    return {
                        ...locales,
                        [locale]: field.hasMany ? [localeSchema] : localeSchema,
                    };
                }, {}),
                localized: true,
            };
        }
        else if (hasManyRelations) {
            schemaToReturn._id = false;
            schemaToReturn.value = {
                type: mongoose_1.Schema.Types.Mixed,
                refPath: `${field.name}.relationTo`,
            };
            schemaToReturn.relationTo = { type: String, enum: field.relationTo };
            if (field.hasMany)
                schemaToReturn = [schemaToReturn];
        }
        else {
            schemaToReturn = {
                ...formatBaseSchema(field, buildSchemaOptions),
                type: mongoose_1.Schema.Types.Mixed,
                ref: field.relationTo,
            };
            if (field.hasMany)
                schemaToReturn = [schemaToReturn];
        }
        return {
            ...fields,
            [field.name]: schemaToReturn,
        };
    },
    row: (field, fields, config, buildSchemaOptions) => {
        let newFields = { ...fields };
        field.fields.forEach((subField) => {
            const fieldSchema = fieldToSchemaMap[subField.type];
            if (fieldSchema) {
                newFields = fieldSchema(subField, newFields, config, buildSchemaOptions);
            }
        });
        return newFields;
    },
    collapsible: (field, fields, config, buildSchemaOptions) => {
        let newFields = { ...fields };
        field.fields.forEach((subField) => {
            const fieldSchema = fieldToSchemaMap[subField.type];
            if (fieldSchema) {
                newFields = fieldSchema(subField, newFields, config, buildSchemaOptions);
            }
        });
        return newFields;
    },
    tabs: (field, fields, config, buildSchemaOptions) => {
        let newFields = { ...fields };
        field.tabs.forEach((tab) => {
            tab.fields.forEach((subField) => {
                const fieldSchema = fieldToSchemaMap[subField.type];
                if (fieldSchema) {
                    newFields = fieldSchema(subField, newFields, config, buildSchemaOptions);
                }
            });
        });
        return newFields;
    },
    array: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: [buildSchema(config, field.fields, {
                    options: { _id: false, id: false },
                    allowIDField: true,
                    disableUnique: buildSchemaOptions.disableUnique,
                })],
        };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    group: (field, fields, config, buildSchemaOptions) => {
        var _a, _b;
        let { required } = field;
        if (((_a = field === null || field === void 0 ? void 0 : field.admin) === null || _a === void 0 ? void 0 : _a.condition) || (field === null || field === void 0 ? void 0 : field.localized) || ((_b = field === null || field === void 0 ? void 0 : field.access) === null || _b === void 0 ? void 0 : _b.create))
            required = false;
        const formattedBaseSchema = formatBaseSchema(field, buildSchemaOptions);
        const baseSchema = {
            ...formattedBaseSchema,
            required: required && field.fields.some((subField) => { var _a, _b; return (!(0, types_1.fieldIsPresentationalOnly)(subField) && subField.required && !subField.localized && !((_a = subField === null || subField === void 0 ? void 0 : subField.admin) === null || _a === void 0 ? void 0 : _a.condition) && !((_b = subField === null || subField === void 0 ? void 0 : subField.access) === null || _b === void 0 ? void 0 : _b.create)); }),
            type: buildSchema(config, field.fields, {
                options: {
                    _id: false,
                    id: false,
                },
                disableUnique: buildSchemaOptions.disableUnique,
            }),
        };
        return {
            ...fields,
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        };
    },
    select: (field, fields, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: String,
            enum: field.options.map((option) => {
                if (typeof option === 'object')
                    return option.value;
                return option;
            }),
        };
        const schemaToReturn = localizeSchema(field, baseSchema, config.localization);
        return {
            ...fields,
            [field.name]: field.hasMany ? [schemaToReturn] : schemaToReturn,
        };
    },
    blocks: (field, fields, config) => {
        const baseSchema = [new mongoose_1.Schema({}, { _id: false, discriminatorKey: 'blockType' })];
        let schemaToReturn;
        if (field.localized && config.localization) {
            schemaToReturn = config.localization.locales.reduce((localeSchema, locale) => ({
                ...localeSchema,
                [locale]: baseSchema,
            }), {});
        }
        else {
            schemaToReturn = baseSchema;
        }
        return {
            ...fields,
            [field.name]: schemaToReturn,
        };
    },
};
exports.default = buildSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9uZ29vc2UvYnVpbGRTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsMkNBQTJDO0FBQzNDLDREQUE0RDtBQUM1RCx5Q0FBeUM7QUFDekMsdUNBQWtHO0FBRWxHLGtEQUFrWDtBQUNsWCxzRkFBOEQ7QUFDOUQsK0ZBQXVFO0FBZ0J2RSxNQUFNLHNCQUFzQixHQUFHLENBQUMsTUFBZSxFQUFFLE1BQWMsRUFBRSxNQUF1QixFQUFFLGtCQUFzQyxFQUFFLEVBQUU7SUFDbEksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sY0FBYyxHQUFHLEtBQW1CLENBQUM7UUFDM0MsSUFBSSxjQUFjLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxjQUFjLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqRyxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQWdCLEVBQUUsRUFBRTtnQkFDakQsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7Z0JBRTNCLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ3RDLE1BQU0sV0FBVyxHQUF5QixnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVFLElBQUksV0FBVyxFQUFFO3dCQUNmLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7cUJBQzVGO2dCQUNILENBQUMsQ0FBQyxDQUFDO2dCQUVILE1BQU0sV0FBVyxHQUFHLElBQUksaUJBQU0sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFB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