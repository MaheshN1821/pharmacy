import { useState, useEffect } from "react";
import {
	getMedicines,
	createMedicine,
	updateMedicine,
	deleteMedicine,
	getDashboardSummary,
} from "../api";
import {
	Plus,
	Download,
	Filter,
	Eye,
	Edit2,
	Trash2,
	Search,
} from "lucide-react";
import MedicineForm from "../components/MedicineForm";
import MedicineDetailsModal from "../components/MedicineDetailsModal";

function Inventory() {
	const [medicines, setMedicines] = useState([]);
	const [summaryData, setSummaryData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [search, setSearch] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingMedicine, setEditingMedicine] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedMedicine, setSelectedMedicine] = useState(null);
	const [filters, setFilters] = useState({
		status: "", // empty = “all”
		category: "",
		supplier: "",
		expiryBefore: "",
		expiryAfter: "",
	});
	const [showFilter, setShowFilter] = useState(false);
	const toggleFilter = () => setShowFilter((v) => !v);

	const handleShowDetails = (med) => {
		setSelectedMedicine(med);
		setShowDetails(true);
	};

	useEffect(() => {
		loadMedicines();
	}, [filters]);

	const loadMedicines = async (searchTerm = "") => {
		try {
			setLoading(true);
			const response = await getMedicines(0, 50, searchTerm);
			const summaryResponse = await getDashboardSummary();
			const filteredList = response?.data?.filter((m) => {
				if (filters.status && m.status !== filters.status) return false;
				if (
					filters.category &&
					!m.category?.toLowerCase().includes(filters.category.toLowerCase())
				)
					return false;
				if (
					filters.supplier &&
					!m.supplier_name
						?.toLowerCase()
						.includes(filters.supplier.toLowerCase())
				)
					return false;
				if (
					filters.expiryBefore &&
					m.expiry_date &&
					m.expiry_date > filters.expiryBefore
				)
					return false;
				if (
					filters.expiryAfter &&
					m.expiry_date &&
					m.expiry_date < filters.expiryAfter
				)
					return false;
				return true;
			});
			// setMedicines(response.data);
			setMedicines(filteredList);
			setSummaryData(summaryResponse.data);
		} catch (err) {
			console.error("Error loading medicines:", err);
			setError("Failed to load medicines");
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e) => {
		const searchTerm = e.target.value;
		setSearch(searchTerm);
		loadMedicines(searchTerm);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this medicine?")) {
			return;
		}
		try {
			await deleteMedicine(id);
			setMedicines((prev) => prev.filter((m) => m.id !== id));
			setSuccess("Medicine deleted successfully");
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error("Error deleting medicine:", err);
			setError("Failed to delete medicine");
		}
	};

	const handleAddNew = () => {
		setEditingMedicine(null);
		setShowForm(true);
	};

	const handleEdit = (medicine) => {
		setEditingMedicine(medicine);
		setShowForm(true);
	};

	const handleFormSubmit = async (formData) => {
		try {
			let response;
			if (editingMedicine) {
				const expiryStr = formData["expiry_date"] || "2026-02-21";
				const expiryDate = new Date(expiryStr);
				if (isNaN(expiryDate.getTime())) {
					throw new Error("Invalid expiry date");
				}
				const isoExpiry = expiryDate.toISOString();

				formData["expiry_date"] = isoExpiry;

				response = await updateMedicine(editingMedicine.id, formData);
				setMedicines((prev) =>
					prev.map((m) => (m.id === editingMedicine.id ? response.data : m)),
				);
				setSuccess("Medicine updated successfully");
			} else {
				const expiryStr = formData["expiry_date"] || "2026-02-21";
				const expiryDate = new Date(expiryStr);
				if (isNaN(expiryDate.getTime())) {
					throw new Error("Invalid expiry date");
				}
				const isoExpiry = expiryDate.toISOString();

				formData["expiry_date"] = isoExpiry;

				response = await createMedicine(formData);
				setMedicines((prev) => [response.data, ...prev]);
				setSuccess("Medicine added successfully");
			}
			setShowForm(false);
			setEditingMedicine(null);
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error("Error saving medicine:", err);
			setError(err.response?.data?.detail || "Failed to save medicine");
		}
	};

	// if (loading) {
	// 	return (
	// 		<div className="flex items-center justify-center h-screen">
	// 			Loading inventory...
	// 		</div>
	// 	);
	// }

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="px-8 pt-10">
				<div className="max-w-7xl mx-auto">
					<div className="flex justify-between items-start">
						<div>
							<h1
								className="text-2xl font-bolder text-gray-900"
								style={{ fontWeight: "normal" }}
							>
								Pharmacy CRM
							</h1>
							<p className="text-gray-600 text-md pt-2">
								Manage inventory, sales, and purchase orders
							</p>
						</div>
						<div className="flex gap-3">
							<button className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-white border border-blue-100 rounded-xl font-small">
								<Download size={20} />
								Export
							</button>
							<button
								onClick={() => handleAddNew()}
								className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white hover:bg-blue-700 rounded-xl font-small"
							>
								<Plus size={20} />
								Add Medicine
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-6">
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
						{error}
					</div>
				)}
				{success && (
					<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
						{success}
					</div>
				)}

				{showForm && (
					<MedicineForm
						medicine={editingMedicine}
						onSubmit={handleFormSubmit}
						onCancel={() => setShowForm(false)}
					/>
				)}

				{showDetails && (
					<MedicineDetailsModal
						medicine={selectedMedicine}
						onClose={() => setShowDetails(false)}
					/>
				)}

				{/* Summary Cards */}
				<div className="grid grid-cols-4 gap-4 pb-4 mb-6">
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<p className="text-gray-600 text-sm mb-2">Total Items</p>
						<p className="text-2xl text-gray-900">{medicines?.length}</p>
					</div>
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<p className="text-gray-600 text-sm mb-2">Active Stock</p>
						<p className="text-2xl text-gray-900">
							{medicines?.filter((m) => m.status == "active")?.length}
						</p>
					</div>
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<p className="text-gray-600 text-sm mb-2">Low Stock</p>
						<p className="text-2xl text-gray-900">
							{summaryData?.low_stock_items}
						</p>
					</div>
					<div className="bg-white rounded-lg p-4 border border-gray-200">
						<p className="text-gray-600 text-sm mb-2">Total Value</p>
						<p className="text-2xl text-gray-900">
							₹{summaryData?.purchase_order_value}
						</p>
					</div>
				</div>

				{/* Main Content */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-bold text-gray-900">
								Complete Inventory
							</h2>
							<div className="flex gap-2">
								<button
									onClick={toggleFilter}
									className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
								>
									<Filter size={18} />
									Filter
								</button>
								{showFilter && (
									<div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-20 focus:outline-none">
										<div className="mb-2">
											<label className="block text-sm font-medium">
												Status
											</label>
											<select
												value={filters.status}
												onChange={(e) =>
													setFilters((f) => ({
														...f,
														status: e.target.value,
													}))
												}
												className="mt-1 w-full text-sm rounded border border-gray-600"
											>
												<option value="">All</option>
												<option value="active">Active</option>
												<option value="low_stock">Low stock</option>
												<option value="expired">Expired</option>
											</select>
										</div>
										<div className="mb-2">
											<label className="block text-sm font-medium">
												Category
											</label>
											<input
												type="text"
												value={filters.category}
												onChange={(e) =>
													setFilters((f) => ({
														...f,
														category: e.target.value,
													}))
												}
												className="mt-1 w-full px-2 text-sm py-1 rounded border border-gray-600 focus:outline-none"
											/>
										</div>
										{/* add other fields as needed */}
										<div className="flex justify-end space-x-2 mt-4">
											<button
												className="px-3 py-1 border border-gray-600 text-sm text-gray-600 hover:bg-gray-100 rounded"
												onClick={() => setShowFilter(false)}
											>
												Close
											</button>
										</div>
									</div>
								)}
								<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
									<Download size={18} />
									Export
								</button>
							</div>
						</div>

						{/* Search Bar */}
						<div className="mb-6">
							<div className="relative">
								<Search
									className="absolute left-3 top-2.5 text-gray-400"
									size={20}
								/>
								<input
									type="text"
									placeholder="Search medicines..."
									value={search}
									onChange={handleSearch}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
								/>
							</div>
						</div>

						{/* Table */}
						{loading ? (
							<div className="flex items-center justify-center h-[100px]">
								Loading medicines...
							</div>
						) : medicines.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="bg-gray-100 border border-gray-300">
										<tr>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												MEDICINE NAME
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												GENERIC NAME
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												CATEGORY
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												BATCH NO
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												EXPIRY DATE
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												QUANTITY
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												COST/PRICE
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												MRP
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												SUPPLIER
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												STATUS
											</th>
											<th className="px-4 py-3 text-left font-semibold text-gray-700">
												ACTIONS
											</th>
										</tr>
									</thead>
									<tbody>
										{medicines.map((med) => (
											<tr
												key={med.id}
												className="border-b border-l border-r border-gray-200 hover:bg-gray-50"
											>
												<td className="px-4 py-3 text-gray-900 font-medium">
													{med.name}
												</td>
												<td className="px-4 py-3 text-gray-600">
													{med.generic_name}
												</td>
												<td className="px-4 py-3 text-gray-600">
													{med.category}
												</td>
												<td className="px-4 py-3 text-gray-600">
													{med.batch_number}
												</td>
												<td className="px-4 py-3 text-gray-600">
													{med.expiry_date?.split("T")[0] || ""}
												</td>
												<td className="px-4 py-3 text-gray-900 font-medium">
													{med.stock_quantity}
												</td>
												<td className="px-4 py-3 text-gray-600">
													₹{med.cost_price}
												</td>
												<td className="px-4 py-3 text-gray-900">₹{med.mrp}</td>
												<td className="px-4 py-3 text-gray-600">
													{med.supplier_name}
												</td>
												<td className="px-4 py-3" style={{ width: "144px" }}>
													<span
														className={`px-3 py-1 rounded-full text-xs font-medium ${
															med.status === "active"
																? "bg-green-100 text-green-800 border border-green-500"
																: med.status === "low_stock"
																	? "bg-yellow-100 text-yellow-800 border border-yellow-500"
																	: med.status === "expired"
																		? "bg-red-100 text-red-800 border border-red-500"
																		: "bg-gray-100 text-gray-800 border border-gray-500"
														}`}
													>
														{med.status.replace(/_/g, " ").toUpperCase()}
													</span>
												</td>
												<td className="px-4 py-3 flex gap-2">
													<button
														onClick={() => handleShowDetails(med)}
														className="p-1 hover:bg-blue-100 rounded"
													>
														<Eye size={18} className="text-blue-600" />
													</button>
													<button
														onClick={() => handleEdit(med)}
														className="p-1 hover:bg-blue-100 rounded"
													>
														<Edit2 size={18} className="text-blue-600" />
													</button>
													<button
														onClick={() => handleDelete(med.id)}
														className="p-1 hover:bg-red-100 rounded"
													>
														<Trash2 size={18} className="text-red-600" />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-gray-500">No medicines found</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Inventory;
