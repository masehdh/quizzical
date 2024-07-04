import { useEffect, useState } from "react";
import Question from "./components/Question.tsx";
import "./App.css";
import { nanoid } from "nanoid";

export interface QuestionData {
  question: string;
  answers: Array<string>;
  id: string;
  selectedAnswer?: string | null;
  correctAnswer: string;
}

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((resJson) =>
        setQuestions(
          resJson.results.map((question: any) => ({
            ...question,
            answers: shuffleAnswers(
              question.incorrect_answers,
              question.correct_answer
            ),
            correctAnswer: question.correct_answer,
            selectedAnswer: null,
            id: nanoid(),
          }))
        )
      );
  }, [quizStarted]);

  function selectAnswer(questionId: string, answer: string) {
    if (quizCompleted) return;
    setQuestions((prevQuestions: any) => {
      return prevQuestions.map((prevQuestion: QuestionData) => {
        if (prevQuestion.id === questionId) {
          return {
            ...prevQuestion,
            selectedAnswer: answer,
          };
        } else {
          return { ...prevQuestion };
        }
      });
    });
  }

  function checkAnswers() {
    let correctAnswerCount = 0;
    questions.forEach((question) => {
      if (question.selectedAnswer === question.correctAnswer)
        correctAnswerCount++;
    });
    return correctAnswerCount;
  }

  const questionElems = questions.map((question: QuestionData) => {
    return (
      <Question
        key={question.id}
        question={question.question}
        id={question.id}
        answers={question.answers}
        selectAnswer={selectAnswer}
        correctAnswer={question.correctAnswer}
        selectedAnswer={question.selectedAnswer}
        quizCompleted={quizCompleted}
      />
    );
  });

  function shuffleAnswers(
    incorrectAnswers: Array<string>,
    correctAnswer: string
  ) {
    let answers = [...incorrectAnswers, correctAnswer];
    let shuffledAnswers = answers.slice();

    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledAnswers[i], shuffledAnswers[j]] = [
        shuffledAnswers[j],
        shuffledAnswers[i],
      ];
    }

    return shuffledAnswers;
  }

  return (
    <>
      {!quizStarted ? (
        <div className="start--quiz">
          <h1 className="start--quiz--title">Quizzical</h1>
          <p className="start--quiz--subtitle">Some description if needed</p>
          <button
            className="start--quiz--btn"
            onClick={() => setQuizStarted(true)}
          >
            Start quiz
          </button>
        </div>
      ) : (
        <div>
          <div>{questionElems}</div>

          <div className="submit--btn--row">
            {quizCompleted && (
              <p className="submit--txt">
                You scored {`${checkAnswers()}`}/5 correct answers
              </p>
            )}
            <button
              onClick={
                quizCompleted
                  ? () => {
                      setQuizStarted(false);
                      setQuizCompleted(false);
                    }
                  : () => setQuizCompleted(true)
              }
              className="submit--btn"
            >
              {quizCompleted ? "Play again" : "Check answers"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
