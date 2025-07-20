import './App.css';
import Footer from './components/Core/Footer';
import Hero from './components/Core/Hero';
import Navbar from './components/Core/Navbar';
import Sidebar from './components/Core/Sidebar';
import CurrentStation from './components/Core/CurrentStation';

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
