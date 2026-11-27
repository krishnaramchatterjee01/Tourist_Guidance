import { Router } from 'express';
import { testConnection } from '../config/db.js';
import stateController from '../controllers/stateController.js';
import districtController from '../controllers/districtController.js';
import placeController from '../controllers/placeController.js';
import collectionController from '../controllers/collectionController.js';
import searchController from '../controllers/searchController.js';
import imageController from '../controllers/imageController.js';

const router = Router();

// ==========================================
// 1. Health and Readiness
// ==========================================
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

router.get('/ready', async (req, res) => {
  const result = await testConnection();
  if (result.connected) {
    res.json({
      success: true,
      status: 'READY',
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      success: false,
      status: 'NOT_READY',
      database: 'UNAVAILABLE',
      error: result.error,
      timestamp: new Date().toISOString()
    });
  }
});

// ==========================================
// 2. States and Union Territories
// ==========================================
router.get('/states', stateController.getStates);
router.get('/states/:stateSlug', stateController.getStateBySlug);

// ==========================================
// 3. Districts
// ==========================================
router.get('/states/:stateSlug/districts', districtController.getDistrictsByState);
router.get('/states/:stateSlug/districts/:districtSlug', districtController.getDistrictDetails);

// ==========================================
// 4. Tourist Places
// ==========================================
router.get('/places', placeController.getPlaces);
router.get('/places/:id', placeController.getPlaceById);

// ==========================================
// 5. Curated Collections
// ==========================================
router.get('/destinations', collectionController.getDestinations);
router.get('/top-places', collectionController.getTopPlaces);
router.get('/featured', collectionController.getFeatured);

// ==========================================
// 6. Global Search
// ==========================================
router.get('/search', searchController.search);

// ==========================================
// 7. Centralized Image Management System (CIMS)
// ==========================================
router.post('/images/report-failure', imageController.reportFailure);
router.get('/admin/images/overview', imageController.getDashboardOverview);
router.get('/admin/images', imageController.getAdminImagesList);
router.post('/admin/images/:id/verify', imageController.triggerManualVerify);
router.post('/admin/images/collect-wb', imageController.triggerCollectPilot);

export default router;
