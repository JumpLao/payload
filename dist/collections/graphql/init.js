"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const graphql_scalars_1 = require("graphql-scalars");
const graphql_1 = require("graphql");
const formatName_1 = __importDefault(require("../../graphql/utilities/formatName"));
const buildPaginatedListType_1 = __importDefault(require("../../graphql/schema/buildPaginatedListType"));
const buildMutationInputType_1 = __importStar(require("../../graphql/schema/buildMutationInputType"));
const buildCollectionFields_1 = require("../../versions/buildCollectionFields");
const create_1 = __importDefault(require("./resolvers/create"));
const update_1 = __importDefault(require("./resolvers/update"));
const find_1 = __importDefault(require("./resolvers/find"));
const findByID_1 = __importDefault(require("./resolvers/findByID"));
const findVersionByID_1 = __importDefault(require("./resolvers/findVersionByID"));
const findVersions_1 = __importDefault(require("./resolvers/findVersions"));
const restoreVersion_1 = __importDefault(require("./resolvers/restoreVersion"));
const me_1 = __importDefault(require("../../auth/graphql/resolvers/me"));
const init_1 = __importDefault(require("../../auth/graphql/resolvers/init"));
const login_1 = __importDefault(require("../../auth/graphql/resolvers/login"));
const logout_1 = __importDefault(require("../../auth/graphql/resolvers/logout"));
const forgotPassword_1 = __importDefault(require("../../auth/graphql/resolvers/forgotPassword"));
const resetPassword_1 = __importDefault(require("../../auth/graphql/resolvers/resetPassword"));
const verifyEmail_1 = __importDefault(require("../../auth/graphql/resolvers/verifyEmail"));
const unlock_1 = __importDefault(require("../../auth/graphql/resolvers/unlock"));
const refresh_1 = __importDefault(require("../../auth/graphql/resolvers/refresh"));
const types_1 = require("../../fields/config/types");
const buildObjectType_1 = __importDefault(require("../../graphql/schema/buildObjectType"));
const buildWhereInputType_1 = __importDefault(require("../../graphql/schema/buildWhereInputType"));
const delete_1 = __importDefault(require("./resolvers/delete"));
function initCollectionsGraphQL(payload) {
    Object.keys(payload.collections).forEach((slug) => {
        const collection = payload.collections[slug];
        const { config: { labels: { singular, plural, }, fields, timestamps, }, } = collection;
        const singularLabel = (0, formatName_1.default)(singular);
        let pluralLabel = (0, formatName_1.default)(plural);
        // For collections named 'Media' or similar,
        // there is a possibility that the singular name
        // will equal the plural name. Append `all` to the beginning
        // of potential conflicts
        if (singularLabel === pluralLabel) {
            pluralLabel = `all${singularLabel}`;
        }
        collection.graphQL = {};
        const idField = fields.find((field) => (0, types_1.fieldAffectsData)(field) && field.name === 'id');
        const idType = (0, buildMutationInputType_1.getCollectionIDType)(collection.config);
        const baseFields = {};
        const whereInputFields = [
            ...fields,
        ];
        if (!idField) {
            baseFields.id = { type: idType };
            whereInputFields.push({
                name: 'id',
                type: 'text',
            });
        }
        if (timestamps) {
            baseFields.createdAt = {
                type: new graphql_1.GraphQLNonNull(graphql_scalars_1.DateTimeResolver),
            };
            baseFields.updatedAt = {
                type: new graphql_1.GraphQLNonNull(graphql_scalars_1.DateTimeResolver),
            };
            whereInputFields.push({
                name: 'createdAt',
                label: 'Created At',
                type: 'date',
            });
            whereInputFields.push({
                name: 'updatedAt',
                label: 'Updated At',
                type: 'date',
            });
        }
        collection.graphQL.type = (0, buildObjectType_1.default)(payload, singularLabel, fields, singularLabel, baseFields);
        collection.graphQL.whereInputType = (0, buildWhereInputType_1.default)(singularLabel, whereInputFields, singularLabel);
        if (collection.config.auth) {
            fields.push({
                name: 'password',
                label: 'Password',
                type: 'text',
                required: true,
            });
        }
        collection.graphQL.mutationInputType = new graphql_1.GraphQLNonNull((0, buildMutationInputType_1.default)(payload, singularLabel, fields, singularLabel));
        collection.graphQL.updateMutationInputType = new graphql_1.GraphQLNonNull((0, buildMutationInputType_1.default)(payload, `${singularLabel}Update`, fields.filter((field) => !((0, types_1.fieldAffectsData)(field) && field.name === 'id')), `${singularLabel}Update`, true));
        payload.Query.fields[singularLabel] = {
            type: collection.graphQL.type,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(idType) },
                draft: { type: graphql_1.GraphQLBoolean },
                ...(payload.config.localization ? {
                    locale: { type: payload.types.localeInputType },
                    fallbackLocale: { type: payload.types.fallbackLocaleInputType },
                } : {}),
            },
            resolve: (0, findByID_1.default)(collection),
        };
        payload.Query.fields[pluralLabel] = {
            type: (0, buildPaginatedListType_1.default)(pluralLabel, collection.graphQL.type),
            args: {
                where: { type: collection.graphQL.whereInputType },
                draft: { type: graphql_1.GraphQLBoolean },
                ...(payload.config.localization ? {
                    locale: { type: payload.types.localeInputType },
                    fallbackLocale: { type: payload.types.fallbackLocaleInputType },
                } : {}),
                page: { type: graphql_1.GraphQLInt },
                limit: { type: graphql_1.GraphQLInt },
                sort: { type: graphql_1.GraphQLString },
            },
            resolve: (0, find_1.default)(collection),
        };
        payload.Mutation.fields[`create${singularLabel}`] = {
            type: collection.graphQL.type,
            args: {
                data: { type: collection.graphQL.mutationInputType },
                draft: { type: graphql_1.GraphQLBoolean },
            },
            resolve: (0, create_1.default)(collection),
        };
        payload.Mutation.fields[`update${singularLabel}`] = {
            type: collection.graphQL.type,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(idType) },
                data: { type: collection.graphQL.updateMutationInputType },
                draft: { type: graphql_1.GraphQLBoolean },
                autosave: { type: graphql_1.GraphQLBoolean },
            },
            resolve: (0, update_1.default)(collection),
        };
        payload.Mutation.fields[`delete${singularLabel}`] = {
            type: collection.graphQL.type,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(idType) },
            },
            resolve: (0, delete_1.default)(collection),
        };
        if (collection.config.versions) {
            const versionCollectionFields = [
                ...(0, buildCollectionFields_1.buildVersionCollectionFields)(collection.config),
                {
                    name: 'id',
                    type: 'text',
                },
                {
                    name: 'createdAt',
                    label: 'Created At',
                    type: 'date',
                },
                {
                    name: 'updatedAt',
                    label: 'Updated At',
                    type: 'date',
                },
            ];
            collection.graphQL.versionType = (0, buildObjectType_1.default)(payload, `${singularLabel}Version`, versionCollectionFields, `${singularLabel}Version`, {});
            payload.Query.fields[`version${(0, formatName_1.default)(singularLabel)}`] = {
                type: collection.graphQL.versionType,
                args: {
                    id: { type: graphql_1.GraphQLString },
                    ...(payload.config.localization ? {
                        locale: { type: payload.types.localeInputType },
                        fallbackLocale: { type: payload.types.fallbackLocaleInputType },
                    } : {}),
                },
                resolve: (0, findVersionByID_1.default)(collection),
            };
            payload.Query.fields[`versions${pluralLabel}`] = {
                type: (0, buildPaginatedListType_1.default)(`versions${(0, formatName_1.default)(pluralLabel)}`, collection.graphQL.versionType),
                args: {
                    where: {
                        type: (0, buildWhereInputType_1.default)(`versions${singularLabel}`, versionCollectionFields, `versions${singularLabel}`),
                    },
                    ...(payload.config.localization ? {
                        locale: { type: payload.types.localeInputType },
                        fallbackLocale: { type: payload.types.fallbackLocaleInputType },
                    } : {}),
                    page: { type: graphql_1.GraphQLInt },
                    limit: { type: graphql_1.GraphQLInt },
                    sort: { type: graphql_1.GraphQLString },
                },
                resolve: (0, findVersions_1.default)(collection),
            };
            payload.Mutation.fields[`restoreVersion${(0, formatName_1.default)(singularLabel)}`] = {
                type: collection.graphQL.type,
                args: {
                    id: { type: graphql_1.GraphQLString },
                },
                resolve: (0, restoreVersion_1.default)(collection),
            };
        }
        if (collection.config.auth) {
            collection.graphQL.JWT = (0, buildObjectType_1.default)(payload, (0, formatName_1.default)(`${slug}JWT`), collection.config.fields.filter((field) => (0, types_1.fieldAffectsData)(field) && field.saveToJWT).concat([
                {
                    name: 'email',
                    type: 'email',
                    required: true,
                },
                {
                    name: 'collection',
                    type: 'text',
                    required: true,
                },
            ]), (0, formatName_1.default)(`${slug}JWT`));
            payload.Query.fields[`me${singularLabel}`] = {
                type: new graphql_1.GraphQLObjectType({
                    name: (0, formatName_1.default)(`${slug}Me`),
                    fields: {
                        token: {
                            type: graphql_1.GraphQLString,
                        },
                        user: {
                            type: collection.graphQL.type,
                        },
                        exp: {
                            type: graphql_1.GraphQLInt,
                        },
                        collection: {
                            type: graphql_1.GraphQLString,
                        },
                    },
                }),
                resolve: (0, me_1.default)(collection),
            };
            payload.Query.fields[`initialized${singularLabel}`] = {
                type: graphql_1.GraphQLBoolean,
                resolve: (0, init_1.default)(collection),
            };
            payload.Mutation.fields[`refreshToken${singularLabel}`] = {
                type: new graphql_1.GraphQLObjectType({
                    name: (0, formatName_1.default)(`${slug}Refreshed${singularLabel}`),
                    fields: {
                        user: {
                            type: collection.graphQL.JWT,
                        },
                        refreshedToken: {
                            type: graphql_1.GraphQLString,
                        },
                        exp: {
                            type: graphql_1.GraphQLInt,
                        },
                    },
                }),
                args: {
                    token: { type: graphql_1.GraphQLString },
                },
                resolve: (0, refresh_1.default)(collection),
            };
            payload.Mutation.fields[`logout${singularLabel}`] = {
                type: graphql_1.GraphQLString,
                resolve: (0, logout_1.default)(collection),
            };
            if (!collection.config.auth.disableLocalStrategy) {
                if (collection.config.auth.maxLoginAttempts > 0) {
                    payload.Mutation.fields[`unlock${singularLabel}`] = {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
                        args: {
                            email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                        },
                        resolve: (0, unlock_1.default)(collection),
                    };
                }
                payload.Mutation.fields[`login${singularLabel}`] = {
                    type: new graphql_1.GraphQLObjectType({
                        name: (0, formatName_1.default)(`${slug}LoginResult`),
                        fields: {
                            token: {
                                type: graphql_1.GraphQLString,
                            },
                            user: {
                                type: collection.graphQL.type,
                            },
                            exp: {
                                type: graphql_1.GraphQLInt,
                            },
                        },
                    }),
                    args: {
                        email: { type: graphql_1.GraphQLString },
                        password: { type: graphql_1.GraphQLString },
                    },
                    resolve: (0, login_1.default)(collection),
                };
                payload.Mutation.fields[`forgotPassword${singularLabel}`] = {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
                    args: {
                        email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                        disableEmail: { type: graphql_1.GraphQLBoolean },
                        expiration: { type: graphql_1.GraphQLInt },
                    },
                    resolve: (0, forgotPassword_1.default)(collection),
                };
                payload.Mutation.fields[`resetPassword${singularLabel}`] = {
                    type: new graphql_1.GraphQLObjectType({
                        name: (0, formatName_1.default)(`${slug}ResetPassword`),
                        fields: {
                            token: { type: graphql_1.GraphQLString },
                            user: { type: collection.graphQL.type },
                        },
                    }),
                    args: {
                        token: { type: graphql_1.GraphQLString },
                        password: { type: graphql_1.GraphQLString },
                    },
                    resolve: (0, resetPassword_1.default)(collection),
                };
                payload.Mutation.fields[`verifyEmail${singularLabel}`] = {
                    type: graphql_1.GraphQLBoolean,
                    args: {
                        token: { type: graphql_1.GraphQLString },
                    },
                    resolve: (0, verifyEmail_1.default)(collection),
                };
            }
        }
    });
}
exports.default = initCollectionsGraphQL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb2xsZWN0aW9ucy9ncmFwaHFsL2luaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxxREFBbUQ7QUFDbkQscUNBTWlCO0FBRWpCLG9GQUE0RDtBQUM1RCx5R0FBaUY7QUFDakYsc0dBQTBHO0FBQzFHLGdGQUFvRjtBQUNwRixnRUFBZ0Q7QUFDaEQsZ0VBQWdEO0FBQ2hELDREQUE0QztBQUM1QyxvRUFBb0Q7QUFDcEQsa0ZBQWtFO0FBQ2xFLDRFQUE0RDtBQUM1RCxnRkFBZ0U7QUFDaEUseUVBQWlEO0FBQ2pELDZFQUFxRDtBQUNyRCwrRUFBdUQ7QUFDdkQsaUZBQXlEO0FBQ3pELGlHQUF5RTtBQUN6RSwrRkFBdUU7QUFDdkUsMkZBQW1FO0FBQ25FLGlGQUF5RDtBQUN6RCxtRkFBMkQ7QUFFM0QscURBQW9FO0FBQ3BFLDJGQUF5RjtBQUN6RixtR0FBMkU7QUFDM0UsZ0VBQW1EO0FBRW5ELFNBQVMsc0JBQXNCLENBQUMsT0FBZ0I7SUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLEVBQ0osTUFBTSxFQUFFLEVBQ04sTUFBTSxFQUFFLEVBQ04sUUFBUSxFQUNSLE1BQU0sR0FDUCxFQUNELE1BQU0sRUFDTixVQUFVLEdBQ1gsR0FDRixHQUFHLFVBQVUsQ0FBQztRQUVmLE1BQU0sYUFBYSxHQUFHLElBQUEsb0JBQVUsRUFBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxJQUFJLFdBQVcsR0FBRyxJQUFBLG9CQUFVLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFFckMsNENBQTRDO1FBQzVDLGdEQUFnRDtRQUNoRCw0REFBNEQ7UUFDNUQseUJBQXlCO1FBRXpCLElBQUksYUFBYSxLQUFLLFdBQVcsRUFBRTtZQUNqQyxXQUFXLEdBQUcsTUFBTSxhQUFhLEVBQUUsQ0FBQztTQUNyQztRQUVELFVBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBUyxDQUFDO1FBRS9CLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsd0JBQWdCLEVBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztRQUN2RixNQUFNLE1BQU0sR0FBRyxJQUFBLDRDQUFtQixFQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0RCxNQUFNLFVBQVUsR0FBcUIsRUFBRSxDQUFDO1FBRXhDLE1BQU0sZ0JBQWdCLEdBQUc7WUFDdkIsR0FBRyxNQUFNO1NBQ1YsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ2pDLGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDcEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLE1BQU07YUFDYixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLFNBQVMsR0FBRztnQkFDckIsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxrQ0FBZ0IsQ0FBQzthQUMzQyxDQUFDO1lBRUYsVUFBVSxDQUFDLFNBQVMsR0FBRztnQkFDckIsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxrQ0FBZ0IsQ0FBQzthQUMzQyxDQUFDO1lBRUYsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2dCQUNwQixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQyxDQUFDO1lBRUgsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2dCQUNwQixJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFBLHlCQUFlLEVBQ3ZDLE9BQU8sRUFDUCxhQUFhLEVBQ2IsTUFBTSxFQUNOLGFBQWEsRUFDYixVQUFVLENBQ1gsQ0FBQztRQUVGLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLElBQUEsNkJBQW1CLEVBQ3JELGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsYUFBYSxDQUNkLENBQUM7UUFFRixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLEtBQUssRUFBRSxVQUFVO2dCQUNqQixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmLENBQUMsQ0FBQztTQUNKO1FBRUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBQSxnQ0FBc0IsRUFDOUUsT0FBTyxFQUNQLGFBQWEsRUFDYixNQUFNLEVBQ04sYUFBYSxDQUNkLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEdBQUcsSUFBSSx3QkFBYyxDQUFDLElBQUEsZ0NBQXNCLEVBQ3BGLE9BQU8sRUFDUCxHQUFHLGFBQWEsUUFBUSxFQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQzNFLEdBQUcsYUFBYSxRQUFRLEVBQ3hCLElBQUksQ0FDTCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRztZQUNwQyxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQzdCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0JBQWMsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO29CQUMvQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRTtpQkFDaEUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ1I7WUFDRCxPQUFPLEVBQUUsSUFBQSxrQkFBZ0IsRUFBQyxVQUFVLENBQUM7U0FDdEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHO1lBQ2xDLElBQUksRUFBRSxJQUFBLGdDQUFzQixFQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNsRSxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO2dCQUNsRCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0JBQWMsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO29CQUMvQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRTtpQkFDaEUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO2dCQUMxQixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtnQkFDM0IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7YUFDOUI7WUFDRCxPQUFPLEVBQUUsSUFBQSxjQUFZLEVBQUMsVUFBVSxDQUFDO1NBQ2xDLENBQUM7UUFFRixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGFBQWEsRUFBRSxDQUFDLEdBQUc7WUFDbEQsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUM3QixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3BELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSx3QkFBYyxFQUFFO2FBQ2hDO1lBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQWMsRUFBQyxVQUFVLENBQUM7U0FDcEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsYUFBYSxFQUFFLENBQUMsR0FBRztZQUNsRCxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQzdCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRTtnQkFDMUQsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLHdCQUFjLEVBQUU7Z0JBQy9CLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSx3QkFBYyxFQUFFO2FBQ25DO1lBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQWMsRUFBQyxVQUFVLENBQUM7U0FDcEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsYUFBYSxFQUFFLENBQUMsR0FBRztZQUNsRCxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQzdCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ3pDO1lBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQWlCLEVBQUMsVUFBVSxDQUFDO1NBQ3ZDLENBQUM7UUFFRixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzlCLE1BQU0sdUJBQXVCLEdBQVk7Z0JBQ3ZDLEdBQUcsSUFBQSxvREFBNEIsRUFBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2dCQUNsRDtvQkFDRSxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsV0FBVztvQkFDakIsS0FBSyxFQUFFLFlBQVk7b0JBQ25CLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNEO29CQUNFLElBQUksRUFBRSxXQUFXO29CQUNqQixLQUFLLEVBQUUsWUFBWTtvQkFDbkIsSUFBSSxFQUFFLE1BQU07aUJBQ2I7YUFDRixDQUFDO1lBQ0YsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBQSx5QkFBZSxFQUM5QyxPQUFPLEVBQ1AsR0FBRyxhQUFhLFNBQVMsRUFDekIsdUJBQXVCLEVBQ3ZCLEdBQUcsYUFBYSxTQUFTLEVBQ3pCLEVBQUUsQ0FDSCxDQUFDO1lBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFBLG9CQUFVLEVBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHO2dCQUM1RCxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUNwQyxJQUFJLEVBQUU7b0JBQ0osRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7b0JBQzNCLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTt3QkFDL0MsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUU7cUJBQ2hFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDUjtnQkFDRCxPQUFPLEVBQUUsSUFBQSx5QkFBdUIsRUFBQyxVQUFVLENBQUM7YUFDN0MsQ0FBQztZQUNGLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsV0FBVyxFQUFFLENBQUMsR0FBRztnQkFDL0MsSUFBSSxFQUFFLElBQUEsZ0NBQXNCLEVBQUMsV0FBVyxJQUFBLG9CQUFVLEVBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztnQkFDbEcsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsSUFBQSw2QkFBbUIsRUFDdkIsV0FBVyxhQUFhLEVBQUUsRUFDMUIsdUJBQXVCLEVBQ3ZCLFdBQVcsYUFBYSxFQUFFLENBQzNCO3FCQUNGO29CQUNELEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTt3QkFDL0MsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUU7cUJBQ2hFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtvQkFDMUIsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFVLEVBQUU7b0JBQzNCLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO2lCQUM5QjtnQkFDRCxPQUFPLEVBQUUsSUFBQSxzQkFBb0IsRUFBQyxVQUFVLENBQUM7YUFDMUMsQ0FBQztZQUNGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFpQixJQUFBLG9CQUFVLEVBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHO2dCQUN0RSxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUM3QixJQUFJLEVBQUU7b0JBQ0osRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7aUJBQzVCO2dCQUNELE9BQU8sRUFBRSxJQUFBLHdCQUFzQixFQUFDLFVBQVUsQ0FBQzthQUM1QyxDQUFDO1NBQ0g7UUFFRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQzFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUEseUJBQWUsRUFDdEMsT0FBTyxFQUNQLElBQUEsb0JBQVUsRUFBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQ3hCLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUM1RjtvQkFDRSxJQUFJLEVBQUUsT0FBTztvQkFDYixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsWUFBWTtvQkFDbEIsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLElBQUk7aUJBQ2Y7YUFDRixDQUFDLEVBQ0YsSUFBQSxvQkFBVSxFQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FDekIsQ0FBQztZQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssYUFBYSxFQUFFLENBQUMsR0FBRztnQkFDM0MsSUFBSSxFQUFFLElBQUksMkJBQWlCLENBQUM7b0JBQzFCLElBQUksRUFBRSxJQUFBLG9CQUFVLEVBQUMsR0FBRyxJQUFJLElBQUksQ0FBQztvQkFDN0IsTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRTs0QkFDTCxJQUFJLEVBQUUsdUJBQWE7eUJBQ3BCO3dCQUNELElBQUksRUFBRTs0QkFDSixJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO3lCQUM5Qjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsSUFBSSxFQUFFLG9CQUFVO3lCQUNqQjt3QkFDRCxVQUFVLEVBQUU7NEJBQ1YsSUFBSSxFQUFFLHVCQUFhO3lCQUNwQjtxQkFDRjtpQkFDRixDQUFDO2dCQUNGLE9BQU8sRUFBRSxJQUFBLFlBQUUsRUFBQyxVQUFVLENBQUM7YUFDeEIsQ0FBQztZQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsYUFBYSxFQUFFLENBQUMsR0FBRztnQkFDcEQsSUFBSSxFQUFFLHdCQUFjO2dCQUNwQixPQUFPLEVBQUUsSUFBQSxjQUFJLEVBQUMsVUFBVSxDQUFDO2FBQzFCLENBQUM7WUFFRixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLGFBQWEsRUFBRSxDQUFDLEdBQUc7Z0JBQ3hELElBQUksRUFBRSxJQUFJLDJCQUFpQixDQUFDO29CQUMxQixJQUFJLEVBQUUsSUFBQSxvQkFBVSxFQUFDLEdBQUcsSUFBSSxZQUFZLGFBQWEsRUFBRSxDQUFDO29CQUNwRCxNQUFNLEVBQUU7d0JBQ04sSUFBSSxFQUFFOzRCQUNKLElBQUksRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUc7eUJBQzdCO3dCQUNELGNBQWMsRUFBRTs0QkFDZCxJQUFJLEVBQUUsdUJBQWE7eUJBQ3BCO3dCQUNELEdBQUcsRUFBRTs0QkFDSCxJQUFJLEVBQUUsb0JBQVU7eUJBQ2pCO3FCQUNGO2lCQUNGLENBQUM7Z0JBQ0YsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsSUFBQSxpQkFBTyxFQUFDLFVBQVUsQ0FBQzthQUM3QixDQUFDO1lBRUYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxhQUFhLEVBQUUsQ0FBQyxHQUFHO2dCQUNsRCxJQUFJLEVBQUUsdUJBQWE7Z0JBQ25CLE9BQU8sRUFBRSxJQUFBLGdCQUFNLEVBQUMsVUFBVSxDQUFDO2FBQzVCLENBQUM7WUFFRixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ2hELElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFO29CQUMvQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGFBQWEsRUFBRSxDQUFDLEdBQUc7d0JBQ2xELElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsd0JBQWMsQ0FBQzt3QkFDeEMsSUFBSSxFQUFFOzRCQUNKLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsdUJBQWEsQ0FBQyxFQUFFO3lCQUNuRDt3QkFDRCxPQUFPLEVBQUUsSUFBQSxnQkFBTSxFQUFDLFVBQVUsQ0FBQztxQkFDNUIsQ0FBQztpQkFDSDtnQkFFRCxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLGFBQWEsRUFBRSxDQUFDLEdBQUc7b0JBQ2pELElBQUksRUFBRSxJQUFJLDJCQUFpQixDQUFDO3dCQUMxQixJQUFJLEVBQUUsSUFBQSxvQkFBVSxFQUFDLEdBQUcsSUFBSSxhQUFhLENBQUM7d0JBQ3RDLE1BQU0sRUFBRTs0QkFDTixLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLHVCQUFhOzZCQUNwQjs0QkFDRCxJQUFJLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSTs2QkFDOUI7NEJBQ0QsR0FBRyxFQUFFO2dDQUNILElBQUksRUFBRSxvQkFBVTs2QkFDakI7eUJBQ0Y7cUJBQ0YsQ0FBQztvQkFDRixJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7d0JBQzlCLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO3FCQUNsQztvQkFDRCxPQUFPLEVBQUUsSUFBQSxlQUFLLEVBQUMsVUFBVSxDQUFDO2lCQUMzQixDQUFDO2dCQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFpQixhQUFhLEVBQUUsQ0FBQyxHQUFHO29CQUMxRCxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHdCQUFjLENBQUM7b0JBQ3hDLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHVCQUFhLENBQUMsRUFBRTt3QkFDbEQsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLHdCQUFjLEVBQUU7d0JBQ3RDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO3FCQUNqQztvQkFDRCxPQUFPLEVBQUUsSUFBQSx3QkFBYyxFQUFDLFVBQVUsQ0FBQztpQkFDcEMsQ0FBQztnQkFFRixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsYUFBYSxFQUFFLENBQUMsR0FBRztvQkFDekQsSUFBSSxFQUFFLElBQUksMkJBQWlCLENBQUM7d0JBQzFCLElBQUksRUFBRSxJQUFBLG9CQUFVLEVBQUMsR0FBRyxJQUFJLGVBQWUsQ0FBQzt3QkFDeEMsTUFBTSxFQUFFOzRCQUNOLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFOzRCQUM5QixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7eUJBQ3hDO3FCQUNGLENBQUM7b0JBQ0YsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO3dCQUM5QixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTtxQkFDbEM7b0JBQ0QsT0FBTyxFQUFFLElBQUEsdUJBQWEsRUFBQyxVQUFVLENBQUM7aUJBQ25DLENBQUM7Z0JBRUYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxhQUFhLEVBQUUsQ0FBQyxHQUFHO29CQUN2RCxJQUFJLEVBQUUsd0JBQWM7b0JBQ3BCLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTtxQkFDL0I7b0JBQ0QsT0FBTyxFQUFFLElBQUEscUJBQVcsRUFBQyxVQUFVLENBQUM7aUJBQ2pDLENBQUM7YUFDSDtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsa0JBQWUsc0JBQXNCLENBQUMifQ==