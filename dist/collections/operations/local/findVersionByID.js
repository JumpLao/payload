"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findVersionByID_1 = __importDefault(require("../findVersionByID"));
const dataloader_1 = require("../../dataloader");
async function findVersionByIDLocal(payload, options) {
    var _a, _b, _c;
    const { collection: collectionSlug, depth, id, locale = payload.config.localization ? (_a = payload.config.localization) === null || _a === void 0 ? void 0 : _a.defaultLocale : null, fallbackLocale = null, overrideAccess = true, disableErrors = false, showHiddenFields, req: incomingReq, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        ...incomingReq || {},
        payloadAPI: 'local',
        locale: locale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.locale) || ((_c = (_b = this === null || this === void 0 ? void 0 : this.config) === null || _b === void 0 ? void 0 : _b.localization) === null || _c === void 0 ? void 0 : _c.defaultLocale),
        fallbackLocale: fallbackLocale || (incomingReq === null || incomingReq === void 0 ? void 0 : incomingReq.fallbackLocale) || null,
        payload,
    };
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    return (0, findVersionByID_1.default)({
        depth,
        id,
        collection,
        overrideAccess,
        disableErrors,
        showHiddenFields,
        req,
    });
}
exports.default = findVersionByIDLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZFZlcnNpb25CeUlELmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvbG9jYWwvZmluZFZlcnNpb25CeUlELnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEseUVBQWlEO0FBQ2pELGlEQUFpRDtBQWVsQyxLQUFLLFVBQVUsb0JBQW9CLENBQXFDLE9BQWdCLEVBQUUsT0FBZ0I7O0lBQ3ZILE1BQU0sRUFDSixVQUFVLEVBQUUsY0FBYyxFQUMxQixLQUFLLEVBQ0wsRUFBRSxFQUNGLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsTUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksMENBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQ3hGLGNBQWMsR0FBRyxJQUFJLEVBQ3JCLGNBQWMsR0FBRyxJQUFJLEVBQ3JCLGFBQWEsR0FBRyxLQUFLLEVBQ3JCLGdCQUFnQixFQUNoQixHQUFHLEVBQUUsV0FBVyxHQUNqQixHQUFHLE9BQU8sQ0FBQztJQUVaLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFdkQsTUFBTSxHQUFHLEdBQUc7UUFDVixHQUFHLFdBQVcsSUFBSSxFQUFFO1FBQ3BCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRSxNQUFNLEtBQUksV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE1BQU0sQ0FBQSxLQUFJLE1BQUEsTUFBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSwwQ0FBRSxZQUFZLDBDQUFFLGFBQWEsQ0FBQTtRQUNsRixjQUFjLEVBQUUsY0FBYyxLQUFJLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxjQUFjLENBQUEsSUFBSSxJQUFJO1FBQ3JFLE9BQU87S0FDVSxDQUFDO0lBRXBCLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCO1FBQUUsR0FBRyxDQUFDLGlCQUFpQixHQUFHLElBQUEsMEJBQWEsRUFBQyxHQUFHLENBQUMsQ0FBQztJQUV2RSxPQUFPLElBQUEseUJBQWUsRUFBQztRQUNyQixLQUFLO1FBQ0wsRUFBRTtRQUNGLFVBQVU7UUFDVixjQUFjO1FBQ2QsYUFBYTtRQUNiLGdCQUFnQjtRQUNoQixHQUFHO0tBQ0osQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWxDRCx1Q0FrQ0MifQ==