import imageService from '../services/images/imageService.js';
import imageCollector from '../services/images/imageCollector.js';
import imageVerifier from '../services/images/imageVerifier.js';

export async function reportFailure(req, res, next) {
  try {
    const { imageId, reason } = req.body;
    const parsedId = parseInt(imageId, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid imageId parameter. Must be a positive integer.'
      });
    }

    const result = await imageService.reportFailure(parsedId, String(reason || 'Client load error').slice(0, 255));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getDashboardOverview(req, res, next) {
  try {
    const overview = await imageService.getDashboardOverview();
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminImagesList(req, res, next) {
  try {
    const { status, districtId } = req.query;
    const images = await imageService.getAdminImagesList({
      status: status || null,
      districtId: districtId ? parseInt(districtId, 10) : null
    });
    res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    next(error);
  }
}

export async function triggerManualVerify(req, res, next) {
  try {
    const { id } = req.params;
    const imageId = parseInt(id, 10);
    if (isNaN(imageId) || imageId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid image ID' });
    }

    const result = await imageVerifier.verifyImage(imageId, 'manual');
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function triggerCollectPilot(req, res, next) {
  try {
    const result = await imageCollector.collectWestBengalPilot({ forceRefresh: false });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  reportFailure,
  getDashboardOverview,
  getAdminImagesList,
  triggerManualVerify,
  triggerCollectPilot
};
