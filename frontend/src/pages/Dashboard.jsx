import { useState, useEffect } from "react";
import {
	Download,
	Plus,
	ShoppingCart,
	Package,
	AlertTriangle,
	CheckCircle,
	Search,
	Trash2,
	Edit2,
	Eye,
	TrendingUp,
	Filter,
	DollarSign,
	FileText,
} from "lucide-react";
import {
	getDashboardSummary,
	getRecentSales,
	getMedicines,
	updateMedicine,
	createMedicine,
} from "../api";
import MedicineForm from "../components/MedicineForm";
import MedicineDetailsModal from "../components/MedicineDetailsModal";
import SaleModal from "../components/SaleModal";
import PurchaseModal from "../components/PurchaseModal";

function Dashboard() {
	const [summaryData, setSummaryData] = useState(null);
	const [medicines, setMedicines] = useState([]);
	const [sales, setSales] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("sales");
	const [patientId, setPatientId] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [success, setSuccess] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [editingMedicine, setEditingMedicine] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedMedicine, setSelectedMedicine] = useState(null);
	const [filters, setFilters] = useState({
		status: "",
		category: "",
		supplier: "",
		expiryBefore: "",
		expiryAfter: "",
	});
	const [showSaleModal, setShowSaleModal] = useState(false);
	const [showPurchaseModal, setShowPurchaseModal] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const toggleFilter = () => setShowFilter((v) => !v);

	const handleAddNew = () => {
		setEditingMedicine(null);
		setShowForm(true);
	};

	const handleEdit = (medicine) => {
		setEditingMedicine(medicine);
		setShowForm(true);
	};

	const handleSaleSuccess = (saleData) => {
		setSuccess(
			`Sale created successfully! Invoice: ${saleData.invoice_number}`,
		);
		setShowSaleModal(false);
		loadDashboardData();
		setTimeout(() => setSuccess(null), 3000);
	};

	const handlePurchaseSuccess = (orderData) => {
		setSuccess(
			`Purchase order created successfully! Order ID: ${orderData.id}`,
		);
		setShowPurchaseModal(false);
		loadDashboardData();
		setTimeout(() => setSuccess(null), 3000);
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

	const handleShowDetails = (med) => {
		setSelectedMedicine(med);
		setShowDetails(true);
	};

	useEffect(() => {
		loadDashboardData();
		const interval = setInterval(loadDashboardData, 30000);
		return () => clearInterval(interval);
	}, []);

	const loadDashboardData = async () => {
		try {
			setError(null);
			const [summary, medicineData, salesData] = await Promise.all([
				getDashboardSummary(),
				getMedicines(),
				getRecentSales(5),
			]);
			setSummaryData(summary.data);
			setMedicines(medicineData.data);
			setSales(salesData.data);
		} catch (err) {
			console.error("Dashboard error:", err);
			setError("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	const filteredMedicines = medicines.filter(
		(med) =>
			med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			med.generic_name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const filteredList = medicines.filter((m) => {
		if (filters.status && m.status !== filters.status) return false;
		if (
			filters.category &&
			!m.category?.toLowerCase().includes(filters.category.toLowerCase())
		)
			return false;
		if (
			filters.supplier &&
			!m.supplier_name?.toLowerCase().includes(filters.supplier.toLowerCase())
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

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				Loading dashboard...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F4FAFE]">
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

				{/* Summary Cards */}
				<div className="grid grid-cols-4 gap-4 mb-8">
					{summaryData && (
						<>
							<div className="bg-white rounded-xl shadow-xl p-6">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
										<DollarSign className="text-white" size={24} />
									</div>
									<span className="text-green-600 text-xs bg-emerald-400/20 px-2 py-1 rounded-lg border border-emerald-300 font-medium flex items-center gap-1">
										<TrendingUp size={16} />
										+12.5%
									</span>
								</div>
								<p className="text-2xl text-gray-800">
									₹{summaryData?.total_sales_today?.toLocaleString("en-IN")}
								</p>
								<p className="text-gray-600 text-sm mt-3 -mb-3">
									Today's Sales
								</p>
							</div>

							<div className="bg-white rounded-xl shadow-xl p-6">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl">
										<ShoppingCart className="text-white" size={24} />
									</div>
									<span className="text-blue-600 text-xs bg-blue-300/10 border border-blue-200 px-3 py-1 rounded-lg font-medium flex items-center gap-1">
										32 Orders
									</span>
								</div>
								<p className="text-2xl text-gray-900">
									{summaryData?.items_sold_today}
								</p>
								<p className="text-gray-600 text-sm mt-3 -mb-3">
									Items Sold Today
								</p>
							</div>

							<div className="bg-white rounded-xl shadow-xl p-6">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
										<AlertTriangle className="text-white" size={24} />
									</div>
									<span className="bg-amber-100 border border-amber-300 text-yellow-800 text-xs font-medium px-2 py-1 rounded-lg">
										{summaryData.low_stock_items > 0
											? "Action Needed"
											: "No Action"}
									</span>
								</div>
								<p className="text-2xl text-gray-900">
									{summaryData.low_stock_items}
								</p>
								<p className="text-gray-600 text-sm mt-3 -mb-3">
									Low Stock Items
								</p>
							</div>

							<div className="bg-white rounded-xl shadow-xl p-6">
								<div className="flex items-start justify-between mb-3">
									<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-xl">
										<Package className="text-white" size={24} />
									</div>
									<span className="text-purple-600 bg-purple-300/20 px-2 py-1 border border-purple-300 rounded-lg text-xs font-medium">
										{summaryData?.pending_purchase_orders} Pending
									</span>
								</div>
								<p className="text-2xl text-gray-900">
									₹{summaryData?.purchase_order_value}
								</p>
								<p className="text-gray-600 text-sm mt-3 -mb-3">
									Purchase Orders
								</p>
							</div>
						</>
					)}
				</div>

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

				{showSaleModal && (
					<SaleModal
						medicines={medicines}
						onClose={() => setShowSaleModal(false)}
						onSuccess={handleSaleSuccess}
					/>
				)}

				{showPurchaseModal && (
					<PurchaseModal
						medicines={medicines}
						onClose={() => setShowPurchaseModal(false)}
						onSuccess={handlePurchaseSuccess}
					/>
				)}

				{/* Tabs Section */}
				<div className="bg-white rounded-xl shadow-lg">
					{/* Tab Headers */}
					<div className="flex items-center justify-between px-6 pt-6">
						<div className="flex gap-1 bg-[#F4FAFE] p-1 rounded-3xl w-fit">
							<button
								onClick={() => setActiveTab("sales")}
								className={`flex items-center px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
									activeTab === "sales"
										? "bg-white shadow-sm text-gray-900"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								<ShoppingCart className="mr-2" size={18} />
								Sales
							</button>

							<button
								onClick={() => setActiveTab("purchase")}
								className={`flex items-center px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
									activeTab === "purchase"
										? "bg-white shadow-sm text-gray-900"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								<Package className="mr-2" size={18} />
								Purchase
							</button>

							<button
								onClick={() => setActiveTab("inventory")}
								className={`flex items-center px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
									activeTab === "inventory"
										? "bg-white shadow-sm text-gray-900"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								<FileText className="mr-2" size={18} />
								Inventory
							</button>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setShowSaleModal(true)}
								className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium"
							>
								<Plus size={18} />
								New Sale
							</button>
							<button
								onClick={() => setShowPurchaseModal(true)}
								className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 rounded-lg text-sm font-medium"
							>
								<Plus size={18} />
								New Purchase
							</button>
							{/* <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-sky-500 to-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium">
								<Plus size={18} />
								New Sale
							</button>
							<button className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 rounded-lg text-sm font-medium">
								<Plus size={18} />
								New Purchase
							</button> */}
						</div>
					</div>

					{/* Tab Content */}
					<div className="p-6">
						{activeTab === "sales" && (
							<div>
								<div className="bg-blue-300/10 p-6 pb-2 rounded-2xl">
									<div className="mb-6">
										<p className="text-lg text-gray-900 mb-2">Make a Sale</p>
										<p className="text-gray-600 text-sm mb-4">
											Select medicines from inventory
										</p>

										<div className="flex flex-row flex-wrap align-items justify-between">
											<div className="w-[240px]">
												<input
													type="text"
													placeholder="Patient ID"
													value={patientId}
													onChange={(e) => setPatientId(e.target.value)}
													className="px-4 py-2 w-[240px] bg-white shadow-lg rounded-lg focus:outline-none focus:border-blue-500"
												/>
											</div>
											<div className="flex flex-row relative -ml-20">
												<div>
													<Search
														className="absolute left-3 top-2.5 text-gray-400"
														size={20}
													/>
													<input
														type="text"
														placeholder="Search medicines..."
														value={searchTerm}
														onChange={(e) => setSearchTerm(e.target.value)}
														className="w-[400px] mr-3 pl-10 pr-4 py-2 bg-white shadow-lg rounded-lg rounded-lg focus:outline-none focus:border-blue-500"
													/>
												</div>
												<button className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-lg font-medium text-sm">
													Enter
												</button>
											</div>
											<button className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-sm">
												Bill
											</button>
										</div>
									</div>

									<div className="mb-8 rounded-lg">
										<table className="w-full text-sm rounded-lg">
											<thead className="bg-gray-100 rounded-lg border border-gray-300">
												<tr className="rounded-lg">
													<th className="px-4 py-3 text-left font-semibold text-gray-700">
														MEDICINE NAME
													</th>
													<th className="px-4 py-3 text-left font-semibold text-gray-700">
														GENERIC NAME
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
														MRP/PRICE
													</th>
													<th className="px-4 py-3 text-left font-semibold text-gray-700">
														SUPPLIER
													</th>
													<th className="px-4 py-3 text-left w-fit font-semibold text-gray-700">
														STATUS
													</th>
													<th className="px-4 py-3 text-left font-semibold text-gray-700">
														ACTIONS
													</th>
												</tr>
											</thead>
											<tbody>
												{filteredMedicines.length > 0 ? (
													filteredMedicines.map((med) => (
														<tr
															key={med.id}
															className="bg-white  border-l border-r border-b border-gray-200 hover:bg-gray-50"
														>
															<td className="px-4 py-3 text-gray-900">
																{med.name}
															</td>
															<td className="px-4 py-3 text-gray-600">
																{med.generic_name}
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
															<td className="px-4 py-3 text-gray-900">
																₹{med.mrp}
															</td>
															<td className="px-4 py-3 text-gray-600">
																{med.supplier_name}
															</td>
															<td
																className="px-4 py-3"
																style={{ width: "144px" }}
															>
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
															</td>
														</tr>
													))
												) : (
													<tr>
														<td
															colSpan="9"
															className="px-4 py-8 text-center text-gray-500"
														>
															No medicines found. Search to add medicines to the
															sale.
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								</div>
								<div>
									<p className="text-lg font-normal text-gray-900 my-6">
										Recent Sales
									</p>
									<div className="space-y-3">
										{sales.length > 0 ? (
											sales.map((sale) => (
												<div
													key={sale.id}
													className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
												>
													<div className="flex items-center gap-3">
														<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg">
															<ShoppingCart className="text-white" size={20} />
														</div>
														<div>
															<p className="font-medium text-gray-900">
																INV-{sale.id}
															</p>
															<p className="text-sm text-gray-600">
																{sale.patient_name || "Customer"} •{" "}
																{sale.medicine_count || 1} items
															</p>
														</div>
													</div>
													<div className="text-right flex flex-row items-center justify-center">
														<div>
															<p className="font-semibold text-gray-600">
																₹
																{(sale.total_price || 0).toLocaleString(
																	"en-IN",
																)}
															</p>
															<p className="text-gray-500">
																{sale.sale_date?.split("T")[0] || ""}
															</p>
														</div>
														<div className="text-xs ml-3 font-medium text-green-600 bg-green-600/10 px-3 py-1 rounded-lg">
															Completed
														</div>
													</div>
												</div>
											))
										) : (
											<p className="text-gray-500 text-center py-4">
												No recent sales
											</p>
										)}
									</div>
								</div>
							</div>
						)}

						{activeTab === "purchase" && (
							<div className="p-6 text-center text-gray-500">
								<Package size={48} className="mx-auto mb-3 text-gray-400" />
								<p>Purchase orders section coming soon</p>
							</div>
						)}

						{activeTab === "inventory" && (
							<div>
								<div className="bg-blue-300/10 px-6 pt-4 rounded-lg">
									<p className="text-lg text-gray-900 mb-4">
										Inventory Overview
									</p>
									<div className="grid grid-cols-4 gap-4 pb-4 mb-6">
										<div className="bg-white rounded-lg p-4">
											<p className="text-gray-600 text-sm mb-2">Total Items</p>
											<p className="text-2xl text-gray-900">
												{medicines.length}
											</p>
										</div>
										<div className="bg-white rounded-lg p-4">
											<p className="text-gray-600 text-sm mb-2">Active Stock</p>
											<p className="text-2xl text-gray-900">
												{medicines.filter((m) => m.status == "active").length}
											</p>
										</div>
										<div className="bg-white rounded-lg p-4">
											<p className="text-gray-600 text-sm mb-2">Low Stock</p>
											<p className="text-2xl text-gray-900">
												{summaryData?.low_stock_items}
											</p>
										</div>
										<div className="bg-white rounded-lg p-4">
											<p className="text-gray-600 text-sm mb-2">Total Value</p>
											<p className="text-2xl text-gray-900">
												₹{summaryData?.purchase_order_value}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-bold text-gray-900">
										Complete Inventory
									</h3>
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
										<button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-black hover:bg-gray-50">
											<Download size={18} />
											Export
										</button>
									</div>
								</div>

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
											</tr>
										</thead>
										<tbody>
											{filteredList?.length > 0 ? (
												// {medicines.length > 0 ? (
												// medicines.map((med) => (
												filteredList?.map((med) => (
													<tr
														key={med.id}
														className="border-b border-l border-r border-gray-200 hover:bg-gray-50"
													>
														<td className="px-4 py-3 text-gray-900 font-medium">
															{med.name}
														</td>
														<td className="px-4 py-3 text-gray-600">
															{med?.generic_name}
														</td>
														<td className="px-4 py-3 text-gray-600">
															{med?.category}
														</td>
														<td className="px-4 py-3 text-gray-600">
															{med?.batch_number}
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
														<td className="px-4 py-3 text-gray-900">
															₹{med.mrp}
														</td>
														<td className="px-4 py-3 text-gray-600">
															{med.supplier_name}
														</td>

														<td
															className="px-4 py-3"
															style={{ width: "144px" }}
														>
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
													</tr>
												))
											) : (
												<tr>
													<td
														colSpan="10"
														className="px-4 py-8 text-center text-gray-500"
													>
														No medicines in inventory
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
