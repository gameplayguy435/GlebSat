import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUsPage from "./AboutUs";
import ContactsPage from "./Contacts";
import DocumentationPage from "./Documentation";
import GalleryPage from "./Gallery";
import HomePage from "./Home";
import Navigation from "./Navigation";
import NewsPage from "./News";
import Footer from "./Footer";
import "./App.css";

function App() {
	return (
		<Router>
			<div className="flex flex-col min-h-screen">
				<Navigation />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/documentation" element={<DocumentationPage />} />
						<Route path="/about" element={<AboutUsPage />} />
						<Route path="/news" element={<NewsPage />} />
						<Route path="/gallery" element={<GalleryPage />} />
						<Route path="/contact" element={<ContactsPage />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}
export default App;
