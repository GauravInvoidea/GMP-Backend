const unspecifiedRouteHandler = async (req, res) => {
	res.status(404).json({ status: false, message: 'route / method not found! please check url' });
}

module.exports = unspecifiedRouteHandler;