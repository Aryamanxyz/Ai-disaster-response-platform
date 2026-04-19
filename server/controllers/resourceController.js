const Resource = require('../models/Resource');
const Incident = require('../models/Incident');

const getAllResources = async (req, res, next) => {
  try {
    const resources = await Resource.find()
      .populate('assignedTo', 'title type status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const { name, type, quantity, location, contactPerson } = req.body;

    const resource = await Resource.create({
      name,
      type,
      quantity,
      location,
      contactPerson
    });

    res.status(201).json({ success: true, resource });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.status(200).json({ success: true, resource });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};

const allocateResource = async (req, res, next) => {
  try {
    const { resourceId, incidentId } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Resource not available' });
    }

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    resource.status = 'deployed';
    resource.assignedTo = incidentId;
    await resource.save();

    incident.assignedResources.push(resourceId);
    await incident.save();

    res.status(200).json({ success: true, message: 'Resource allocated successfully', resource });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  allocateResource
};