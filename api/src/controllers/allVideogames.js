const { Videogame, Genres } = require("../db");
const axios = require("axios");
const apiKey = "1ae48e15e2044901bcc68478c14698ee";
const apiGames = async (req, res) => {
  try {
    const games = await axios(`https://api.rawg.io/api/games?key=${apiKey}`);
    // console.log(games.data)
    // console.log(games.data.results)
    //Me traigo un arreglo de objetos con los parametros que necesito de la api
    const dataGames = games.data.results.map((e) => {
      return {
        id: e.id,
        name: e.name,
        platforms: e.platforms.map((j) => j.platform.name),
        genres: e.genres.map((g) => g.name),
        image: e.background_image,
        released: e.released,
        rating: e.rating,
      };
    });
    return dataGames;
  } catch (e) {
    res.status(404).json("Error al cargar los juegos desde la API");
  }
};

const dbGames = async (res) => {
  //Me traigo un arrego con los datos requeridos de la base de datos
  try {
    const games = await Videogame.findAll({
      include: {
        model: Genres,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
      raw:false,
      nest:true,
    });
    return games;
  } catch (e) {
    res.status(404).json("Error al cargar los juegos de la base de datos");
  }
};

const allInfo = async () => {
  //Junto el arreglo de la api y el de la base de datos
  //Lo hago en una funcion para que sea reutilizable
  const dbGame = await dbGames();
  const apiGame = await apiGames();
  //Formateo los generos de los juegos de la base de datos para que sean igual a los de la api
  dbGame.forEach((e) => {
    let newArr = e.dataValues.genres.map((j) => {
      return j.dataValues.name;
    })
    e.dataValues.genres = newArr.join(', '); 
  });
  apiGame.forEach((e)=>{
    e.genres = e.genres.join(', ')
  }
  )
  const allInfoGame = [...dbGame, ...apiGame];
  return allInfoGame;
};

const exportVideogame = async (req, res) => {
  const { name } = req.query;
  const allInfoVideogames = await allInfo();
  //Retorno todos los videojuegos
  try {
    if (!name) {
      return res.status(202).json(allInfoVideogames);
    }
    //Si me llega un name por query filtro los videojuegos por nombre
    const findVideogame = allInfoVideogames.filter(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    );
    //Condicion por si el name no es valido
    if (findVideogame.length === 0) {
      return res.status(404).json("El videojuego no existe");
    }
    res.status(202).json(findVideogame);
  } catch (e) {
    // res.status(404).json("Hubo un error");
    console.log(e)
  }
};

module.exports = {
  exportVideogame,
  allInfo,
  apiGames,
};
