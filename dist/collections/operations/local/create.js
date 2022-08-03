"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFileByPath_1 = __importDefault(require("../../../uploads/getFileByPath"));
const create_1 = __importDefault(require("../create"));
const dataloader_1 = require("../../dataloader");
async function createLocal(payload, options) {
    var _a, _b, _c;
    const { collection: collectionSlug, depth, locale, fallbackLocale, data, user, overrideAccess = true, disableVerificationEmail, showHiddenFields, filePath, file, overwriteExistingFiles = false, req: incomingReq, draft, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        ...incomingReq || {},
        user,
        payloadAPI: 'local',
        locale: locale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.locale) || (((_a = payload === null || payload === void 0 ? void 0 : payload.config) === null || _a === void 0 ? void 0 : _a.localization) ? (_c = (_b = payload === null || payload === void 0 ? void 0 : payload.config) === null || _b === void 0 ? void 0 : _b.localization) === null || _c === void 0 ? void 0 : _c.defaultLocale : null),
        fallbackLocale: fallbackLocale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.fallbackLocale) || null,
        payload,
        files: {
            file: file !== null && file !== void 0 ? file : (0, getFileByPath_1.default)(filePath),
        },
    };
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    return (0, create_1.default)({
        depth,
        data,
        collection,
        overrideAccess,
        disableVerificationEmail,
        showHiddenFields,
        overwriteExistingFiles,
        draft,
        req,
    });
}
exports.default = createLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvbG9jYWwvY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsbUZBQTJEO0FBQzNELHVEQUErQjtBQUUvQixpREFBaUQ7QUFvQmxDLEtBQUssVUFBVSxXQUFXLENBQVUsT0FBZ0IsRUFBRSxPQUFtQjs7SUFDdEYsTUFBTSxFQUNKLFVBQVUsRUFBRSxjQUFjLEVBQzFCLEtBQUssRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUNkLElBQUksRUFDSixJQUFJLEVBQ0osY0FBYyxHQUFHLElBQUksRUFDckIsd0JBQXdCLEVBQ3hCLGdCQUFnQixFQUNoQixRQUFRLEVBQ1IsSUFBSSxFQUNKLHNCQUFzQixHQUFHLEtBQUssRUFDOUIsR0FBRyxFQUFFLFdBQVcsRUFDaEIsS0FBSyxHQUNOLEdBQUcsT0FBTyxDQUFDO0lBRVosTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV2RCxNQUFNLEdBQUcsR0FBRztRQUNWLEdBQUcsV0FBVyxJQUFJLEVBQUU7UUFDcEIsSUFBSTtRQUNKLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRSxNQUFNLEtBQUksV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE1BQU0sQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsTUFBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksMENBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUgsY0FBYyxFQUFFLGNBQWMsS0FBSSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsY0FBYyxDQUFBLElBQUksSUFBSTtRQUNyRSxPQUFPO1FBQ1AsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLElBQUksYUFBSixJQUFJLGNBQUosSUFBSSxHQUFJLElBQUEsdUJBQWEsRUFBQyxRQUFRLENBQUM7U0FDdEM7S0FDZ0IsQ0FBQztJQUVwQixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtRQUFFLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFBLDBCQUFhLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFFdkUsT0FBTyxJQUFBLGdCQUFNLEVBQUM7UUFDWixLQUFLO1FBQ0wsSUFBSTtRQUNKLFVBQVU7UUFDVixjQUFjO1FBQ2Qsd0JBQXdCO1FBQ3hCLGdCQUFnQjtRQUNoQixzQkFBc0I7UUFDdEIsS0FBSztRQUNMLEdBQUc7S0FDSixDQUFDLENBQUM7QUFDTCxDQUFDO0FBN0NELDhCQTZDQyJ9