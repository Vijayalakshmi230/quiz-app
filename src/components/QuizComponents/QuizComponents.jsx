import axios from 'axios';
import React, { useEffect, useState } from 'react';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      axios.get('https://quizapi.io/api/v1/questions', {
        params: {
          apiKey: 'Qfr2AIzCz26TlLaL6HivpgNyJ4EaGEtJ2VTRV0xS',
          difficulty: 'Medium',
          limit: 10
        }
      })
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
    }
  }, [quizStarted]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      if (question.correct_answer === answers[question.id]) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setReviewMode(false); // Show the score after submission
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
  };

  const previousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(null);
    setReviewMode(false);
  };

  return (
    <div>
      <h1>Quiz App</h1>
      {!quizStarted ? (
        <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
      ) : reviewMode ? (
        <div>
          <h2>Review Your Answers</h2>
          {questions.map(question => (
            <div key={question.id}>
              <p>{question.question}</p>
              {Object.entries(question.answers).map(([key, value]) => (
                <div key={key}>
                  <label>
                    <input 
                      type="radio" 
                      name={question.id} 
                      value={key} 
                      disabled
                      checked={answers[question.id] === key} 
                    />
                    {value}
                  </label>
                </div>
              ))}
              {question.correct_answer && (
                <p>Correct Answer: {question.answers[question.correct_answer]}</p>
              )}
            </div>
          ))}
          <button onClick={() => setReviewMode(false)}>Back to Score</button>
        </div>
      ) : score === null ? (
        questions.length > 0 && (
          <div>
            <p>{questions[currentQuestionIndex].question}</p>
            {Object.entries(questions[currentQuestionIndex].answers).map(([key, value]) => (
              value && (
                <div key={key}>
                  <input 
                    type="radio" 
                    name={questions[currentQuestionIndex].id} 
                    value={key} 
                    checked={answers[questions[currentQuestionIndex].id] === key}
                    onChange={() => handleAnswer(questions[currentQuestionIndex].id, key)} 
                  />
                  <label>{value}</label>
                </div>
              )
            ))}
            <div>
              <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
              {currentQuestionIndex < questions.length - 1 && (
                <button onClick={nextQuestion}>Next</button>
              )}
              {currentQuestionIndex === questions.length - 1 && (
                <button onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </div>
        )
      ) : (
        <div>
          <p>Score: {score} / {questions.length}</p>
          <button onClick={() => setReviewMode(true)}>Review Answers</button>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
