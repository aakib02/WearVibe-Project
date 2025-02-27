const express = require("express");
const router = express.Router();
const NavbarController = require('../controllers/NavbarController')
const authMiddleware =  require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.get("/navbar",  NavbarController.getNavbarLinks );
router.get('/search',NavbarController.searchBarController)

router.get('/profile',authMiddleware, NavbarController.getProfileController)


module.exports = router;