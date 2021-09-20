const dotenv = require('dotenv');

const environment = dotenv.config();

if (!environment) {
	throw new Error('.env can not be found!');
}

module.exports = {

	/**
	 * @desc Application port
	 * @type {Number}
	 **/
	PORT: process.env.PORT || 5000,

	/**
	 * @desc URI parameter to connect to MongoDB
	 * @type {String}
	 **/
	MONGO_URI: process.env.MONGO_URI,

	/**
	 * @desc JWT token
	 * @type {String} 
	 */
	JWT_SECRET: process.env.JWT_SECRET

};


