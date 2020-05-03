const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crea proyectos
//api/proyecto
router.post('/',
    auth,
    [
        check('nombre', 'El nombre el proyecto es obligatorio').not().isEmpty()    
    ],
    proyectoController.crearProyecto
);

//Obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//Actualizar un proyecto vía ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre el proyecto es obligatorio').not().isEmpty()    
    ],
    proyectoController.actualizarProyecto
);

//Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;