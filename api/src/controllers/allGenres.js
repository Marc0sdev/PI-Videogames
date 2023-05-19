const { Genres } = require("../db");
const { apiGames } = require("./allVideogames");
const genres = async (req, res) => {
  try {
    const allGames = await apiGames();
    //Itero los juegos de la api para tener solo los generos, que no sean repetidos y sin arrays superpuestos
    const allGenres = [...new Set(allGames.map((e) => e.genres).flat())];
    // console.log(allGenres)

    allGenres.forEach(async (e) => {
      if (!e) return;
      // Busco o creo los generos de la api en la base dedatos
      const [temp, created] = await Genres.findOrCreate({
        where: {
          name: e,
        },
        default: {
          name: e,
        },
      });
    });
    //Me traigo todos los generos de la base de datos
    const genresDb = await Genres.findAll();
    res.status(202).json(genresDb);
  } catch (e) {
    console.log(e);
    return;
  }
};

module.exports = {
  genres,
};
