import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Spaces from './pages/Spaces';
import SpaceDetail from './pages/SpaceDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Messages from './pages/Messages';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Vault from './pages/Vault';
import Settings from './pages/Settings';
import Roadmaps from './pages/Roadmaps';
import Network from './pages/Network';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="explore" element={<Explore />} />
                        <Route path="spaces" element={<Spaces />} />
                        <Route path="spaces/:id" element={<SpaceDetail />} />
                        <Route path="roadmaps" element={<Roadmaps />} />
                        <Route path="events" element={<Events />} />
                        <Route path="events/:id" element={<EventDetail />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="messages/:id" element={<Messages />} />
                        <Route path="profile/:id" element={<Profile />} />
                        <Route path="vault" element={<Vault />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="network" element={<Network />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
