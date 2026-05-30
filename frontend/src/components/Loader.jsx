const Loader = ({ message = 'Loading...' }) => (
  <div className="loader-container">
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

export default Loader;
