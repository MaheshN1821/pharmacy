// frontend/src/components/MedicineDetailsModal.jsx
import React from "react";

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
		width="13"
		height="13"
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

const CalendarIcon = () => (
	<svg
		width="13"
		height="13"
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

const BoxIcon = () => (
	<svg
		width="13"
		height="13"
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
		width="13"
		height="13"
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

const BuildingIcon = () => (
	<svg
		width="13"
		height="13"
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

const FileTextIcon = () => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
		<polyline points="14 2 14 8 20 8" />
		<line x1="16" y1="13" x2="8" y2="13" />
		<line x1="16" y1="17" x2="8" y2="17" />
		<line x1="10" y1="9" x2="8" y2="9" />
	</svg>
);

const statusConfig = {
	active: { label: "Active", color: "#16a34a" },
	low_stock: { label: "Low Stock", color: "#d97706" },
	expired: { label: "Expired", color: "#dc2626" },
	out_of_stock: { label: "Out of Stock", color: "#6b7280" },
};

function Row({ icon, label, value }) {
	return (
		<div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
			<div className="flex items-center gap-1.5 text-slate-400 shrink-0 min-w-[130px]">
				<span className="shrink-0">{icon}</span>
				<span className="text-[12px] font-medium text-slate-500">{label}</span>
			</div>
			<span className="text-[13px] font-medium text-slate-800 text-right">
				{value ?? "—"}
			</span>
		</div>
	);
}

function MedicineDetailsModal({ medicine, onClose }) {
	if (!medicine) return null;

	const fmt = (d) => (d ? d.split("T")[0] : "—");

	const status = statusConfig[medicine.status] || {
		label: medicine.status,
		color: "#6b7280",
	};

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .md-root { font-family: 'DM Sans', sans-serif; }
        @keyframes md-fade-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes md-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .md-overlay-anim { animation: md-fade-in  0.18s ease; }
        .md-modal-anim   { animation: md-slide-up 0.22s cubic-bezier(0.34,1.2,0.64,1); }
        .md-scrollbar::-webkit-scrollbar       { width: 4px; }
        .md-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .md-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>

			{/* Overlay */}
			<div
				className="md-root md-overlay-anim fixed inset-0 z-50 flex items-center justify-center p-4"
				style={{
					background: "rgba(10,14,23,0.65)",
					backdropFilter: "blur(4px)",
				}}
			>
				{/* Modal */}
				<div
					className="md-modal-anim bg-white rounded-2xl w-full max-w-[480px] max-h-[92vh] overflow-hidden flex flex-col"
					style={{
						boxShadow:
							"0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
					}}
					role="dialog"
					aria-modal="true"
					aria-labelledby="md-title"
				>
					{/* Header */}
					<div className="flex items-center justify-between px-7 py-[22px] border-b border-[#f0f0f0] bg-[#fafafa] shrink-0">
						<div className="flex items-center gap-2.5">
							<div className="w-[34px] h-[34px] bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
								<PillIcon />
							</div>
							<div>
								<p
									id="md-title"
									className="text-base font-semibold text-slate-900 tracking-[-0.2px] m-0 leading-tight"
								>
									{medicine.name}
								</p>
								<p className="text-xs text-slate-400 font-normal m-0 mt-0.5">
									Medicine Details
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close"
							className="w-8 h-8 border border-slate-200 bg-white rounded-lg flex items-center justify-center cursor-pointer text-slate-500 shrink-0 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
						>
							<XIcon />
						</button>
					</div>

					{/* Body */}
					<div className="md-scrollbar overflow-y-auto px-7 py-5 flex-1">
						{/* Status badge */}
						<div className="flex items-center gap-2 mb-5">
							<span
								className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-[1.5px] text-[12px] font-semibold"
								style={{
									borderColor: status.color,
									background: `${status.color}12`,
									color: status.color,
								}}
							>
								<span
									className="w-1.5 h-1.5 rounded-full shrink-0"
									style={{ background: status.color }}
								/>
								{status.label}
							</span>
						</div>

						{/* Section: Identification */}
						<p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-1">
							Identification
						</p>
						<div className="mb-4">
							<Row
								icon={<PillIcon />}
								label="Generic Name"
								value={medicine.generic_name}
							/>
							<Row
								icon={<HashIcon />}
								label="Batch No."
								value={medicine.batch_number}
							/>
							<Row
								icon={<CalendarIcon />}
								label="Expiry Date"
								value={fmt(medicine.expiry_date)}
							/>
						</div>

						{/* Divider */}
						<div className="h-px bg-[#f0f0f0] my-4" />

						{/* Section: Inventory */}
						<p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-1">
							Inventory
						</p>
						<div className="mb-4">
							<Row
								icon={<BoxIcon />}
								label="Stock Quantity"
								value={medicine.stock_quantity}
							/>
							<Row
								icon={<BoxIcon />}
								label="Reorder Level"
								value={medicine.reorder_level}
							/>
						</div>

						{/* Divider */}
						<div className="h-px bg-[#f0f0f0] my-4" />

						{/* Section: Pricing */}
						<p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-1">
							Pricing
						</p>
						<div className="mb-4">
							<Row
								icon={<RupeeIcon />}
								label="Cost Price"
								value={
									medicine.cost_price != null ? `₹${medicine.cost_price}` : "—"
								}
							/>
							<Row
								icon={<RupeeIcon />}
								label="MRP"
								value={medicine.mrp != null ? `₹${medicine.mrp}` : "—"}
							/>
						</div>

						{/* Divider */}
						<div className="h-px bg-[#f0f0f0] my-4" />

						{/* Section: Supplier */}
						<p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-1">
							Supplier
						</p>
						<div className={medicine.description ? "mb-4" : ""}>
							<Row
								icon={<BuildingIcon />}
								label="Supplier"
								value={medicine.supplier_name}
							/>
						</div>

						{/* Description — only if present */}
						{medicine.description && (
							<>
								<div className="h-px bg-[#f0f0f0] my-4" />
								<p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400 mb-2">
									Description
								</p>
								<div className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-3 border border-slate-100">
									<span className="text-slate-400 mt-0.5 shrink-0">
										<FileTextIcon />
									</span>
									<p className="text-[13px] text-slate-600 leading-relaxed m-0">
										{medicine.description}
									</p>
								</div>
							</>
						)}
					</div>

					{/* Footer */}
					<div className="flex items-center justify-end px-7 py-[18px] border-t border-[#f0f0f0] bg-[#fafafa] shrink-0">
						<button
							type="button"
							onClick={onClose}
							className="h-[38px] px-[22px] text-[13.5px] font-semibold text-white bg-slate-900 border-[1.5px] border-slate-900 rounded-lg cursor-pointer tracking-[-0.1px] transition-all duration-150 hover:bg-slate-800 hover:border-slate-800 active:scale-[0.99]"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default MedicineDetailsModal;
