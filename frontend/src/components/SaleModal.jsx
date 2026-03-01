import { useState } from "react";
import { X, ShoppingCart, Loader } from "lucide-react";
import { createSale } from "../api";

export default function SaleModal({ medicines, onClose, onSuccess }) {
	const [formData, setFormData] = useState({
		medicine_id: "",
		quantity_sold: "",
		customer_name: "",
		payment_method: "cash",
		notes: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const selectedMedicine = medicines.find(
		(m) => m.id === parseInt(formData.medicine_id),
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "quantity_sold" || name === "medicine_id" ? value : value,
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
		if (!formData.quantity_sold || parseInt(formData.quantity_sold) <= 0) {
			setError("Please enter valid quantity");
			return;
		}
		if (selectedMedicine.stock_quantity < parseInt(formData.quantity_sold)) {
			setError(
				`Insufficient stock. Available: ${selectedMedicine.stock_quantity}`,
			);
			return;
		}

		try {
			setLoading(true);
			const saleData = {
				medicine_id: parseInt(formData.medicine_id),
				quantity_sold: parseInt(formData.quantity_sold),
				customer_name: formData.customer_name || "Walk-in Customer",
				payment_method: formData.payment_method,
				notes: formData.notes,
			};

			const response = await createSale(saleData);
			onSuccess(response.data);
		} catch (err) {
			setError(
				err.response?.data?.detail ||
					"Failed to create sale. Check stock levels.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-scroll">
			<div className="bg-white rounded-xl shadow-xl w-full mt-24 max-w-md">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center gap-2">
						<ShoppingCart className="text-blue-600" size={24} />
						<h2 className="text-xl font-bold text-gray-900">Create New Sale</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X size={24} />
					</button>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="p-6 space-y-4"
				>
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
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="">Choose a medicine...</option>
							{medicines.map((med) => (
								<option key={med.id} value={med.id}>
									{med.name} - Stock: {med.stock_quantity} (
									{med.mrp || med.price_per_unit}/unit)
								</option>
							))}
						</select>
					</div>

					{/* Quantity */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Quantity Sold *
						</label>
						<input
							type="number"
							name="quantity_sold"
							value={formData.quantity_sold}
							onChange={handleChange}
							min="1"
							max={selectedMedicine ? selectedMedicine.stock_quantity : 0}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter quantity"
							required
						/>
						{selectedMedicine && (
							<p className="text-xs text-gray-500 mt-1">
								Available: {selectedMedicine.stock_quantity} units
							</p>
						)}
					</div>

					{/* Customer Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Customer Name (Optional)
						</label>
						<input
							type="text"
							name="customer_name"
							value={formData.customer_name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Customer name"
						/>
					</div>

					{/* Payment Method */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Payment Method
						</label>
						<select
							name="payment_method"
							value={formData.payment_method}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="cash">Cash</option>
							<option value="card">Card</option>
							<option value="upi">UPI</option>
						</select>
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
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Add any notes..."
							rows="2"
						/>
					</div>

					{/* Summary */}
					{selectedMedicine && formData.quantity_sold && (
						<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">Total Amount:</span> ₹
								{(
									parseInt(selectedMedicine.mrp) *
									parseInt(formData.quantity_sold)
								).toFixed(2)}
							</p>
						</div>
					)}

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
							className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
						>
							{loading ? (
								<>
									<Loader size={18} className="animate-spin" />
									Creating...
								</>
							) : (
								<>
									<ShoppingCart size={18} />
									Create Sale
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
