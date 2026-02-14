import { auth as betterAuth } from '../lib/auth';
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            // GET USER SESSION
            const session = await betterAuth.api.getSession({
                headers: req.headers
            });
            // console.log(session);
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: 'You are not authorized'
                });
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Email verification required'
                });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role,
                emailVerified: session.user.emailVerified
            };
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have the permission"
                });
            }
            // console.log('middleware working');
            // console.log(roles);
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map