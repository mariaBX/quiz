// GET /quizes/question
// Dame las preguntas del concurso
var models = require ('../models/models.js');
exports.question = function(req, res) {
  models.Quiz.findAll().then ( function (quiz){
    res.render('quizes/question',{pregunta: quiz[0].pregunta})
  })
};
//GET /quizes/answer
//Dame las respuestas del concurso
exports.answer = function (req, res) {
  var texto_respuesta = "Incorrecto";
  models.Quiz.findAll().then(function(quiz){
    if (req.query.respuesta === quiz[0].respuesta) {
      texto_respuesta = "Correcto";
    }
    res.render('quizes/answer', {respuesta: texto_respuesta});
  })    
};    