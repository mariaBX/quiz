// GET /quizes/question
// Dame las preguntas del concurso
exports.question = function(req, res) {
  res.render('quizes/question', {pregunta: 'Capital de Italia'});
};
//GET /quizes/answer
//Dame las respuestas del concurso
exports.answer = function (req, res) {
  var texto_respuesta;
  if (req.query.respuesta === 'Roma') {
    texto_respuesta = "Correcto";
  }else {
    texto_respuesta = "Incorrecto";
  }
  res.render('quizes/answer', {respuesta: texto_respuesta});
};    