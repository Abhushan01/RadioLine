import './App.css';
import CurrentStation from './components/CurrentStation';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div>
      <Navbar />
      <main className="pt-25 mx-6">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <Sidebar />
          </div>
          <div className="col-span-3">
            <Hero />
          </div>
          <div>
            <CurrentStation />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
