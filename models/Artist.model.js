const mongoose = require ("mongoose")

//creamos el Schema(la estructura de la data)
const artistSchema = new mongoose.Schema({
    name: {
    type: String, // validación type es OBLIGATORIA
    required: true, // significa que el valor de este campo es obligatorio
    unique: true // significa que el valor es unico y no se puede repetir dentro de la colección
  },
  awardsWon: {
    type: Number,
    required: true,
    min: 0 // significa que no acepta valores negativos
  },
  isTouring: Boolean,
  genre: {
    type: [String],
    enum: ["rock", "alternative", "punk", "grunge", "hip hop", "techno", "pop", "indie"] // esto indica los unicos posibles valores que puede tener esta propiedad
  }
})

//creamos el modelo(herramienta para acceder a la DB, esa colección.)
const Artist = mongoose.model("Artist", artistSchema) //-->la forma en que mongo se va a conectar, debe definir como se llama el modelo 
//1.El nombre interno del modelo --> se usa para definir el nombre de la coleccion en mongodb :)
//2.El esquema
module.exports = Artist