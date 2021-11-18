import { Link } from 'ice';

const Greeting = () => {
  return (
    <div>
      <h2>404</h2>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
};

export default Greeting;
