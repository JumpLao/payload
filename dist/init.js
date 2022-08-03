"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSync = exports.initAsync = exports.init = void 0;
/* eslint-disable no-param-reassign */
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const authenticate_1 = __importDefault(require("./express/middleware/authenticate"));
const connect_1 = __importDefault(require("./mongoose/connect"));
const middleware_1 = __importDefault(require("./express/middleware"));
const admin_1 = __importDefault(require("./express/admin"));
const init_1 = __importDefault(require("./auth/init"));
const access_1 = __importDefault(require("./auth/requestHandlers/access"));
const init_2 = __importDefault(require("./collections/init"));
const init_3 = __importDefault(require("./preferences/init"));
const init_4 = __importDefault(require("./globals/init"));
const initPlayground_1 = __importDefault(require("./graphql/initPlayground"));
const static_1 = __importDefault(require("./express/static"));
const registerSchema_1 = __importDefault(require("./graphql/registerSchema"));
const graphQLHandler_1 = __importDefault(require("./graphql/graphQLHandler"));
const build_1 = __importDefault(require("./email/build"));
const identifyAPI_1 = __importDefault(require("./express/middleware/identifyAPI"));
const errorHandler_1 = __importDefault(require("./express/middleware/errorHandler"));
const sendEmail_1 = __importDefault(require("./email/sendEmail"));
const serverInit_1 = require("./utilities/telemetry/events/serverInit");
const load_1 = __importDefault(require("./config/load"));
const logger_1 = __importDefault(require("./utilities/logger"));
const dataloader_1 = require("./collections/dataloader");
const init = (payload, options) => {
    payload.logger.info('Starting Payload...');
    if (!options.secret) {
        throw new Error('Error: missing secret key. A secret key is needed to secure Payload.');
    }
    if (options.mongoURL !== false && typeof options.mongoURL !== 'string') {
        throw new Error('Error: missing MongoDB connection URL.');
    }
    payload.emailOptions = { ...(options.email) };
    payload.secret = crypto_1.default
        .createHash('sha256')
        .update(options.secret)
        .digest('hex')
        .slice(0, 32);
    payload.local = options.local;
    payload.config = (0, load_1.default)(payload.logger);
    // If not initializing locally, scaffold router
    if (!payload.local) {
        payload.router = express_1.default.Router();
        payload.router.use(...(0, middleware_1.default)(payload));
        (0, init_1.default)(payload);
    }
    // Configure email service
    payload.email = (0, build_1.default)(payload.emailOptions, payload.logger);
    payload.sendEmail = sendEmail_1.default.bind(payload);
    // Initialize collections & globals
    (0, init_2.default)(payload);
    (0, init_4.default)(payload);
    if (!payload.config.graphQL.disable) {
        (0, registerSchema_1.default)(payload);
    }
    // If not initializing locally, set up HTTP routing
    if (!payload.local) {
        options.express.use((req, res, next) => {
            req.payload = payload;
            next();
        });
        options.express.use((req, res, next) => {
            req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
            return next();
        });
        payload.express = options.express;
        if (payload.config.rateLimit.trustProxy) {
            payload.express.set('trust proxy', 1);
        }
        (0, admin_1.default)(payload);
        (0, init_3.default)(payload);
        payload.router.get('/access', access_1.default);
        if (!payload.config.graphQL.disable) {
            payload.router.use(payload.config.routes.graphQL, (0, identifyAPI_1.default)('GraphQL'), (req, res) => (0, graphQLHandler_1.default)(req, res)(req, res));
            (0, initPlayground_1.default)(payload);
        }
        // Bind router to API
        payload.express.use(payload.config.routes.api, payload.router);
        // Enable static routes for all collections permitting upload
        (0, static_1.default)(payload);
        payload.errorHandler = (0, errorHandler_1.default)(payload.config, payload.logger);
        payload.router.use(payload.errorHandler);
        payload.authenticate = (0, authenticate_1.default)(payload.config);
    }
    (0, serverInit_1.serverInit)(payload);
};
exports.init = init;
const initAsync = async (payload, options) => {
    payload.logger = (0, logger_1.default)('payload', options.loggerOptions);
    payload.mongoURL = options.mongoURL;
    if (payload.mongoURL) {
        payload.mongoMemoryServer = await (0, connect_1.default)(payload.mongoURL, options.mongoOptions, payload.logger);
    }
    (0, exports.init)(payload, options);
    if (typeof options.onInit === 'function')
        await options.onInit(payload);
    if (typeof payload.config.onInit === 'function')
        await payload.config.onInit(payload);
};
exports.initAsync = initAsync;
const initSync = (payload, options) => {
    payload.logger = (0, logger_1.default)('payload', options.loggerOptions);
    payload.mongoURL = options.mongoURL;
    if (payload.mongoURL) {
        (0, connect_1.default)(payload.mongoURL, options.mongoOptions, payload.logger);
    }
    (0, exports.init)(payload, options);
    if (typeof options.onInit === 'function')
        options.onInit(payload);
    if (typeof payload.config.onInit === 'function')
        payload.config.onInit(payload);
};
exports.initSync = initSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxzREFBMEQ7QUFDMUQsb0RBQTRCO0FBTTVCLHFGQUE2RDtBQUM3RCxpRUFBaUQ7QUFDakQsc0VBQXFEO0FBQ3JELDREQUF3QztBQUN4Qyx1REFBbUM7QUFDbkMsMkVBQW1EO0FBQ25ELDhEQUFpRDtBQUNqRCw4REFBaUQ7QUFDakQsMERBQXlDO0FBQ3pDLDhFQUE2RDtBQUM3RCw4REFBMEM7QUFDMUMsOEVBQXNEO0FBQ3RELDhFQUFzRDtBQUN0RCwwREFBdUM7QUFDdkMsbUZBQTJEO0FBQzNELHFGQUE2RDtBQUU3RCxrRUFBMEM7QUFFMUMsd0VBQTRGO0FBRTVGLHlEQUF1QztBQUN2QyxnRUFBd0M7QUFDeEMseURBQXlEO0FBRWxELE1BQU0sSUFBSSxHQUFHLENBQUMsT0FBZ0IsRUFBRSxPQUFvQixFQUFRLEVBQUU7SUFDbkUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUNuQixNQUFNLElBQUksS0FBSyxDQUNiLHNFQUFzRSxDQUN2RSxDQUFDO0tBQ0g7SUFFRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssS0FBSyxJQUFJLE9BQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDdEUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQzNEO0lBRUQsT0FBTyxDQUFDLFlBQVksR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUM5QyxPQUFPLENBQUMsTUFBTSxHQUFHLGdCQUFNO1NBQ3BCLFVBQVUsQ0FBQyxRQUFRLENBQUM7U0FDcEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDdEIs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