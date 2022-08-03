"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const is_plain_object_1 = require("is-plain-object");
const sanitize_1 = __importDefault(require("../../fields/config/sanitize"));
const toKebabCase_1 = __importDefault(require("../../utilities/toKebabCase"));
const auth_1 = __importDefault(require("../../auth/baseFields/auth"));
const apiKey_1 = __importDefault(require("../../auth/baseFields/apiKey"));
const verification_1 = __importDefault(require("../../auth/baseFields/verification"));
const accountLock_1 = __importDefault(require("../../auth/baseFields/accountLock"));
const getBaseFields_1 = __importDefault(require("../../uploads/getBaseFields"));
const formatLabels_1 = require("../../utilities/formatLabels");
const defaults_1 = require("./defaults");
const defaults_2 = require("../../versions/defaults");
const baseFields_1 = __importDefault(require("../../versions/baseFields"));
const TimestampsRequired_1 = __importDefault(require("../../errors/TimestampsRequired"));
const mergeBaseFields_1 = __importDefault(require("../../fields/mergeBaseFields"));
const sanitizeCollection = (config, collection) => {
    // /////////////////////////////////
    // Make copy of collection config
    // /////////////////////////////////
    const sanitized = (0, deepmerge_1.default)(defaults_1.defaults, collection, {
        isMergeableObject: is_plain_object_1.isPlainObject,
    });
    sanitized.slug = (0, toKebabCase_1.default)(sanitized.slug);
    sanitized.labels = sanitized.labels || (0, formatLabels_1.formatLabels)(sanitized.slug);
    if (sanitized.versions) {
        if (sanitized.versions === true)
            sanitized.versions = { drafts: false };
        if (sanitized.timestamps === false) {
            throw new TimestampsRequired_1.default(collection);
        }
        if (sanitized.versions.drafts) {
            if (sanitized.versions.drafts === true) {
                sanitized.versions.drafts = {
                    autosave: false,
                };
            }
            if (sanitized.versions.drafts.autosave === true)
                sanitized.versions.drafts.autosave = {};
            const versionFields = (0, mergeBaseFields_1.default)(sanitized.fields, baseFields_1.default);
            sanitized.fields = [
                ...versionFields,
                ...sanitized.fields,
            ];
        }
        sanitized.versions = (0, deepmerge_1.default)(defaults_2.versionCollectionDefaults, sanitized.versions);
    }
    if (sanitized.upload) {
        if (sanitized.upload === true)
            sanitized.upload = {};
        sanitized.upload.staticDir = sanitized.upload.staticDir || sanitized.slug;
        sanitized.upload.staticURL = sanitized.upload.staticURL || `/${sanitized.slug}`;
        sanitized.admin.useAsTitle = (sanitized.admin.useAsTitle && sanitized.admin.useAsTitle !== 'id') ? sanitized.admin.useAsTitle : 'filename';
        let uploadFields = (0, getBaseFields_1.default)({
            config,
            collection: sanitized,
        });
        uploadFields = (0, mergeBaseFields_1.default)(sanitized.fields, uploadFields);
        sanitized.fields = [
            ...uploadFields,
            ...sanitized.fields,
        ];
    }
    if (sanitized.auth) {
        sanitized.auth = (0, deepmerge_1.default)(defaults_1.authDefaults, typeof sanitized.auth === 'object' ? sanitized.auth : {}, {
            isMergeableObject: is_plain_object_1.isPlainObject,
        });
        let authFields = [];
        if (sanitized.auth.useAPIKey) {
            authFields = authFields.concat(apiKey_1.default);
        }
        if (!sanitized.auth.disableLocalStrategy) {
            authFields = authFields.concat(auth_1.default);
            if (sanitized.auth.verify) {
                if (sanitized.auth.verify === true)
                    sanitized.auth.verify = {};
                authFields = authFields.concat(verification_1.default);
            }
            if (sanitized.auth.maxLoginAttempts > 0) {
                authFields = authFields.concat(accountLock_1.default);
            }
        }
        authFields = (0, mergeBaseFields_1.default)(sanitized.fields, authFields);
        sanitized.fields = [
            ...authFields,
            ...sanitized.fields,
        ];
    }
    // /////////////////////////////////
    // Sanitize fields
    // /////////////////////////////////
    const validRelationships = config.collections.map((c) => c.slug);
    sanitized.fields = (0, sanitize_1.default)(sanitized.fields, validRelationships);
    return sanitized;
};
exports.default = sanitizeCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29sbGVjdGlvbnMvY29uZmlnL3Nhbml0aXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQThCO0FBQzlCLHFEQUFnRDtBQUVoRCw0RUFBMEQ7QUFDMUQsOEVBQXNEO0FBQ3RELHNFQUF3RDtBQUN4RCwwRUFBNEQ7QUFDNUQsc0ZBQXdFO0FBQ3hFLG9GQUFzRTtBQUN0RSxnRkFBOEQ7QUFDOUQsK0RBQTREO0FBQzVELHlDQUFvRDtBQUVwRCxzREFBb0U7QUFDcEUsMkVBQTBEO0FBQzFELHlGQUFpRTtBQUNqRSxtRkFBMkQ7QUFFM0QsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxVQUE0QixFQUE2QixFQUFFO0lBQ3JHLG9DQUFvQztJQUNwQyxpQ0FBaUM7SUFDakMsb0NBQW9DO0lBRXBDLE1BQU0sU0FBUyxHQUFxQixJQUFBLG1CQUFLLEVBQUMsbUJBQVEsRUFBRSxVQUFVLEVBQUU7UUFDOUQsaUJBQWlCLEVBQUUsK0JBQWE7S0FDakMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFBLHFCQUFXLEVBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxJQUFBLDJCQUFZLEVBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBFLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRTtRQUN0QixJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssSUFBSTtZQUFFLFNBQVMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFFeEUsSUFBSSxTQUFTLENBQUMsVUFBVSxLQUFLLEtBQUssRUFBRTtZQUNsQyxNQUFNLElBQUksNEJBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLFNB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