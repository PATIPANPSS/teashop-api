const express = require('express');
const router = express.Router();
const drinkController = require('../controllers/drinkController');

router.get('/search', drinkController.searchDrinks);
router.get('/sales/history', drinkController.getSalesHistory);
router.get('/', drinkController.getAllDrinks);
router.get('/:id', drinkController.getDrinksById);

router.post('/', drinkController.addDrink);
router.put('/:id', drinkController.updateDrink);
router.delete('/:id', drinkController.deleteDrink);

router.post('/:id/buy', drinkController.buyDrink);

module.exports = router;