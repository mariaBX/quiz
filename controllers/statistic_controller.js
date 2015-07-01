var models = require('../models/models.js');

exports.load = function(req, res, next){
// Total preguntas
	models.Quiz.count().then(function(count_quiz){ 
    // Total comentarios
    models.Comment.count().then(function(count_comment){
			models.Quiz.count({distinct: true, include: 
			[{model: models.Comment, required: true}]}).then(function(quiz_with_comment) {
				res.render('statistic/index', { count_quiz:           count_quiz,
                                           count_comment:        count_comment,
                                           mean_comment:         (count_comment/count_quiz).toFixed(2),
                                           quiz_with_comment:    quiz_with_comment,
                                           quiz_without_comment: count_quiz - quiz_with_comment,
                                           errors: []});
			});
		});
	});
}; 