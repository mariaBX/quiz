// GET /quizes/question
// Dame las preguntas del concurso
var models = require ('../models/models.js');
// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
              where: {id: Number(quizId)},
              include: [{ model: models.Comment}]
              }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};
exports.index = function(req,res) {
  var search = '';
  var tema = '';
  var query = '';
  if (req.query.search){
    search = req.query.search.replace(/\s+/g, '%');
  }
  search = '%' + search + '%'; 
  if(req.query.tema){
    query = "pregunta like ? and tema = '" + req.query.tema + "' order by pregunta"; 
  }else{
    query = "pregunta like ? order by pregunta";
  } 
  models.Quiz.findAll({where : [query, search]}).then(
    function(quizes){   
      res.render('quizes/index', {quizes: quizes, errors: []});
    }
  ).catch(function(error){next(error)});
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
        quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then (function (){
          res.redirect('/quizes')})      
      }
   }
  );
};

//GETT quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;  //autoload de instancia de quiz
  res.render('quizes/edit',{quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  req.quiz.validate().then (
    function (err){
      if (err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }else{
        req.quiz //guarda los cambios en la BBDD
        .save ({fields: ["pregunta", "respuesta", "tema"]} )
        .then (function(){res.redirect('/quizes');} );
      }
    } 
  );  
};

// DELETE quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then ( function(){
    res.redirect('/quizes');  
  }).catch(function (error){next(error)});
};