import './App.css';
import Header from './components/Header.jsx';
import Home from './pages/Home';
import Footer from './components/Footer.jsx';
import 'remixicon/fonts/remixicon.css';
import 'boxicons/css/boxicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <>
            <Header/>
            <Home/>
            <Footer/>
        </>
    );
}

export default App;
