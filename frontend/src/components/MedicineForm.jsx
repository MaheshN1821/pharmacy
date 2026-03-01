import { useState, useEffect } from "react";

const XIcon = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

const PillIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
		<path d="m8.5 8.5 7 7" />
	</svg>
);

const HashIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="4" y1="9" x2="20" y2="9" />
		<line x1="4" y1="15" x2="20" y2="15" />
		<line x1="10" y1="3" x2="8" y2="21" />
		<line x1="16" y1="3" x2="14" y2="21" />
	</svg>
);

const BuildingIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="7" width="20" height="14" rx="2" />
		<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
	</svg>
);

const BoxIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
		<path d="m3.3 7 8.7 5 8.7-5" />
		<path d="M12 22V12" />
	</svg>
);

const RupeeIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M6 3h12" />
		<path d="M6 8h12" />
		<path d="m6 13 8.5 8" />
		<path d="M6 13h3" />
		<path d="M9 13c6.667 0 6.667-10 0-10" />
	</svg>
);

const CalendarIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="3" y="4" width="18" height="18" rx="2" />
		<line x1="16" y1="2" x2="16" y2="6" />
		<line x1="8" y1="2" x2="8" y2="6" />
		<line x1="3" y1="10" x2="21" y2="10" />
	</svg>
);

const AlertIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" y1="8" x2="12" y2="12" />
		<line x1="12" y1="16" x2="12.01" y2="16" />
	</svg>
);

// Shared input class builder
const inputClass = (hasError) =>
	`w-full h-[38px] px-3 text-[13.5px] text-slate-900 rounded-lg outline-none transition-all duration-150 border-[1.5px] appearance-none
  ${
		hasError
			? "border-red-500 bg-red-50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
			: "border-slate-200 bg-slate-50 focus:border-slate-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,23,42,0.06)]"
	}`;

const labelClass =
	"text-xs font-medium text-gray-700 flex items-center gap-1.5";
const sectionLabelClass =
	"text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-3";
const errorClass =
	"flex items-center gap-1 text-[11.5px] text-red-500 font-medium";

