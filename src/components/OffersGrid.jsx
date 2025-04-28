// components/OffersGrid.jsx
const offers = [
	{ title: "Data Analytics Training Virtual", price: "₦150,000" },
	{ title: "Frontend Development Bootcamp", price: "₦200,000" },
	{ title: "UI/UX Design Course", price: "₦120,000" },
	{ title: "Digital Marketing Training", price: "₦100,000" },
];

export default function OffersGrid() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
			{offers.map((offer, index) => (
				<div
					key={index}
					className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col p-4"
				>
					{/* Image Placeholder */}
					<div className="bg-gray-300 h-32 w-full rounded-lg" />

					{/* Content */}
					<div className="flex flex-col flex-grow p-4">
						<h3 className="text-sm font-semibold text-black mb-2">{offer.title}</h3>
						<p className="text-md font-bold text-black mb-auto">{offer.price}</p>
					</div>

					{/* Footer */}
					<div className="px-4 pb-4">
						<p className="text-amber-500 text-end font-medium cursor-pointer">More</p>
					</div>
				</div>
			))}
		</div>
	);
}
