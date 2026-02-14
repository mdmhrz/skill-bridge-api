const notFound = (req, res) => {
    res.status(404).json({
        mesage: 'Route not found',
        path: req.originalUrl,
        date: Date()
    });
};
export default notFound;
//# sourceMappingURL=notFound.js.map