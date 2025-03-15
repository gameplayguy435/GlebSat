import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { keepTheme } from './assets/theme/AppTheme';
import "./assets/styles/App.css";
import FrontLayout from './FrontLayout';
import AboutUsPage from "./AboutUs";
import ContactsPage from "./Contacts";
// import DocumentationPage from "./Documentation"; Probably not needed
import GalleryPage from "./Gallery";
import HomePage from "./Home";
import NewsPage from "./News";
// Back-End Dashboard
import Dashboard from './Admin/Dashboard';
import SignIn from './Admin/authentication/SignIn';
import SignUp from './Admin/authentication/SignUp';
import MainGrid from './Admin/MainGrid';
import ManageContent from './Admin/ManageContent';
import Missions from './Admin/Missions';


function App() {
	if (localStorage.getItem('isLoggedIn') !== 'true') {
		localStorage.setItem('isLoggedIn', 'false');
		localStorage.setItem('email', '');
	}

	useEffect(() => {
		keepTheme();
		AOS.init({
			delay: 300,
			duration: 800,
			easing: 'ease-in-out',
			anchorPlacement: 'top-bottom',
		});
	}, []);
	return (
		<Router>
			<Routes>
				{/* Admin/Back-End Routes */}
				<Route path="/admin/login" element={
					<SignIn	/>
				} />
				<Route path="/admin/signup" element={
					<SignUp	/>
				} />
				<Route path="/admin" element={
					<Dashboard />
				}>
					<Route path="" element={<MainGrid />} />
					<Route path="content" element={<ManageContent />} />
					<Route path="missions" element={<Missions />} />
				</Route>
				
				{/* Front-End Routes */}
				<Route element={<FrontLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/about" element={<AboutUsPage />} />
					<Route path="/news" element={<NewsPage />} />
					<Route path="/gallery" element={<GalleryPage />} />
					<Route path="/contact" element={<ContactsPage />} />
				</Route>
			</Routes>
		</Router>
	);
}
export default App;
