import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Home } from "lucide-react";

function Navigation() {
	const location = useLocation();

	const isActive = (path) =>
		location.pathname === path ||
		(location.pathname === "/" && path === "/dashboard");

	return (
		<nav className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-6">
			{/* Logo */}
			<Link
				to="/"
				className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
			>
				<Package size={24} />
			</Link>

			{/* Navigation Links */}
			<div className="flex flex-col gap-4">
				<Link
					to="/dashboard"
					className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
						isActive("/dashboard") || isActive("/")
							? "bg-blue-100 text-blue-600"
							: "text-gray-600 hover:bg-gray-100"
					}`}
					title="Dashboard"
				>
					<Home size={24} />
				</Link>
				<Link
					to="/inventory"
					className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
						isActive("/inventory")
							? "bg-blue-100 text-blue-600"
							: "text-gray-600 hover:bg-gray-100"
					}`}
					title="Inventory"
				>
					<Package size={24} />
				</Link>
			</div>
		</nav>
	);
}

export default Navigation;

