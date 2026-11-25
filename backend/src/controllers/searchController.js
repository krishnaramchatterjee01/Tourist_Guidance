import SearchModel from '../models/Search.js';

export async function search(req, res, next) {
  try {
    const { q, limit = 20 } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const results = await SearchModel.search(q, limit);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
}

export default {
  search
};
