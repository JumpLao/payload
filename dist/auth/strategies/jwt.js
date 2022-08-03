"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const findByID_1 = __importDefault(require("../../collections/operations/findByID"));
const getExtractJWT_1 = __importDefault(require("../getExtractJWT"));
const JwtStrategy = passport_jwt_1.default.Strategy;
exports.default = ({ secret, config, collections }) => {
    const opts = {
        passReqToCallback: true,
        jwtFromRequest: (0, getExtractJWT_1.default)(config),
        secretOrKey: secret,
    };
    return new JwtStrategy(opts, async (req, token, done) => {
        if (req.user) {
            done(null, req.user);
        }
        try {
            const collection = collections[token.collection];
            const isGraphQL = (req.url || '').replace(/\/$/, '') === config.routes.graphQL.replace(/\/$/, '');
            const user = await (0, findByID_1.default)({
                id: token.id,
                collection,
                req,
                overrideAccess: true,
                depth: isGraphQL ? 0 : collection.config.auth.depth,
            });
            if (user && (!collection.config.auth.verify || user._verified)) {
                user.collection = collection.config.slug;
                user._strategy = 'local-jwt';
                done(null, user);
            }
            else {
                done(null, false);
            }
        }
        catch (err) {
            done(null, false);
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F1dGgvc3RyYXRlZ2llcy9qd3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRUFBNEQ7QUFHNUQscUZBQTZEO0FBQzdELHFFQUE2QztBQUU3QyxNQUFNLFdBQVcsR0FBRyxzQkFBVyxDQUFDLFFBQVEsQ0FBQztBQUV6QyxrQkFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQVcsRUFBb0IsRUFBRTtJQUM1RSxNQUFNLElBQUksR0FBb0I7UUFDNUIsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixjQUFjLEVBQUUsSUFBQSx1QkFBYSxFQUFDLE1BQU0sQ0FBQztRQUNyQyxXQUFXLEVBQUUsTUFBTTtLQUNwQixDQUFDO0lBRUYsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDdEQsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQ1osSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7UUFFRCxJQUFJO1lBQ0YsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVqRCxNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRWxHLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSxrQkFBUSxFQUFDO2dCQUMxQixFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ1osVUFBVTtnQkFDVixHQUFHO2dCQUNILGNBQWMsRUFBRSxJQUFJO2dCQUNwQixLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUs7YUFDcEQsQ0FBQyxDQUFDO1lBRUgsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzlELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDO2dCQUM3QixJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDbkI7U0FDRjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuQjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=