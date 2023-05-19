const { allInfo } = require("./allVideogames");

const idVideogame = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const allVideogames = await allInfo();
  try {
    //Condicional por si lo que busco es para la base de datos
    if (id.includes("-")) {
      const findVideogameByIdUUID = allVideogames.find((e) => e.id === id);
      return res.status(200).json(findVideogameByIdUUID);
    }
    //Si lo busco por api modifico el string a integer
    const findVideogameById = allVideogames.find((e) => e.id === Number(id));

    if (!findVideogameById.id) return res.status(404).json("El id no existe");
    res.status(200).json(findVideogameById);
  } catch (e) {
    res.status(404).json("Hubo un error");
  }
};

module.exports = {
  idVideogame,
};
