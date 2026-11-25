import CollectionModel from '../models/Collection.js';
import {
  serializeExploreItem,
  serializeTopPlaceItem,
  serializeSliderItem
} from '../utils/serializer.js';

export async function getDestinations(req, res, next) {
  try {
    const items = await CollectionModel.getItems('explore');
    const serialized = items.map(item => serializeExploreItem(item));
    res.json({
      success: true,
      data: serialized
    });
  } catch (error) {
    next(error);
  }
}

export async function getTopPlaces(req, res, next) {
  try {
    const items = await CollectionModel.getItems('top-places');
    const serialized = items.map(item => serializeTopPlaceItem(item));
    res.json({
      success: true,
      data: serialized
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeatured(req, res, next) {
  try {
    const utItems = await CollectionModel.getItems('home-ut-slider');
    const exploreItems = await CollectionModel.getItems('home-explore-slider');
    const topPlacesItems = await CollectionModel.getItems('home-top-slider');

    res.json({
      success: true,
      data: {
        unionTerritories: utItems.map(i => serializeSliderItem(i)),
        explore: exploreItems.map(i => serializeSliderItem(i)),
        topPlaces: topPlacesItems.map(i => serializeSliderItem(i))
      }
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getDestinations,
  getTopPlaces,
  getFeatured
};
