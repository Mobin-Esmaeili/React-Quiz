import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const initialState = {
  questions: [],
  // loading , error , ready , active , finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemainig: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" , secondsRemainig: state.questions.length * 30 };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemainig: state.secondsRemainig - 1,
        status: state.secondsRemainig === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown...");
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const numQuestions = state.questions.length;

  const maxPossiblePoints = state.questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/questions.json");
        const data = await response.json();
        dispatch({ type: "dataReceived", payload: data.questions });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
        {state.status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}
        {state.status === "active" && (
          <>
            <Progress
              index={state.index}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              points={state.points}
              answer={state.answer}
            />
            <Questions
              dispatch={dispatch}
              answer={state.answer}
              question={state.questions[state.index]}
            />

            <Footer>
              <NextButton
                index={state.index}
                numQuestions={numQuestions}
                dispatch={dispatch}
                answer={state.answer}
              />
              <Timer
                secondsRemainig={state.secondsRemainig}
                dispatch={dispatch}
              />
            </Footer>
          </>
        )}
        {state.status === "finished" && (
          <FinishScreen
            dispatch={dispatch}
            highscore={state.highscore}
            maxPossiblePoints={maxPossiblePoints}
            points={state.points}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
