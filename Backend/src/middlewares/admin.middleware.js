export const verifyAdmin = async (req, res, next) => {
    try {
        // Check if user exists and is admin
        if (!req.user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                statusCode: 403,
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while verifying admin access"
        });
    }
}; 