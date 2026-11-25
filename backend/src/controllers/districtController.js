import DistrictModel from '../models/District.js';
import StateModel from '../models/State.js';
import { serializeDistrict, serializePlace } from '../utils/serializer.js';

export async function getDistrictsByState(req, res, next) {
  try {
    const { stateSlug } = req.params;
    const state = await StateModel.getBySlug(stateSlug);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: `State '${stateSlug}' not found`
      });
    }

    const districts = await DistrictModel.getByStateSlug(stateSlug);
    const serialized = districts.map(d => serializeDistrict(d, state));

    res.json({
      success: true,
      state: {
        name: state.name,
        slug: state.slug,
        capital: state.capital,
        totalDistricts: districts.length
      },
      data: serialized
    });
  } catch (error) {
    next(error);
  }
}

export async function getDistrictDetails(req, res, next) {
  try {
    const { stateSlug, districtSlug } = req.params;
    const state = await StateModel.getBySlug(stateSlug);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: `State '${stateSlug}' not found`
      });
    }

    const district = await DistrictModel.getBySlug(stateSlug, districtSlug);

    if (!district) {
      return res.status(404).json({
        success: false,
        message: `District '${districtSlug}' not found in state '${stateSlug}'`
      });
    }

    const attractions = await DistrictModel.getAttractions(district.id);
    const serializedAttractions = attractions.map(a => serializePlace(a));
    const serialized = serializeDistrict(district, state, serializedAttractions);

    res.json({
      success: true,
      data: serialized
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getDistrictsByState,
  getDistrictDetails
};