function MedicineForm({ medicine, onSubmit, onCancel }) {
	const [formData, setFormData] = useState({
		name: "",
		medicine_code: "",
		description: "",
		manufacturer: "",
		stock_quantity: 0,
		reorder_level: 10,
		price_per_unit: 0,
		batch_number: "",
		expiry_date: "",
		generic_name: "",
		category: "",
		cost_price: 0,
		mrp: 0,
		supplier_name: "",
		status: "active",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (medicine) {
			setFormData({
				name: medicine.name || "",
				medicine_code: medicine.medicine_code || "",
				manufacturer: medicine.manufacturer || "",
				stock_quantity: medicine.stock_quantity || 0,
				reorder_level: medicine.reorder_level || 10,
				price_per_unit: medicine.price_per_unit || 0,
				batch_number: medicine.batch_number || "",
				description: medicine.description || "",
				expiry_date: medicine.expiry_date || "",
				generic_name: medicine.generic_name || "",
				category: medicine.category || "",
				cost_price: medicine.cost_price || 0,
				mrp: medicine.mrp || 0,
				supplier_name: medicine.supplier_name || "",
				status: medicine.status || "active",
			});
		}
	}, [medicine]);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = "Medicine name is required";
		if (!formData.medicine_code.trim())
			newErrors.medicine_code = "Medicine code is required";
		if (formData.price_per_unit <= 0)
			newErrors.price_per_unit = "Price must be greater than 0";
		if (formData.stock_quantity < 0)
			newErrors.stock_quantity = "Stock quantity cannot be negative";
		if (formData.reorder_level < 0)
			newErrors.reorder_level = "Reorder level cannot be negative";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "number" ? parseFloat(value) || 0 : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		onSubmit(formData);
	};

	const statusOptions = [
		{ value: "active", label: "Active", color: "#16a34a" },
		{ value: "low_stock", label: "Low Stock", color: "#d97706" },
		{ value: "expired", label: "Expired", color: "#dc2626" },
		{ value: "out_of_stock", label: "Out of Stock", color: "#6b7280" },
	];

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .mf-root { font-family: 'DM Sans', sans-serif; }
        @keyframes mf-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mf-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .mf-overlay-anim { animation: mf-fade-in 0.18s ease; }
        .mf-modal-anim   { animation: mf-slide-up 0.22s cubic-bezier(0.34,1.2,0.64,1); }
        .mf-input-placeholder::placeholder { color: #c1c9d6; }
        .mf-scrollbar::-webkit-scrollbar { width: 4px; }
        .mf-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .mf-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>

			{/* Overlay */}
			<div
				className="mf-root mf-overlay-anim fixed inset-0 z-[1000] flex items-center justify-center p-4"
				style={{
					background: "rgba(10,14,23,0.65)",
					backdropFilter: "blur(4px)",
				}}
			>
				{/* Modal */}
				<div
					className="mf-modal-anim bg-white rounded-2xl w-full max-w-[640px] max-h-[92vh] overflow-hidden flex flex-col"
					style={{
						boxShadow:
							"0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
					}}
					role="dialog"
					aria-modal="true"
					aria-labelledby="mf-title"
				>
					{/* Header */}
					<div className="flex items-center justify-between px-7 py-[22px] border-b border-[#f0f0f0] bg-[#fafafa] shrink-0">
						<div className="flex items-center gap-2.5">
							{/* Icon badge */}
							<div className="w-[34px] h-[34px] bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
								<PillIcon />
							</div>
							<div>
								<p
									id="mf-title"
									className="text-base font-semibold text-slate-900 tracking-[-0.2px] m-0"
								>
									{medicine ? "Edit Medicine" : "Add New Medicine"}
								</p>
								<p className="text-xs text-slate-400 font-normal m-0">
									{medicine
										? "Update the details below"
										: "Fill in the details to add a new medicine"}
								</p>
							</div>
						</div>
						{/* Close button */}
						<button
							type="button"
							onClick={onCancel}
							aria-label="Close"
							className="w-8 h-8 border border-slate-200 bg-white rounded-lg flex items-center justify-center cursor-pointer text-slate-500 shrink-0 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
						>
							<XIcon />
						</button>
					</div>

					{/* Body */}
					<div className="mf-scrollbar overflow-y-auto px-7 py-6 flex-1">
						<form id="medicine-form" onSubmit={handleSubmit} noValidate>
							{/* — Basic Information — */}
							<p className={sectionLabelClass}>Basic Information</p>
							<div className="grid grid-cols-2 gap-3.5 mb-3.5">
								{/* Name */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-name">
										<span className="text-gray-400">
											<PillIcon />
										</span>
										Medicine Name{" "}
										<span className="text-red-500 text-[11px]">*</span>
									</label>
									<input
										id="mf-name"
										className={`mf-input-placeholder ${inputClass(!!errors.name)}`}
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="e.g. Paracetamol 500mg"
									/>
									{errors.name && (
										<span className={errorClass}>
											<AlertIcon />
											{errors.name}
										</span>
									)}
								</div>

								{/* Code */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-code">
										<span className="text-gray-400">
											<HashIcon />
										</span>
										Medicine Code{" "}
										<span className="text-red-500 text-[11px]">*</span>
									</label>
									<input
										id="mf-code"
										className={`mf-input-placeholder ${inputClass(!!errors.medicine_code)}`}
										type="text"
										name="medicine_code"
										value={formData.medicine_code}
										onChange={handleChange}
										placeholder="e.g. MED-001"
									/>
									{errors.medicine_code && (
										<span className={errorClass}>
											<AlertIcon />
											{errors.medicine_code}
										</span>
									)}
								</div>

								{/* Manufacturer */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-manufacturer">
										<span className="text-gray-400">
											<BuildingIcon />
										</span>
										Manufacturer
									</label>
									<input
										id="mf-manufacturer"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="text"
										name="manufacturer"
										value={formData.manufacturer}
										onChange={handleChange}
										placeholder="e.g. Sun Pharma"
									/>
								</div>

								{/* Batch Number */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-batch">
										<span className="text-gray-400">
											<HashIcon />
										</span>
										Batch Number
									</label>
									<input
										id="mf-batch"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="text"
										name="batch_number"
										value={formData.batch_number}
										onChange={handleChange}
										placeholder="e.g. BT-2024-09"
									/>
								</div>
							</div>

							{/* Divider */}
							<div className="h-px bg-[#f0f0f0] my-5" />

							{/* — Classification — */}
							<p className={sectionLabelClass}>Classification</p>
							<div className="grid grid-cols-2 gap-3.5 mb-3.5">
								{/* Generic Name */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-generic">
										<span className="text-gray-400">
											<PillIcon />
										</span>
										Generic Name
									</label>
									<input
										id="mf-generic"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="text"
										name="generic_name"
										value={formData.generic_name}
										onChange={handleChange}
										placeholder="e.g. Acetaminophen"
									/>
								</div>

								{/* Category */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-category">
										<span className="text-gray-400">
											<HashIcon />
										</span>
										Category
									</label>
									<input
										id="mf-category"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="text"
										name="category"
										value={formData.category}
										onChange={handleChange}
										placeholder="e.g. Analgesic"
									/>
								</div>
							</div>

							{/* Divider */}
							<div className="h-px bg-[#f0f0f0] my-5" />

							{/* — Inventory & Pricing — */}
							<p className={sectionLabelClass}>Inventory &amp; Pricing</p>
							<div className="grid grid-cols-2 gap-3.5 mb-3.5">
								{/* Price */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-price">
										<span className="text-gray-400">
											<RupeeIcon />
										</span>
										Price per Unit (Rs.){" "}
										<span className="text-red-500 text-[11px]">*</span>
									</label>
									<input
										id="mf-price"
										className={`mf-input-placeholder ${inputClass(!!errors.price_per_unit)}`}
										type="number"
										name="price_per_unit"
										value={formData.price_per_unit}
										onChange={handleChange}
										min="0"
										step="0.01"
										placeholder="0.00"
									/>
									{errors.price_per_unit && (
										<span className={errorClass}>
											<AlertIcon />
											{errors.price_per_unit}
										</span>
									)}
								</div>

								{/* Expiry Date */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-expiry">
										<span className="text-gray-400">
											<CalendarIcon />
										</span>
										Expiry Date
									</label>
									<input
										id="mf-expiry"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="date"
										name="expiry_date"
										value={formData.expiry_date}
										onChange={handleChange}
									/>
								</div>

								{/* Stock Quantity */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-stock">
										<span className="text-gray-400">
											<BoxIcon />
										</span>
										Stock Quantity
									</label>
									<input
										id="mf-stock"
										className={`mf-input-placeholder ${inputClass(!!errors.stock_quantity)}`}
										type="number"
										name="stock_quantity"
										value={formData.stock_quantity}
										onChange={handleChange}
										min="0"
										placeholder="0"
									/>
									{errors.stock_quantity && (
										<span className={errorClass}>
											<AlertIcon />
											{errors.stock_quantity}
										</span>
									)}
								</div>

								{/* Reorder Level */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-reorder">
										<span className="text-gray-400">
											<BoxIcon />
										</span>
										Reorder Level
									</label>
									<input
										id="mf-reorder"
										className={`mf-input-placeholder ${inputClass(!!errors.reorder_level)}`}
										type="number"
										name="reorder_level"
										value={formData.reorder_level}
										onChange={handleChange}
										min="0"
										placeholder="10"
									/>
									{errors.reorder_level && (
										<span className={errorClass}>
											<AlertIcon />
											{errors.reorder_level}
										</span>
									)}
								</div>

								{/* Cost Price */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-cost">
										<span className="text-gray-400">
											<RupeeIcon />
										</span>
										Cost Price (Rs.)
									</label>
									<input
										id="mf-cost"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="number"
										name="cost_price"
										value={formData.cost_price}
										onChange={handleChange}
										min="0"
										step="0.01"
										placeholder="0.00"
									/>
								</div>

								{/* MRP */}
								<div className="flex flex-col gap-1.5">
									<label className={labelClass} htmlFor="mf-mrp">
										<span className="text-gray-400">
											<RupeeIcon />
										</span>
										MRP (Rs.)
									</label>
									<input
										id="mf-mrp"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="number"
										name="mrp"
										value={formData.mrp}
										onChange={handleChange}
										min="0"
										step="0.01"
										placeholder="0.00"
									/>
								</div>

								{/* Supplier Name — spans full width */}
								<div className="flex flex-col gap-1.5 col-span-2">
									<label className={labelClass} htmlFor="mf-supplier">
										<span className="text-gray-400">
											<BuildingIcon />
										</span>
										Supplier Name
									</label>
									<input
										id="mf-supplier"
										className={`mf-input-placeholder ${inputClass(false)}`}
										type="text"
										name="supplier_name"
										value={formData.supplier_name}
										onChange={handleChange}
										placeholder="e.g. MedSupply Co."
									/>
								</div>
							</div>

							{/* Divider */}
							<div className="h-px bg-[#f0f0f0] my-5" />

							{/* — Status — */}
							<p className={sectionLabelClass}>Status</p>
							<div className="flex flex-wrap gap-2">
								{statusOptions.map((opt) => {
									const isActive = formData.status === opt.value;
									return (
										<button
											key={opt.value}
											type="button"
											onClick={() =>
												setFormData((prev) => ({ ...prev, status: opt.value }))
											}
											className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium cursor-pointer transition-all duration-150"
											style={
												isActive
													? {
															borderColor: opt.color,
															background: `${opt.color}12`,
															color: opt.color,
														}
													: {
															borderColor: "#e2e8f0",
															background: "#f8fafc",
															color: "#64748b",
														}
											}
										>
											<span
												className="w-1.5 h-1.5 rounded-full shrink-0"
												style={{ background: opt.color }}
											/>
											{opt.label}
										</button>
									);
								})}
							</div>

							{/* Divider */}
							<div className="h-px bg-[#f0f0f0] my-5" />

							{/* — Additional Details — */}
							<p className={sectionLabelClass}>Additional Details</p>
							<div className="flex flex-col gap-1.5">
								<label className={labelClass} htmlFor="mf-description">
									Description
								</label>
								<textarea
									id="mf-description"
									className="mf-input-placeholder w-full px-3 py-2.5 text-[13.5px] text-slate-900 bg-slate-50 border-[1.5px] border-slate-200 rounded-lg outline-none transition-all duration-150 resize-y min-h-[80px] leading-relaxed focus:border-slate-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,23,42,0.06)]"
									name="description"
									value={formData.description}
									onChange={handleChange}
									placeholder="Optional notes about this medicine..."
									rows={3}
								/>
							</div>
						</form>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-end gap-2.5 px-7 py-[18px] border-t border-[#f0f0f0] bg-[#fafafa] shrink-0">
						<button
							type="button"
							onClick={onCancel}
							className="h-[38px] px-[18px] text-[13.5px] font-medium text-slate-500 bg-white border-[1.5px] border-slate-200 rounded-lg cursor-pointer transition-all duration-150 hover:bg-slate-50 hover:border-slate-300 hover:text-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							form="medicine-form"
							className="h-[38px] px-[22px] text-[13.5px] font-semibold text-white bg-slate-900 border-[1.5px] border-slate-900 rounded-lg cursor-pointer tracking-[-0.1px] transition-all duration-150 hover:bg-slate-800 hover:border-slate-800 active:scale-[0.99]"
						>
							{medicine ? "Update Medicine" : "Add Medicine"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default MedicineForm;
