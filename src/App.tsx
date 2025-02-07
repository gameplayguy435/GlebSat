import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUsPage from "./AboutUs";
import ContactsPage from "./Contacts";
import DocumentationPage from "./Documentation";
import GalleryPage from "./Gallery";
import HomePage from "./Home";
import Navigation from "./Navigation";
import NewsPage from "./News";
import "./App.css";

function App() {
	return (
		<Router>
			<Navigation />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/documentation" element={<DocumentationPage />} />
				<Route path="/about" element={<AboutUsPage />} />
				<Route path="/news" element={<NewsPage />} />
				<Route path="/gallery" element={<GalleryPage />} />
				<Route path="/contact" element={<ContactsPage />} />
			</Routes>
		</Router>
	);
}
export default App;
