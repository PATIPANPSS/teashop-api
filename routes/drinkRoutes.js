const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');
const upload = require('../middlewares/uploadMiddleware');
const {verifyToken, isAdmin} = require('../middlewares/authMiddleware');

router.get('/search', drinkController.searchDrinks);
router.get('/sales/history', drinkController.getSalesHistory);
router.get('/', drinkController.getAllDrinks);
router.get('/:id', drinkController.getDrinksById);

router.post('/',verifyToken, isAdmin, upload.single('image'), drinkController.addDrink);
router.put('/:id',verifyToken, isAdmin, drinkController.updateDrink);
router.delete('/:id',verifyToken, isAdmin, drinkController.deleteDrink);

router.post('/:id/buy', drinkController.buyDrink);

module.exports = router;