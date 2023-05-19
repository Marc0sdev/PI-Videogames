const { Router } = require('express');
const {exportVideogame} = require('../controllers/allVideogames')
const {idVideogame}= require('../controllers/videogamesById');
const { genres } = require('../controllers/allGenres');
const { newVideogame } = require('../controllers/createVideoGame');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();
//Rutas de videojuegos
router.get('/videogames',exportVideogame)
router.get('/videogames/:id',idVideogame)
router.post('/videogames',newVideogame)
//Rutas de generos
router.get('/genres',genres)

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;