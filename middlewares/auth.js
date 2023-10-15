// Define a middleware for role-based authorization
function authorize(roles) {
    return (req, res, next) => {
        const originIsTrusted = process.env.TRUSTED_ORIGINS.includes(req.hostname) || process.env.TRUSTED_ORIGINS.includes(req.ip);

        // If the origin is trusted, skip authentication and authorisation.
        if (originIsTrusted) {
            return next();
        }

        const user = req.session.user
        const id = req.params.id

        // Check the request is authenticated.
        if (!user) {
            return res.status(401).send({
                message: 'You are currently not authenticated.',
            });
        }


        // Check the request is authorised.
        if (!user.role in roles) {
            return res.status(403).send({
                message: 'You are not authorized to perform this action.',
            });
        }

        // If the request is PUT or DELETE, make sure the user only modifies itself.
        if (req.method === 'PUT' || req.method === 'DELETE') {
            // Check if the user is an admin or the user whose data is being modified
            if (user.role !== 'admin' && id !== user._id.toString()) {
                return res.status(403).send({
                    message: 'You are not authorized to perform this action.',
                });
            }
        }
    };
}

module.exports = authorize