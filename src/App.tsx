import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { keepTheme } from './assets/theme/AppTheme';
import "./assets/styles/App.css";
import FrontLayout from './FrontLayout';
import AboutUsPage from "./AboutUs";
import ContactsPage from "./Contacts";
import GalleryPage from "./Gallery";
import HomePage from "./Home";
import NewsPage from "./News";
import NewsArticlePage from './NewsArticlePage';
import Dashboard from './Admin/Dashboard';
import SignIn from './Admin/authentication/SignIn';
import ResetPassword from './Admin/authentication/components/ResetPassword';
// import SignUp from './Admin/authentication/SignUp'; Disabled Creating Account
import ManageContent from './Admin/ManageContent';
import Missions from './Admin/Missions';
import ViewMissions from './Admin/ViewMissions';
import DataAnalysis from './Admin/DataAnalysis';


function App() {
	if (localStorage.getItem('isLoggedIn') !== 'true') {
		localStorage.setItem('isLoggedIn', 'false');
		localStorage.setItem('email', '');
		localStorage.setItem('userId', '');
		localStorage.setItem('username', '');
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
		<GoogleReCaptchaProvider reCaptchaKey="6Lf3Jg0rAAAAAMgpee2NImqOTeyO6a7ZxE6RnQPC">
			<Router>
				<Routes>
					<Route path="/admin/login" element={
						<SignIn	/>
					} />
					<Route path="/admin/reset-password" element={
						<ResetPassword />
					} />
					<Route path="/admin" element={
						<Dashboard />
					}>
						<Route path="" element={<DataAnalysis/>} />
						<Route path="content" element={<ManageContent />} />
						<Route path="missions" element={<Missions />} />
						<Route path="missions/:missionId" element={<ViewMissions />} />
					</Route>
					
					<Route element={<FrontLayout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/about" element={<AboutUsPage />} />
						<Route path="/news" element={<NewsPage />} />
						<Route path="/news/article/:id" element={<NewsArticlePage />} />
						<Route path="/gallery" element={<GalleryPage />} />
						<Route path="/contact" element={<ContactsPage />} />
					</Route>
				</Routes>
			</Router>
		</GoogleReCaptchaProvider>
	);
}
export default App;
