import "./ErrorMessage.scss";

function ErrorMessage({ message }) {
  return (
    /* data-testid added for testing: needed to verify error messages are displayed correctly */
    <article className="error-message" data-testid="error-message">
      <p className="error-message__text">{message}</p>
    </article>
  );
}

export default ErrorMessage;
