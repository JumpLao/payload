"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
const graphql_type_json_1 = require("graphql-type-json");
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const formatName_1 = __importDefault(require("../utilities/formatName"));
const combineParentName_1 = __importDefault(require("../utilities/combineParentName"));
const withNullableType_1 = __importDefault(require("./withNullableType"));
const formatLabels_1 = require("../../utilities/formatLabels");
const relationshipPromise_1 = __importDefault(require("../../fields/richText/relationshipPromise"));
const formatOptions_1 = __importDefault(require("../utilities/formatOptions"));
const buildWhereInputType_1 = __importDefault(require("./buildWhereInputType"));
const buildBlockType_1 = __importDefault(require("./buildBlockType"));
function buildObjectType(payload, name, fields, parentName, baseFields = {}) {
    const fieldToSchemaMap = {
        number: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLFloat) },
        }),
        text: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString) },
        }),
        email: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_scalars_1.EmailAddressResolver) },
        }),
        textarea: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString) },
        }),
        code: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString) },
        }),
        date: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_scalars_1.DateTimeResolver) },
        }),
        point: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, new graphql_1.GraphQLList(graphql_1.GraphQLFloat)) },
        }),
        richText: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: {
                type: (0, withNullableType_1.default)(field, graphql_type_json_1.GraphQLJSON),
                async resolve(parent, args, context) {
                    if (args.depth > 0) {
                        await (0, relationshipPromise_1.default)({
                            req: context.req,
                            siblingDoc: parent,
                            depth: args.depth,
                            field,
                            showHiddenFields: false,
                        });
                    }
                    return parent[field.name];
                },
                args: {
                    depth: {
                        type: graphql_1.GraphQLInt,
                    },
                },
            },
        }),
        upload: (objectTypeConfig, field) => {
            const { relationTo, label } = field;
            const uploadName = (0, combineParentName_1.default)(parentName, label === false ? (0, formatLabels_1.toWords)(field.name, true) : label);
            // If the relationshipType is undefined at this point,
            // it can be assumed that this blockType can have a relationship
            // to itself. Therefore, we set the relationshipType equal to the blockType
            // that is currently being created.
            const type = payload.collections[relationTo].graphQL.type || newlyCreatedBlockType;
            const uploadArgs = {};
            if (payload.config.localization) {
                uploadArgs.locale = {
                    type: payload.types.localeInputType,
                };
                uploadArgs.fallbackLocale = {
                    type: payload.types.fallbackLocaleInputType,
                };
            }
            const relatedCollectionSlug = field.relationTo;
            const upload = {
                args: uploadArgs,
                type,
                extensions: { complexity: 20 },
                async resolve(parent, args, context) {
                    const value = parent[field.name];
                    const locale = args.locale || context.req.locale;
                    const fallbackLocale = args.fallbackLocale || context.req.fallbackLocale;
                    const id = value;
                    if (id) {
                        const relatedDocument = await context.req.payloadDataLoader.load(JSON.stringify([
                            relatedCollectionSlug,
                            id,
                            0,
                            0,
                            locale,
                            fallbackLocale,
                            false,
                            false,
                        ]));
                        return relatedDocument || null;
                    }
                    return null;
                },
            };
            const whereFields = payload.collections[relationTo].config.fields;
            upload.args.where = {
                type: (0, buildWhereInputType_1.default)(uploadName, whereFields, uploadName),
            };
            return {
                ...objectTypeConfig,
                [field.name]: upload,
            };
        },
        radio: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: {
                type: (0, withNullableType_1.default)(field, new graphql_1.GraphQLEnumType({
                    name: (0, combineParentName_1.default)(parentName, field.name),
                    values: (0, formatOptions_1.default)(field),
                })),
            },
        }),
        checkbox: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLBoolean) },
        }),
        select: (objectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.name);
            let type = new graphql_1.GraphQLEnumType({
                name: fullName,
                values: (0, formatOptions_1.default)(field),
            });
            type = field.hasMany ? new graphql_1.GraphQLList(type) : type;
            type = (0, withNullableType_1.default)(field, type);
            return {
                ...objectTypeConfig,
                [field.name]: { type },
            };
        },
        relationship: (objectTypeConfig, field) => {
            const { relationTo, label } = field;
            const isRelatedToManyCollections = Array.isArray(relationTo);
            const hasManyValues = field.hasMany;
            const relationshipName = (0, combineParentName_1.default)(parentName, label === false ? (0, formatLabels_1.toWords)(field.name, true) : label);
            let type;
            let relationToType = null;
            if (Array.isArray(relationTo)) {
                relationToType = new graphql_1.GraphQLEnumType({
                    name: `${relationshipName}_RelationTo`,
                    values: relationTo.reduce((relations, relation) => ({
                        ...relations,
                        [(0, formatName_1.default)(relation)]: {
                            value: relation,
                        },
                    }), {}),
                });
                const types = relationTo.map((relation) => payload.collections[relation].graphQL.type);
                type = new graphql_1.GraphQLObjectType({
                    name: `${relationshipName}_Relationship`,
                    fields: {
                        relationTo: {
                            type: relationToType,
                        },
                        value: {
                            type: new graphql_1.GraphQLUnionType({
                                name: relationshipName,
                                types,
                                async resolveType(data, { req }) {
                                    return payload.collections[data.collection].graphQL.type.name;
                                },
                            }),
                        },
                    },
                });
            }
            else {
                ({ type } = payload.collections[relationTo].graphQL);
            }
            // If the relationshipType is undefined at this point,
            // it can be assumed that this blockType can have a relationship
            // to itself. Therefore, we set the relationshipType equal to the blockType
            // that is currently being created.
            type = type || newlyCreatedBlockType;
            const relationshipArgs = {};
            if (payload.config.localization) {
                relationshipArgs.locale = {
                    type: payload.types.localeInputType,
                };
                relationshipArgs.fallbackLocale = {
                    type: payload.types.fallbackLocaleInputType,
                };
            }
            const relationship = {
                args: relationshipArgs,
                type: hasManyValues ? new graphql_1.GraphQLList(type) : type,
                extensions: { complexity: 10 },
                async resolve(parent, args, context) {
                    const value = parent[field.name];
                    const locale = args.locale || context.req.locale;
                    const fallbackLocale = args.fallbackLocale || context.req.fallbackLocale;
                    let relatedCollectionSlug = field.relationTo;
                    if (hasManyValues) {
                        const results = [];
                        const resultPromises = [];
                        const createPopulationPromise = async (relatedDoc, i) => {
                            let id = relatedDoc;
                            let collectionSlug = field.relationTo;
                            if (isRelatedToManyCollections) {
                                collectionSlug = relatedDoc.relationTo;
                                id = relatedDoc.value;
                            }
                            const result = await context.req.payloadDataLoader.load(JSON.stringify([
                                collectionSlug,
                                id,
                                0,
                                0,
                                locale,
                                fallbackLocale,
                                false,
                                false,
                            ]));
                            if (result) {
                                if (isRelatedToManyCollections) {
                                    results[i] = {
                                        relationTo: collectionSlug,
                                        value: {
                                            ...result,
                                            collection: collectionSlug,
                                        },
                                    };
                                }
                                else {
                                    results[i] = result;
                                }
                            }
                        };
                        if (value) {
                            value.forEach((relatedDoc, i) => {
                                resultPromises.push(createPopulationPromise(relatedDoc, i));
                            });
                        }
                        await Promise.all(resultPromises);
                        return results;
                    }
                    let id = value;
                    if (isRelatedToManyCollections && value) {
                        id = value.value;
                        relatedCollectionSlug = value.relationTo;
                    }
                    if (id) {
                        id = id.toString();
                        const relatedDocument = await context.req.payloadDataLoader.load(JSON.stringify([
                            relatedCollectionSlug,
                            id,
                            0,
                            0,
                            locale,
                            fallbackLocale,
                            false,
                            false,
                        ]));
                        if (relatedDocument) {
                            if (isRelatedToManyCollections) {
                                return {
                                    relationTo: relatedCollectionSlug,
                                    value: {
                                        ...relatedDocument,
                                        collection: relatedCollectionSlug,
                                    },
                                };
                            }
                            return relatedDocument;
                        }
                        return null;
                    }
                    return null;
                },
            };
            return {
                ...objectTypeConfig,
                [field.name]: relationship,
            };
        },
        array: (objectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            const type = buildObjectType(payload, fullName, field.fields, fullName);
            const arrayType = new graphql_1.GraphQLList((0, withNullableType_1.default)(field, type));
            return {
                ...objectTypeConfig,
                [field.name]: { type: arrayType },
            };
        },
        group: (objectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            const type = buildObjectType(payload, fullName, field.fields, fullName);
            return {
                ...objectTypeConfig,
                [field.name]: { type },
            };
        },
        blocks: (objectTypeConfig, field) => {
            const blockTypes = field.blocks.map((block) => {
                (0, buildBlockType_1.default)(payload, block);
                return payload.types.blockTypes[block.slug];
            });
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            const type = new graphql_1.GraphQLList(new graphql_1.GraphQLUnionType({
                name: fullName,
                types: blockTypes,
                resolveType: (data) => payload.types.blockTypes[data.blockType].name,
            }));
            return {
                ...objectTypeConfig,
                [field.name]: { type },
            };
        },
        row: (objectTypeConfig, field) => field.fields.reduce((objectTypeConfigWithRowFields, subField) => {
            const addSubField = fieldToSchemaMap[subField.type];
            return addSubField(objectTypeConfigWithRowFields, subField);
        }, objectTypeConfig),
        collapsible: (objectTypeConfig, field) => field.fields.reduce((objectTypeConfigWithCollapsibleFields, subField) => {
            const addSubField = fieldToSchemaMap[subField.type];
            return addSubField(objectTypeConfigWithCollapsibleFields, subField);
        }, objectTypeConfig),
        tabs: (objectTypeConfig, field) => field.tabs.reduce((tabSchema, tab) => {
            return {
                ...tabSchema,
                ...tab.fields.reduce((subFieldSchema, subField) => {
                    const addSubField = fieldToSchemaMap[subField.type];
                    return addSubField(subFieldSchema, subField);
                }, tabSchema),
            };
        }, objectTypeConfig),
    };
    const objectSchema = {
        name,
        fields: () => fields.reduce((objectTypeConfig, field) => {
            const fieldSchema = fieldToSchemaMap[field.type];
            if (typeof fieldSchema !== 'function') {
                return objectTypeConfig;
            }
            return {
                ...objectTypeConfig,
                ...fieldSchema(objectTypeConfig, field),
            };
        }, baseFields),
    };
    const newlyCreatedBlockType = new graphql_1.GraphQLObjectType(objectSchema);
    return newlyCreatedBlockType;
}
exports.default = buildObjectType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRPYmplY3RUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2J1aWxkT2JqZWN0VHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUE0RDtBQUM1RCxxQ0FBcUM7QUFDckMseUNBQXlDO0FBQ3pDLHlDQUF5QztBQUN6Qyx5REFBZ0Q7QUFDaEQscUNBVWlCO0FBQ2pCLHFEQUF5RTtBQUV6RSx5RUFBaUQ7QUFDakQsdUZBQStEO0FBQy9ELDBFQUFrRDtBQUNsRCwrREFBdUQ7QUFDdkQsb0dBQTBGO0FBQzFGLCtFQUF1RDtBQUd2RCxnRkFBd0Q7QUFDeEQsc0VBQThDO0FBa0I5QyxTQUFTLGVBQWUsQ0FBQyxPQUFnQixFQUFFLElBQVksRUFBRSxNQUFlLEVBQUUsVUFBa0IsRUFBRSxhQUErQixFQUFFO0lBQzdILE1BQU0sZ0JBQWdCLEdBQUc7UUFDdkIsTUFBTSxFQUFFLENBQUMsZ0JBQWtDLEVBQUUsS0FBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuRSxHQUFHLGdCQUFnQjtZQUNuQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSxzQkFBWSxDQUFDLEVBQUU7U0FDOUQsQ0FBQztRQUNGLElBQUksRUFBRSxDQUFDLGdCQUFrQyxFQUFFLEtBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0QsR0FBRyxnQkFBZ0I7WUFDbkIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBQSwwQkFBZ0IsRUFBQyxLQUFLLEVBQUUsdUJBQWEsQ0FBQyxFQUFFO1NBQy9ELENBQUM7UUFDRixLQUFLLEVBQUUsQ0FBQyxnQkFBa0MsRUFBRSxLQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLEdBQUcsZ0JBQWdCO1lBQ25CLENBQUMsS0FBSyxDQUFDLElB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