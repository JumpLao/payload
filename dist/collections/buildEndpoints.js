"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_1 = __importDefault(require("./requestHandlers/find"));
const verifyEmail_1 = __importDefault(require("../auth/requestHandlers/verifyEmail"));
const unlock_1 = __importDefault(require("../auth/requestHandlers/unlock"));
const create_1 = __importDefault(require("./requestHandlers/create"));
const init_1 = __importDefault(require("../auth/requestHandlers/init"));
const login_1 = __importDefault(require("../auth/requestHandlers/login"));
const refresh_1 = __importDefault(require("../auth/requestHandlers/refresh"));
const me_1 = __importDefault(require("../auth/requestHandlers/me"));
const registerFirstUser_1 = __importDefault(require("../auth/requestHandlers/registerFirstUser"));
const forgotPassword_1 = __importDefault(require("../auth/requestHandlers/forgotPassword"));
const resetPassword_1 = __importDefault(require("../auth/requestHandlers/resetPassword"));
const findVersions_1 = __importDefault(require("./requestHandlers/findVersions"));
const findVersionByID_1 = __importDefault(require("./requestHandlers/findVersionByID"));
const restoreVersion_1 = __importDefault(require("./requestHandlers/restoreVersion"));
const delete_1 = __importDefault(require("./requestHandlers/delete"));
const findByID_1 = __importDefault(require("./requestHandlers/findByID"));
const update_1 = __importDefault(require("./requestHandlers/update"));
const logout_1 = __importDefault(require("../auth/requestHandlers/logout"));
const buildEndpoints = (collection) => {
    let { endpoints } = collection;
    if (collection.auth) {
        if (!collection.auth.disableLocalStrategy) {
            if (collection.auth.verify) {
                endpoints.push({
                    path: '/verify/:token',
                    method: 'post',
                    handler: verifyEmail_1.default,
                });
            }
            if (collection.auth.maxLoginAttempts > 0) {
                endpoints.push({
                    path: '/unlock',
                    method: 'post',
                    handler: unlock_1.default,
                });
            }
            endpoints = endpoints.concat([
                {
                    path: '/login',
                    method: 'post',
                    handler: login_1.default,
                },
                {
                    path: '/first-register',
                    method: 'post',
                    handler: registerFirstUser_1.default,
                },
                {
                    path: '/forgot-password',
                    method: 'post',
                    handler: forgotPassword_1.default,
                },
                {
                    path: '/reset-password',
                    method: 'post',
                    handler: resetPassword_1.default,
                },
            ]);
        }
        endpoints = endpoints.concat([
            {
                path: '/init',
                method: 'get',
                handler: init_1.default,
            },
            {
                path: '/me',
                method: 'get',
                handler: me_1.default,
            },
            {
                path: '/logout',
                method: 'post',
                handler: logout_1.default,
            },
            {
                path: '/refresh-token',
                method: 'post',
                handler: refresh_1.default,
            },
        ]);
    }
    if (collection.versions) {
        endpoints = endpoints.concat([
            {
                path: '/versions',
                method: 'get',
                handler: findVersions_1.default,
            },
            {
                path: '/versions/:id',
                method: 'get',
                handler: findVersionByID_1.default,
            },
            {
                path: '/versions/:id',
                method: 'post',
                handler: restoreVersion_1.default,
            },
        ]);
    }
    return endpoints.concat([
        {
            path: '/',
            method: 'get',
            handler: find_1.default,
        },
        {
            path: '/',
            method: 'post',
            handler: create_1.default,
        },
        {
            path: '/:id',
            method: 'put',
            handler: update_1.default,
        },
        {
            path: '/:id',
            method: 'get',
            handler: findByID_1.default,
        },
        {
            path: '/:id',
            method: 'delete',
            handler: delete_1.default,
        },
    ]);
};
exports.default = buildEndpoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRFbmRwb2ludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29sbGVjdGlvbnMvYnVpbGRFbmRwb2ludHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxrRUFBMEM7QUFDMUMsc0ZBQThEO0FBQzlELDRFQUFvRDtBQUNwRCxzRUFBOEM7QUFDOUMsd0VBQXVEO0FBQ3ZELDBFQUF5RDtBQUN6RCw4RUFBNkQ7QUFDN0Qsb0VBQW1EO0FBQ25ELGtHQUFpRjtBQUNqRiw0RkFBMkU7QUFDM0UsMEZBQWtFO0FBQ2xFLGtGQUEwRDtBQUMxRCx3RkFBZ0U7QUFDaEUsc0ZBQThEO0FBQzlELHNFQUFxRDtBQUNyRCwwRUFBa0Q7QUFDbEQsc0VBQThDO0FBQzlDLDRFQUEyRDtBQUUzRCxNQUFNLGNBQWMsR0FBRyxDQUFDLFVBQXFDLEVBQWMsRUFBRTtJQUMzRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsVUFBVSxDQUFDO0lBRS9CLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtRQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUN6QyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO29CQUNiLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSxxQkFBVztpQkFDckIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QyxTQUFTLENBQUMsSUFBSSxDQUFDO29CQUNiLElBQUksRUFBRSxTQUFTO29CQUNmLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSxnQkFBTTtpQkFDaEIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQkFDM0I7b0JBQ0UsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsTUFBTSxFQUFFLE1BQU07b0JBQ2QsT0FBTyxFQUFFLGVBQVk7aUJBQ3RCO2dCQUNEO29CQUNFLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSwyQkFBd0I7aUJBQ2xDO2dCQUNEO29CQUNFLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSx3QkFBcUI7aUJBQy9CO2dCQUNEO29CQUNFLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSx1QkFBYTtpQkFDdkI7YUFDRixDQUFDLENBQUM7U0FDSjtRQUVELFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQzNCO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE9BQU8sRUFBRSxjQUFXO2FBQ3JCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsT0FBTyxFQUFFLFlBQVM7YUFDbkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsU0FBUztnQkFDZixNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUUsZ0JBQWE7YUFDdkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUUsaUJBQWM7YUFDeEI7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVELElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRTtRQUN2QixTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUMzQjtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsT0FBTyxFQUFFLHNCQUFZO2FBQ3RCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE9BQU8sRUFBRSx5QkFBZTthQUN6QjtZQUNEO2dCQUNFLElBQUksRUFBRSxlQUFlO2dCQUNyQixNQUFNLEVBQUUsTUFBTTtnQkFDZCxPQUFPLEVBQUUsd0JBQWM7YUFDeEI7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUN0QjtZQUNFLElBQUksRUFBRSxHQUFHO1lBQ1QsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsY0FBSTtTQUNkO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsR0FBRztZQUNULE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLGdCQUFNO1NBQ2hCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLGdCQUFNO1NBQ2hCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLGtCQUFRO1NBQ2xCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE9BQU8sRUFBRSxnQkFBYTtTQUN2QjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVGLGtCQUFlLGNBQWMsQ0FBQyJ9