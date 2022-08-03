"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_1 = __importDefault(require("../find"));
const dataloader_1 = require("../../dataloader");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findLocal(payload, options) {
    var _a, _b, _c, _d;
    const { collection: collectionSlug, depth, currentDepth, page, limit, where, locale = payload.config.localization ? (_a = payload.config.localization) === null || _a === void 0 ? void 0 : _a.defaultLocale : null, fallbackLocale = null, user, overrideAccess = true, disableErrors, showHiddenFields, sort, draft = false, pagination = true, req: incomingReq, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        user: undefined,
        ...incomingReq || {},
        payloadAPI: 'local',
        locale: locale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.locale) || (((_b = payload === null || payload === void 0 ? void 0 : payload.config) === null || _b === void 0 ? void 0 : _b.localization) ? (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.config) === null || _c === void 0 ? void 0 : _c.localization) === null || _d === void 0 ? void 0 : _d.defaultLocale : null),
        fallbackLocale: fallbackLocale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.fallbackLocale) || null,
        payload,
    };
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    if (typeof user !== 'undefined')
        req.user = user;
    return (0, find_1.default)({
        depth,
        currentDepth,
        sort,
        page,
        limit,
        where,
        collection,
        overrideAccess,
        disableErrors,
        showHiddenFields,
        draft,
        pagination,
        req,
    });
}
exports.default = findLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb2xsZWN0aW9ucy9vcGVyYXRpb25zL2xvY2FsL2ZpbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSxtREFBMkI7QUFDM0IsaURBQWlEO0FBcUJqRCw4REFBOEQ7QUFDL0MsS0FBSyxVQUFVLFNBQVMsQ0FBNkIsT0FBZ0IsRUFBRSxPQUFnQjs7SUFDcEcsTUFBTSxFQUNKLFVBQVUsRUFBRSxjQUFjLEVBQzFCLEtBQUssRUFDTCxZQUFZLEVBQ1osSUFBSSxFQUNKLEtBQUssRUFDTCxLQUFLLEVBQ0wsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSwwQ0FBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFDeEYsY0FBYyxHQUFHLElBQUksRUFDckIsSUFBSSxFQUNKLGNBQWMsR0FBRyxJQUFJLEVBQ3JCLGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsSUFBSSxFQUNKLEtBQUssR0FBRyxLQUFLLEVBQ2IsVUFBVSxHQUFHLElBQUksRUFDakIsR0FBRyxFQUFFLFdBQVcsR0FDakIsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXZELE1BQU0sR0FBRyxHQUFHO1FBQ1YsSUFBSSxFQUFFLFNBQVM7UUFDZixHQUFHLFdBQVcsSUFBSSxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRSxNQUFNLEtBQUksV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE1BQU0sQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsTUFBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksMENBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUgsY0FBYyxFQUFFLGNBQWMsS0FBSSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsY0FBYyxDQUFBLElBQUksSUFBSTtRQUNyRSxPQUFPO0tBQ1UsQ0FBQztJQUVwQixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtRQUFFLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFBLDBCQUFhLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFFdkUsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXO1FBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFFakQsT0FBTyxJQUFBLGNBQUksRUFBQztRQUNWLEtBQUs7UUFDTCxZQUFZO1FBQ1osSUFBSTtRQUNKLElBQUk7UUFDSixLQUFLO1FBQ0wsS0FBSztRQUNMLFVBQVU7UUFDVixjQUFjO1FBQ2QsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixLQUFLO1FBQ0wsVUFBVTtRQUNWLEdBQUc7S0FDSixDQUFDLENBQUM7QUFDTCxDQUFDO0FBbERELDRCQWtEQyJ9