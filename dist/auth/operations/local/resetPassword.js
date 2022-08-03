"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resetPassword_1 = __importDefault(require("../resetPassword"));
const dataloader_1 = require("../../../collections/dataloader");
async function localResetPassword(payload, options) {
    const { collection: collectionSlug, data, overrideAccess, req: incomingReq = {}, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        ...incomingReq,
        payload,
        payloadAPI: 'local',
    };
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    return (0, resetPassword_1.default)({
        collection,
        data,
        overrideAccess,
        req,
    });
}
exports.default = localResetPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXRQYXNzd29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hdXRoL29wZXJhdGlvbnMvbG9jYWwvcmVzZXRQYXNzd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHFFQUF5RDtBQUV6RCxnRUFBZ0U7QUFZaEUsS0FBSyxVQUFVLGtCQUFrQixDQUFDLE9BQWdCLEVBQUUsT0FBZ0I7SUFDbEUsTUFBTSxFQUNKLFVBQVUsRUFBRSxjQUFjLEVBQzFCLElBQUksRUFDSixjQUFjLEVBQ2QsR0FBRyxFQUFFLFdBQVcsR0FBRyxFQUFFLEdBQ3RCLEdBQUcsT0FBTyxDQUFDO0lBRVosTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV2RCxNQUFNLEdBQUcsR0FBRztRQUNWLEdBQUcsV0FBVztRQUNkLE9BQU87UUFDUCxVQUFVLEVBQUUsT0FBTztLQUNGLENBQUM7SUFFcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7UUFBRSxHQUFHLENBQUMsaUJBQWlCLEdBQUcsSUFBQSwwQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXZFLE9BQU8sSUFBQSx1QkFBYSxFQUFDO1FBQ25CLFVBQVU7UUFDVixJQUFJO1FBQ0osY0FBYztRQUNkLEdBQUc7S0FDSixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsa0JBQWUsa0JBQWtCLENBQUMifQ==