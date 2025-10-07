// controllers/addressController.js
import Address from '../models/Address.js';

// GET all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a specific address
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    res.json({ address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new address
export const createAddress = async (req, res) => {
  try {
    const {
      name,
      type = 'home',
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault = false
    } = req.body;

    // Validate required fields
    if (!name || !street || !city || !state || !zipCode || !country || !phone) {
      return res.status(400).json({ 
        message: 'All required fields must be provided' 
      });
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user._id },
        { isDefault: false }
      );
    }

    const address = new Address({
      userId: req.user._id,
      name,
      type,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    });

    await address.save();
    res.status(201).json({ address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE an address
export const updateAddress = async (req, res) => {
  try {
    const {
      name,
      type,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    } = req.body;

    const address = await Address.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, unset other default addresses
    if (isDefault && !address.isDefault) {
      await Address.updateMany(
        { userId: req.user._id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    // Update fields
    if (name !== undefined) address.name = name;
    if (type !== undefined) address.type = type;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (country !== undefined) address.country = country;
    if (phone !== undefined) address.phone = phone;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();
    res.json({ address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE an address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SET default address
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset all other default addresses
    await Address.updateMany(
      { userId: req.user._id },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json({ address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
