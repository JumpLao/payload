"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const component = joi_1.default.alternatives().try(joi_1.default.object().unknown(), joi_1.default.func());
exports.default = joi_1.default.object({
    serverURL: joi_1.default.string()
        .uri()
        .allow('')
        .custom((value, helper) => {
        const urlWithoutProtocol = value.split('//')[1];
        if (!urlWithoutProtocol) {
            return helper.message({ custom: 'You need to include either "https://" or "http://" in your serverURL.' });
        }
        if (urlWithoutProtocol.indexOf('/') > -1) {
            return helper.message({ custom: 'Your serverURL cannot have a path. It can only contain a protocol, a domain, and an optional port.' });
        }
        return value;
    }),
    cookiePrefix: joi_1.default.string(),
    routes: joi_1.default.object({
        admin: joi_1.default.string(),
        api: joi_1.default.string(),
        graphQL: joi_1.default.string(),
        graphQLPlayground: joi_1.default.string(),
    }),
    typescript: joi_1.default.object({
        outputFile: joi_1.default.string(),
    }),
    collections: joi_1.default.array(),
    globals: joi_1.default.array(),
    admin: joi_1.default.object({
        user: joi_1.default.string(),
        meta: joi_1.default.object()
            .keys({
            titleSuffix: joi_1.default.string(),
            ogImage: joi_1.default.string(),
            favicon: joi_1.default.string(),
        }),
        disable: joi_1.default.bool(),
        indexHTML: joi_1.default.string(),
        css: joi_1.default.string(),
        dateFormat: joi_1.default.string(),
        components: joi_1.default.object()
            .keys({
            routes: joi_1.default.array()
                .items(joi_1.default.object().keys({
                Component: component.required(),
                path: joi_1.default.string().required(),
                exact: joi_1.default.bool(),
                strict: joi_1.default.bool(),
                sensitive: joi_1.default.bool(),
            })),
            providers: joi_1.default.array().items(component),
            beforeDashboard: joi_1.default.array().items(component),
            afterDashboard: joi_1.default.array().items(component),
            beforeLogin: joi_1.default.array().items(component),
            afterLogin: joi_1.default.array().items(component),
            beforeNavLinks: joi_1.default.array().items(component),
            afterNavLinks: joi_1.default.array().items(component),
            Nav: component,
            views: joi_1.default.object({
                Dashboard: component,
                Account: component,
            }),
            graphics: joi_1.default.object({
                Icon: component,
                Logo: component,
            }),
        }),
        webpack: joi_1.default.func(),
    }),
    defaultDepth: joi_1.default.number()
        .min(0)
        .max(30),
    maxDepth: joi_1.default.number()
        .min(0)
        .max(100),
    csrf: joi_1.default.array()
        .items(joi_1.default.string().allow(''))
        .sparse(),
    cors: [
        joi_1.default.string()
            .valid('*'),
        joi_1.default.array()
            .items(joi_1.default.string()),
    ],
    express: joi_1.default.object()
        .keys({
        json: joi_1.default.object(),
        compression: joi_1.default.object(),
        middleware: joi_1.default.array().items(joi_1.default.func()),
        preMiddleware: joi_1.default.array().items(joi_1.default.func()),
        postMiddleware: joi_1.default.array().items(joi_1.default.func()),
    }),
    local: joi_1.default.boolean(),
    upload: joi_1.default.object(),
    indexSortableFields: joi_1.default.boolean(),
    rateLimit: joi_1.default.object()
        .keys({
        window: joi_1.default.number(),
        max: joi_1.default.number(),
        trustProxy: joi_1.default.boolean(),
        skip: joi_1.default.func(),
    }),
    graphQL: joi_1.default.object()
        .keys({
        mutations: joi_1.default.function(),
        queries: joi_1.default.function(),
        maxComplexity: joi_1.default.number(),
        disablePlaygroundInProduction: joi_1.default.boolean(),
        disable: joi_1.default.boolean(),
        schemaOutputFile: joi_1.default.string(),
    }),
    localization: joi_1.default.alternatives()
        .try(joi_1.default.object().keys({
        locales: joi_1.default.array().items(joi_1.default.string()),
        defaultLocale: joi_1.default.string(),
        fallback: joi_1.default.boolean(),
    }), joi_1.default.boolean()),
    hooks: joi_1.default.object().keys({
        afterError: joi_1.default.func(),
    }),
    telemetry: joi_1.default.boolean(),
    plugins: joi_1.default.array().items(joi_1.default.func()),
    onInit: joi_1.default.func(),
    debug: joi_1.default.boolean(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBc0I7QUFFdEIsTUFBTSxTQUFTLEdBQUcsYUFBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FDdEMsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUN0QixhQUFHLENBQUMsSUFBSSxFQUFFLENBQ1gsQ0FBQztBQUVGLGtCQUFlLGFBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsU0FBUyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7U0FDcEIsR0FBRyxFQUFFO1NBQ0wsS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUNULE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN4QixNQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEQsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSx1RUFBdUUsRUFBRSxDQUFDLENBQUM7U0FDNUc7UUFFRCxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN4QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsb0dBQW9HLEVBQUUsQ0FBQyxDQUFDO1NBQ3pJO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7SUFDSixZQUFZLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtJQUMxQixNQUFNLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQixLQUFLLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtRQUNuQixHQUFHLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtR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