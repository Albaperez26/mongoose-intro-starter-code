try {
process.loadEnvFile()
} catch (error) {
  console.warn("no se encontró variable .env, usando variables predeterminadas")
}

const express = require("express");
const logger = require("morgan");
const cors = require("cors");


const app = express();

const mongoose = require("mongoose")
const MONGO_URI = "mongodb://localhost:27017/artist-db"
mongoose.connect(MONGO_URI)

.then(() => {
console.log("todo bien, conectados a la API")
})
.catch((error) => {
console.log(error)
})

// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(cors({
  origin: '*'
}));

// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array


// all routes here...
app.get("/test", (req, res, next) => {




  //como accedemos a la data que viene dentro del body --> con el req.
  //console.log(req.body)

  //¿Como recibimos el id que hay en un parametro dinámico?
  //console.log(req.params)

  //¿Como recibimos la query que hay en el url?
  console.log(req.query)



  res.json({ message: "probando el servidor. todo bien!" })
})

//rutas de CRUD para artistas
const Artist = require("./models/Artist.model") //Importar artist model

//ruta CREAR Artistas
app.post("/artist", (req, res) => {
  //como probamos esta ruta --> con postman!
  console.log("ruta ok")
  //como recibimos la data para crear el artista --> a traves del Body!
  console.log(req.body)
  //como le pedimos a la db que cree el artista --> con el modelo Artist.model
  Artist.create({  //! Siempre hacer req.body.caracteristica de schema, nunca solo req.body
    name: req.body.name,
    awardsWon: req.body.awardsWon,
    isTouring: req.body.isTouring,
    genre: req.body.genre
  })
  
  //como procesamos la respuesta de la db --> como una promesa --> then/catch
  .then(() => {
    //si el codigo llega aqui, significa que el documento se creo correctamente
     res.send("Se ha creado el artista correctamente")
  })
  .catch((error) => {
    console.log(error)
  })


  //que le decimos al cliente --> mandar mensaje de que se ha creado el artista correctamente
 
})

//ruta BUSCAR  todos los Artistas
app.get("/artist", async (req, res) => {
  //console.log("ruta get funcionando")
  try {
    const response = await Artist.find()
    res.json(response)
  } catch (error) {
    console.log(error)
  }
})


//ruta BUSCAR Artistas que estan en Tour y tienen mas de 100 premios
app.get("/artist/is-touring", async (req, res) => {
  //console.log("ruta get funcionando")
  try {
    const response = await Artist
    .find( {isTouring: true, awardsWon: {$gte: 50} })
    .select( {name: 1, awardsWon:1})
    .sort({awardsWon:1})
    .limit(3)

    res.json(response)
  } catch (error) {
    console.log(error)
  }
})

//ruta para editar todos los detalles de un documento(pendiente)

//ruta para editar una sola propiedad del documento
app.patch("/artist/:artistId/awards-won", async (req, res) => {
  console.log(req.params)
  console.log(req.body)

  try {
     const response = await Artist.findByIdAndUpdate(req.params.artistId, {
      awardsWon: req.body.awardsWon
     }, {new:true})
     //si queremos forzar mongo para que nos de el doc despues de la actualización, hay que agregar:  {new:true};
     res.json(response)

  } catch (error) {
    console.log(error)
  }

  
})

//ruta para borrar un solo documento
app.delete("/artist/:artistId", (req, res) => {
  Artist.findByIdAndDelete(req.params.artistId)
  .then(() => {
    res.send("Todo ok, documento borrado.")
  })
  .catch((error) => {
    console.log(error)
  })

})

// server listen & PORT
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
