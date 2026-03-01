import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import { healthCheck } from "./api";

function App() {
	const [apiConnected, setApiConnected] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if backend is running
		healthCheck()
			.then(() => setApiConnected(true))
			.catch(() => setApiConnected(false))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="app-loading">
				<div className="spinner"></div>
				<p>Initializing Pharmacy EMR System...</p>
			</div>
		);
	}

	if (!apiConnected) {
		return (
			<div className="api-error">
				<h1>Connection Error</h1>
				<p>Unable to connect to the Pharmacy EMR API backend.</p>
				<p>
					Please ensure the FastAPI server is running on http://localhost:8000
				</p>
				<p>
					Run: <code>python -m uvicorn backend.main:app --reload</code>
				</p>
			</div>
		);
	}

	return (
		<Router>
			<div className="flex">
				<Navigation />
				<main className="flex-1 ml-16">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/inventory" element={<Inventory />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;

// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navigation from "./components/Navigation";
// import Dashboard from "./pages/Dashboard";
// import Inventory from "./pages/Inventory";
// import { healthCheck } from "./api";

// function App() {
// 	const [apiConnected, setApiConnected] = useState(false);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		// Check if backend is running
// 		healthCheck()
// 			.then(() => setApiConnected(true))
// 			.catch(() => setApiConnected(false))
// 			.finally(() => setLoading(false));
// 	}, []);

// 	if (loading) {
// 		return (
// 			<div className="app-loading">
// 				<div className="spinner"></div>
// 				<p>Initializing Pharmacy EMR System...</p>
// 			</div>
// 		);
// 	}

// 	if (!apiConnected) {
// 		return (
// 			<div className="api-error">
// 				<h1>Connection Error</h1>
// 				<p>Unable to connect to the Pharmacy EMR API backend.</p>
// 				<p>
// 					Please ensure the FastAPI server is running on http://localhost:8000
// 				</p>
// 				<p>
// 					Run: <code>python -m uvicorn backend.main:app --reload</code>
// 				</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<Router>
// 			<div className="flex">
// 				<Navigation />
// 				<main className="flex-1 ml-16">
// 					<Routes>
// 						<Route path="/" element={<Dashboard />} />
// 						<Route path="/dashboard" element={<Dashboard />} />
// 						<Route path="/inventory" element={<Inventory />} />
// 					</Routes>
// 				</main>
// 			</div>
// 		</Router>
// 	);
// }

// export default App;

// // import React, { useState, useEffect } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Navigation from "./components/Navigation";
// // import Dashboard from "./pages/Dashboard";
// // import Inventory from "./pages/Inventory";
// // import { healthCheck } from "./api";
// // import "./App.css";

// // function App() {
// // 	const [apiConnected, setApiConnected] = useState(false);
// // 	const [loading, setLoading] = useState(true);

// // 	useEffect(() => {
// // 		// Check if backend is running
// // 		healthCheck()
// // 			.then(() => setApiConnected(true))
// // 			.catch(() => setApiConnected(false))
// // 			.finally(() => setLoading(false));
// // 	}, []);

// // 	if (loading) {
// // 		return (
// // 			<div className="app-loading">
// // 				<div className="spinner"></div>
// // 				<p>Initializing Pharmacy EMR System...</p>
// // 			</div>
// // 		);
// // 	}

// // 	if (!apiConnected) {
// // 		return (
// // 			<div className="api-error">
// // 				<h1>Connection Error</h1>
// // 				<p>Unable to connect to the Pharmacy EMR API backend.</p>
// // 				<p>
// // 					Please ensure the FastAPI server is running on http://localhost:8000
// // 				</p>
// // 				<p>
// // 					Run: <code>python -m uvicorn backend.main:app --reload</code>
// // 				</p>
// // 			</div>
// // 		);
// // 	}

// // 	return (
// // 		<Router>
// // 			<div className="app">
// // 				<Navigation />
// // 				<main className="app-content">
// // 					<Routes>
// // 						<Route path="/" element={<Dashboard />} />
// // 						<Route path="/dashboard" element={<Dashboard />} />
// // 						<Route path="/inventory" element={<Inventory />} />
// // 					</Routes>
// // 				</main>
// // 			</div>
// // 		</Router>
// // 	);
// // }

// // export default App;
