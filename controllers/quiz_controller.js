// GET /quizes/question
// Dame las preguntas del concurso
var models = require ('../models/models.js');
exports.index = function(req,res) {
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes})
  })
};

exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then ( function (quiz){
    res.render('quizes/show',{quiz: quiz})
  })
};
//GET /quizes/answer
//Dame las respuestas del concurso
exports.answer = function (req, res) {
  var texto_respuesta = "Incorrecto";
  models.Quiz.find(req.params.quizId).then(function(quiz){
    if (req.query.respuesta === quiz.respuesta) {
      texto_respuesta = "Correcto";
    }
    res.render('quizes/answer', {quiz:quiz, respuesta: texto_respuesta});
  })    
};    