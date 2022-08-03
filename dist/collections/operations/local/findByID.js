"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findByID_1 = __importDefault(require("../findByID"));
const dataloader_1 = require("../../dataloader");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findByIDLocal(payload, options) {
    var _a, _b, _c;
    const { collection: collectionSlug, depth, currentDepth, id, locale, fallbackLocale, user, overrideAccess = true, disableErrors = false, showHiddenFields, req: incomingReq, draft = false, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        user: undefined,
        ...incomingReq || {},
        payloadAPI: 'local',
        locale: locale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.locale) || (((_a = payload === null || payload === void 0 ? void 0 : payload.config) === null || _a === void 0 ? void 0 : _a.localization) ? (_c = (_b = payload === null || payload === void 0 ? void 0 : payload.config) === null || _b === void 0 ? void 0 : _b.localization) === null || _c === void 0 ? void 0 : _c.defaultLocale : null),
        fallbackLocale: fallbackLocale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.fallbackLocale) || null,
        payload,
    };
    if (typeof user !== 'undefined')
        req.user = user;
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    return (0, findByID_1.default)({
        depth,
        currentDepth,
        id,
        collection,
        overrideAccess,
        disableErrors,
        showHiddenFields,
        req,
        draft,
    });
}
exports.default = findByIDLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZEJ5SUQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29sbGVjdGlvbnMvb3BlcmF0aW9ucy9sb2NhbC9maW5kQnlJRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLDJEQUFtQztBQUVuQyxpREFBaUQ7QUFpQmpELDhEQUE4RDtBQUMvQyxLQUFLLFVBQVUsYUFBYSxDQUE2QixPQUFnQixFQUFFLE9BQWdCOztJQUN4RyxNQUFNLEVBQ0osVUFBVSxFQUFFLGNBQWMsRUFDMUIsS0FBSyxFQUNMLFlBQVksRUFDWixFQUFFLEVBQ0YsTUFBTSxFQUNOLGNBQWMsRUFDZCxJQUFJLEVBQ0osY0FBYyxHQUFHLElBQUksRUFDckIsYUFBYSxHQUFHLEtBQUssRUFDckIsZ0JBQWdCLEVBQ2hCLEdBQUcsRUFBRSxXQUFXLEVBQ2hCLEtBQUssR0FBRyxLQUFLLEdBQ2QsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXZELE1BQU0sR0FBRyxHQUFHO1FBQ1YsSUFBSSxFQUFFLFNBQVM7UUFDZixHQUFHLFdBQVcsSUFBSSxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRSxNQUFNLEtBQUksV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE1BQU0sQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsTUFBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksMENBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUgsY0FBYyxFQUFFLGNBQWMsS0FBSSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsY0FBYyxDQUFBLElBQUksSUFBSTtRQUNyRSxPQUFPO0tBQ1UsQ0FBQztJQUVwQixJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVc7UUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUVqRCxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtRQUFFLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFBLDBCQUFhLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFFdkUsT0FBTyxJQUFBLGtCQUFRLEVBQUM7UUFDZCxLQUFLO1FBQ0wsWUFBWTtRQUNaLEVBQUU7UUFDRixVQUFVO1FBQ1YsY0FBYztRQUNkLGFBQWE7UUFDYixnQkFBZ0I7UUFDaEIsR0FBRztRQUNILEtBQUs7S0FDTixDQUFDLENBQUM7QUFDTCxDQUFDO0FBMUNELGdDQTBDQyJ9