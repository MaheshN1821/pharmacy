import { useState } from "react";
import { X, Package, Loader } from "lucide-react";
import { createPurchaseOrder } from "../api";

export default function PurchaseModal({ medicines, onClose, onSuccess }) {
	const [formData, setFormData] = useState({
		medicine_id: "",
		quantity_ordered: "",
		supplier_name: "",
		total_cost: "",
		notes: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!formData.medicine_id) {
			setError("Please select a medicine");
			return;
		}
		if (
			!formData.quantity_ordered ||
			parseInt(formData.quantity_ordered) <= 0
		) {
			setError("Please enter valid quantity");
			return;
		}
		if (!formData.supplier_name.trim()) {
			setError("Please enter supplier name");
			return;
		}

		try {
			setLoading(true);
			const orderData = {
				medicine_id: parseInt(formData.medicine_id),
				quantity_ordered: parseInt(formData.quantity_ordered),
				supplier_name: formData.supplier_name,
				total_cost: formData.total_cost
					? parseFloat(formData.total_cost)
					: null,
				notes: formData.notes,
			};

			const response = await createPurchaseOrder(orderData);
			onSuccess(response.data);
		} catch (err) {
			setError(err.response?.data?.detail || "Failed to create purchase order");
		} finally {
			setLoading(false);
		}
	};

	const selectedMedicine = medicines.find(
		(m) => m.id === parseInt(formData.medicine_id),
	);

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-scroll">
			<div className="bg-white rounded-xl shadow-xl mt-16 w-full max-w-md">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center gap-2">
						<Package className="text-purple-600" size={24} />
						<h2 className="text-xl font-bold text-gray-900">
							Create Purchase Order
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X size={24} />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					{/* Medicine Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Select Medicine *
						</label>
						<select
							name="medicine_id"
							value={formData.medicine_id}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							required
						>
							<option value="">Choose a medicine...</option>
							{medicines.map((med) => (
								<option key={med.id} value={med.id}>
									{med.name} - Cost Price: ₹{med.cost_price || "N/A"}
								</option>
							))}
						</select>
					</div>

					{/* Quantity */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Quantity to Order *
						</label>
						<input
							type="number"
							name="quantity_ordered"
							value={formData.quantity_ordered}
							onChange={handleChange}
							min="1"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="Enter quantity"
							required
						/>
					</div>

					{/* Supplier Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Supplier Name *
						</label>
						<input
							type="text"
							name="supplier_name"
							value={formData.supplier_name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="Supplier name"
							required
						/>
					</div>

					{/* Total Cost */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Total Cost (Optional)
						</label>
						<input
							type="number"
							name="total_cost"
							value={formData.total_cost}
							onChange={handleChange}
							step="0.01"
							min="0"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="Total cost"
						/>
						{selectedMedicine &&
							formData.quantity_ordered &&
							selectedMedicine.cost_price && (
								<p className="text-xs text-gray-500 mt-1">
									Estimated: ₹
									{(
										selectedMedicine.cost_price *
										parseInt(formData.quantity_ordered)
									).toFixed(2)}
								</p>
							)}
					</div>

					{/* Notes */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Notes (Optional)
						</label>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							placeholder="Add any notes..."
							rows="2"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
						>
							{loading ? (
								<>
									<Loader size={18} className="animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Package size={18} />
									Create Order
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
