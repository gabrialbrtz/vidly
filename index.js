/*
Proyecto de backend con Node.js y Express.js para montar un CRUD sencillo basado en un ARRAY de objetos.
 */

const express = require('express')
const app = express()
const Joi = require('joi')

// Necesitas esta sentencia para los POST, para hacer el middleware
app.use(express.json())

// Este proyecto de backend funcionará con un array, muy simple!

const genres = [
    {id:1, name:'Action'},
    {id:2, name:'Drama'},
    {id:3, name:'Horror'}
];

/*
Funciones útiles para la validación
 */

function validateGenre(genre) {

    // Creamos un schema para validar que el body cuando se hace un POST sea válido
    const schema = Joi.object({
        "name": Joi.string().min(3).required()
    });
    // Gestionas que el body es válido probando nuestro schema

    return schema.validate(genre);
}

/*
HTTP REQUEST *GET*
 */

// Endpoint para obtener toda la lista de géneros

app.get('/api/genres/', (req,res) =>{
    res.send(genres);
});

// Endpoint para seleccionar un género en concreto de nuestra API

app.get('/api/genres/:id', (req,res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if(!genre) res.status(404).send('The given genre ID was not found in the database')
    res.send(genre);
});

/*
HTTP REQUEST *POST*
 */

// Endpoint para añadir géneros nuevos a nuestra API

app.post('/api/genres/', (req,res) => {

    // Validación usando object destructing feature.
    const { error } = validateGenre(req.body)

    // Con este condicional devuelves el error si el schema no es válido
    if(error){
        res.status(400).send(error.details[0].message)
    }

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    // Envías el nuevo género al array de objetos y luego lo sacas por pantalla
    genres.push(genre);
    res.send(genre);
})

/*
HTTP REQUEST *PUT* UPDATE
 */

app.put('/api/genres/:id', (req,res) => {
    // Compruebas que el id que has pasado por parámetro existe
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if(!genre) res.status(404).send('The given genre ID was not found in the database')

    // Validación usando object destructing feature.
    const { error } = validateGenre(req.body)

    // Con este condicional devuelves el error si el schema no es válido
    if(error){
        res.status(400).send(error.details[0].message)
    }

    genre.name = req.body.name
    res.send(genre)
})

/*
HTTP REQUEST *DELETE*
 */

app.delete('/api/genres/:id', (req,res) => {
    // Compruebas que el id que has pasado por parámetro existe
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if(!genre) res.status(404).send('The given genre ID was not found in the database')

    // Borrar el género.
    // Buscas el index y lo guardas en una variable
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Devuelve el array de objetos actualizado
    res.send(genres)
})

/*
Inicialización del listening port
 */

const port = 3000;
app.listen(port, () => {console.log(`Listening in port ${port}`)})