import PlaceModel from '../models/Place.js';
import { serializePlace } from '../utils/serializer.js';

export async function getPlaces(req, res, next) {
  try {
    const { category, limit = 100, page = 1 } = req.query;
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const rows = await PlaceModel.getAll({
      category: category || null,
      limit: safeLimit,
      offset
    });

    const serialized = rows.map(r => serializePlace(r));

    res.json({
      success: true,
      data: serialized,
      pagination: {
        page: safePage,
        limit: safeLimit,
        count: serialized.length
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getPlaceById(req, res, next) {
  try {
    const { id } = req.params;
    const place = await PlaceModel.getById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: `Tourist place with id '${id}' not found`
      });
    }

    res.json({
      success: true,
      data: serializePlace(place)
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getPlaces,
  getPlaceById
};
