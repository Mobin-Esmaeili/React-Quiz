const NextButton = ({ dispatch, answer, index, numQuestions }) => {
  if (index < numQuestions - 1) {
    return (
      <>
        {answer !== null && (
          <button
            onClick={() => dispatch({ type: "nextQuestion" })}
            className="btn btn-ui"
          >
            Next
          </button>
        )}
      </>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <button
        onClick={() => dispatch({ type: "finished" })}
        className="btn btn-ui"
      >
        Finish
      </button>
    );
  }
};

export default NextButton;
