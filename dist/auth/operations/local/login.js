"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = __importDefault(require("../login"));
const dataloader_1 = require("../../../collections/dataloader");
async function localLogin(payload, options) {
    const { collection: collectionSlug, req: incomingReq = {}, res, depth, locale, fallbackLocale, data, overrideAccess = true, showHiddenFields, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        ...incomingReq,
        payloadAPI: 'local',
        payload,
        locale: undefined,
        fallbackLocale: undefined,
    };
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    const args = {
        depth,
        collection,
        overrideAccess,
        showHiddenFields,
        data,
        req,
        res,
    };
    if (locale)
        args.req.locale = locale;
    if (fallbackLocale)
        args.req.fallbackLocale = fallbackLocale;
    return (0, login_1.default)(args);
}
exports.default = localLogin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXV0aC9vcGVyYXRpb25zL2xvY2FsL2xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EscURBQXlDO0FBSXpDLGdFQUFnRTtBQWlCaEUsS0FBSyxVQUFVLFVBQVUsQ0FBNkIsT0FBZ0IsRUFBRSxPQUFnQjtJQUN0RixNQUFNLEVBQ0osVUFBVSxFQUFFLGNBQWMsRUFDMUIsR0FBRyxFQUFFLFdBQVcsR0FBRyxFQUFFLEVBQ3JCLEdBQUcsRUFDSCxLQUFLLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFDZCxJQUFJLEVBQ0osY0FBYyxHQUFHLElBQUksRUFDckIsZ0JBQWdCLEdBQ2pCLEdBQUcsT0FBTyxDQUFDO0lBRVosTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV2RCxNQUFNLEdBQUcsR0FBRztRQUNWLEdBQUcsV0FBVztRQUNkLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE9BQU87UUFDUCxNQUFNLEVBQUUsU0FBUztRQUNqQixjQUFjLEVBQUUsU0FBUztLQUNSLENBQUM7SUFFcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7UUFBRSxHQUFHLENBQUMsaUJBQWlCLEdBQUcsSUFBQSwwQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXZFLE1BQU0sSUFBSSxHQUFHO1FBQ1gsS0FBSztRQUNMLFVBQVU7UUFDVixjQUFjO1FBQ2QsZ0JBQWdCO1FBQ2hCLElBQUk7UUFDSixHQUFHO1FBQ0gsR0FBRztLQUNKLENBQUM7SUFFRixJQUFJLE1BQU07UUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDckMsSUFBSSxjQUFjO1FBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBRTdELE9BQU8sSUFBQSxlQUFLLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUVELGtCQUFlLFVBQVUsQ0FBQyJ9