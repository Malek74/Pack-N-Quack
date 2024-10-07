// /middleware/auth.js

export const isTourismGovernor = (req, res, next) => {
    // Assuming you have user role stored in req.user
    if (req.user && req.user.role === 'tourism_governor') {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(403).json({ message: "Forbidden: You do not have permission to create tags." });
    }
};
