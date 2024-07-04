import { nanoid } from "nanoid";
import { QuestionData } from "../App";
import he from "he";

interface QuestionProps extends QuestionData {
  selectAnswer: Function;
  quizCompleted: boolean;
}

// if quiz completed, change styling on radio btns, disable clicking of btns

export default function Question(props: QuestionProps) {
  const answers = props.answers.map((answer) => {
    const answerId = nanoid();

    const answerStyle = () => {
      let answerStyle = `radio--btn`;

      const currentAnswerSelected = props.selectedAnswer === answer;

      if (!currentAnswerSelected) return answerStyle;

      if (!props.quizCompleted) return answerStyle + " selected";

      const correctAnswer = props.selectedAnswer === props.correctAnswer;

      const incorrectAnswer = props.selectedAnswer !== props.correctAnswer;

      if (correctAnswer) return answerStyle + " correct--answer";

      if (incorrectAnswer) return answerStyle + " incorrect--answer";
    };

    return (
      <div
        className={answerStyle()}
        onClick={() => props.selectAnswer(props.id, answer)}
        key={answerId}
      >
        <input
          className="radio--btn--input"
          onChange={() => props.selectAnswer(props.id, answer)}
          name={props.id}
          id={answerId}
          value={answer}
          checked={props.selectedAnswer === answer} // Ensure the radio button reflects the selected state
          type="radio"
        />
        <label className="radio--btn--input" htmlFor={answerId}>
          {he.decode(answer)}
        </label>
      </div>
    );
  });
  return (
    <div>
      <h4 className="question">{he.decode(props.question)}</h4>
      <fieldset className="answers">{answers}</fieldset>
    </div>
  );
}
