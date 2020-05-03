const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async(req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extraer el proyecto y comprobar si existe
    const {proyecto} = req.body;

    try {

        //Revisar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar que el usuario autenticado sea dueño del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Se crea la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyeto
exports.obtenerTarea  = async(req, res) => {

    //Extraer el proyecto y comprobar si existe
    const {proyecto} = req.query;

    try {

        //Revisar si existe el proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar que el usuario autenticado sea dueño del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar tarea
exports.actualizarTarea = async(req, res) => {

    //Extraer el proyecto y comprobar si existe
    const {proyecto, nombre, estado} = req.body;

    try {

         //Revisar si la tarea existe o no
         let existeTarea = await Tarea.findById(req.params.id);
         if(!existeTarea){
             return res.status(404).json({msg: 'No existe la tarea'})
         }

         //Extraer proyecto
         const existeProyecto = await Proyecto.findById(proyecto);
 
         //Revisar que el usuario autenticado sea dueño del proyecto
         if(existeProyecto.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No Autorizado'});
         }

         //Crear un objeto con la nueva información
         const nuevaTarea = {};
         //Con los if se actualizará solo la información que el usuario haya modificado
         nuevaTarea.nombre = nombre;
         nuevaTarea.estado = estado;

        //Guardar la tarea
        existeTarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new: true});

        res.json({existeTarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {

    try {

        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        //Revisar si la tarea existe o no
        let existeTarea = await Tarea.findById(req.params.id);
        if(!existeTarea){
            return res.status(404).json({msg: 'No existe la tarea'})
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar que el usuario autenticado sea dueño del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar tarea
        await Tarea.findOneAndRemove({_id : req.params.id});
        res.json({msg: 'La tarea se eliminó exitosamente'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
