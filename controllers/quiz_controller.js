// GET /quizes/question
// Dame las preguntas del concurso
var models = require ('../models/models.js');
// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};
exports.index = function(req,res) {
  var search = '';
  if (req.query.search){
    search = req.query.search.replace(/\s+/g, '%');
  }
  search = '%' + search + '%';
  models.Quiz.findAll({where : ["pregunta like ? order by pregunta", search]}).then(
    function(quizes){   
      res.render('quizes/index', {quizes: quizes})
    }
  ).catch(function(error){next(error);})
};

exports.show = function(req, res) {
    res.render('quizes/show',{quiz: req.quiz});
};
//GET /quizes/answer
//Dame las respuestas del concurso
exports.answer = function (req, res) {
  var texto_respuesta = "Incorrecto";
  models.Quiz.find(req.params.quizId).then(function(quiz){
    if (req.query.respuesta === req.quiz.respuesta) {
      texto_respuesta = "Correcto";
    }
    res.render('quizes/answer', {quiz:req.quiz, respuesta: texto_respuesta});
  })    
};  