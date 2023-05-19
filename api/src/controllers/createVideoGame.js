const {Videogame, Genres} = require('../db')

const newVideogame = async(req,res)=>{

    const {id, name, description,genres, platforms, image, released, rating} = req.body
    
    if(!name||!description||!platforms||!released||!rating||!genres){
        console.log(name,description,genres,platforms,image,released,rating)
        return res.status(404).json('Faltan parametros')
    }
    console.log(name,description,genres,platforms,image,released,rating)
    try{
        let newGame = await Videogame.create({
            id,
            name,
            description,
            platforms,
            image,
            released,
            rating
        })
        const genArr = genres.split(', ')
        const genresDB = await Genres.findAll({
            where:{
                name: genArr
            }
        })

        // console.log(genresDB)
        
        await newGame.addGenres(genresDB)

        res.status(200).json(newGame)
    }
    catch(e){
        res.status(404).json(e)
    }
}

module.exports={
    newVideogame
}