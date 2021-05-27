const { Address } = require('../models/address.model');
const { extend } = require('lodash');

const getAllAddressesOfUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const addresses = await Address.find({ userId });
		res.status(200).json({ response: addresses });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const createNewAddress = async (req, res) => {
	try {
		const userId = req.user._id;
		let newAddress = req.body;
		newAddress = new Address({ ...newAddress, userId });
		await newAddress.save();

		const updatedAddressesFromDb = await Address.find({ userId: userId });
		res.status(201).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const updateAddress = async (req, res) => {
	try {
		const { addressId } = req.params;
		const userId = req.user._id;
		const addressUpdates = req.body;

		let address = await Address.findById({ _id: addressId, userId });

		if (!address) {
			res.json({ message: 'This addresss is not asscociated with user' });
			return;
		}
		address = extend(address, addressUpdates);
		await address.save();
		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(200).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

const deleteAddress = async (req, res) => {
	try {
		const { addressId } = req.params;
		const userId = req.user._id;

		let address = await Address.findById({ _id: addressId, userId });

		if (!address) {
			res.json({ message: 'This addresss is not asscociated with user' });
			return;
		}

		await address.remove();

		const updatedAddressesFromDb = await Address.find({ userId: userId });

		res.status(200).json({ response: updatedAddressesFromDb });
	} catch (error) {
		console.error(error);
		res.json({
			message: 'Request failed please check errorMessage key for more details',
			errorMessage: error.message,
		});
	}
};

module.exports = {
	getAllAddressesOfUser,
	createNewAddress,
	updateAddress,
	deleteAddress,
};
