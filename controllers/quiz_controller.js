// GET /quizes/question
// Dame las preguntas del concurso
var models = require ('../models/models.js');
// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
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
      res.render('quizes/index', {quizes: quizes, errors: []})
    }
  ).catch(function(error){next(error);})
};

exports.show = function(req, res) {
    res.render('quizes/show',{quiz: req.quiz, errors: []});
};
//GET /quizes/answer
//Dame las respuestas del concurso
exports.answer = function (req, res) {
  var texto_respuesta = "Incorrecto";
  if (req.query.respuesta === req.quiz.respuesta) {
    texto_respuesta = "Correcto";
  }
  res.render('quizes/answer', {quiz:req.quiz, respuesta: texto_respuesta, errors: []});    
};  

//GET /quizes/new
exports.new = function (req, res){
  var quiz = models.Quiz.build(
    {pregunta:"Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz:quiz, errors: []});
};
//POST /quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build (req.body.quiz);
  quiz
  .validate().then(
    function (err){
      if (err){
        res.render('quizes/new', {quiz:quiz, errors: err.errors});
      }else{
        //guarda en BBDD los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta", "respuesta"]}).then (function (){
          res.redirect('/quizes')})      
      }
   }
  );
};