import StateModel from '../models/State.js';
import DistrictModel from '../models/District.js';
import { serializeState, serializeDistrict } from '../utils/serializer.js';

export async function getStates(req, res, next) {
  try {
    const { type } = req.query; // 'state' or 'ut'
    const rows = await StateModel.getAll(type || null);
    const serialized = rows.map(r => serializeState(r));
    res.json({
      success: true,
      data: serialized
    });
  } catch (error) {
    next(error);
  }
}

export async function getStateBySlug(req, res, next) {
  try {
    const { stateSlug } = req.params;
    const state = await StateModel.getBySlug(stateSlug);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: `State or Union Territory '${stateSlug}' not found`
      });
    }

    const districts = await DistrictModel.getByStateSlug(stateSlug);
    const serializedDistricts = districts.map(d => serializeDistrict(d, state));
    const serialized = serializeState(state, serializedDistricts);

    res.json({
      success: true,
      data: serialized
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getStates,
  getStateBySlug
};
