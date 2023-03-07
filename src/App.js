import './App.css';
import sitelogo from './SiteLogo.png';
import Navbar from './components/Navbar.js';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <header className="App-header">
        <img src= {sitelogo} alt="logo" />
        <p>
          Welcome to Wheel Call You, where we make your moving experience that much better! To get started, please click the button below:
        </p>
        <button
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign Up Now!
        </button>
      </header>
    </div>
  );
}

export default App;
