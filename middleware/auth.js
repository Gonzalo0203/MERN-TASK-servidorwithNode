const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Leer el token del header
    const token = req.header('x-auth-token');
    //console.log(token);

    //Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay Token, permiso no válido' });
    }

    //Validar el token
    try {
        //Verificar token válido
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); //Para que la ejecución pase al siguiente middleware
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}