// components/RocketCard.jsx
import { FaRocket, FaSearch } from "react-icons/fa";
import Hero from '../assets/Hero.png';
import Rocket from '../assets/rocket.png';

export default function RocketCard() {
	return (
		<div
			className="text-white rounded-xl w-full bg-cover bg-center p-8 flex flex-col md:flex-row items-center justify-center"
			style={{ backgroundImage: `url(${Hero})` }}
		>
			{/* Left Section */}
			<div className="flex flex-col items-center text-center space-y-4">
				<h1 className="text-2xl md:text-3xl font-bold text-black">
					Manage Your Products & Offers
				</h1>
				<p className="text-black">
					18 Offers, click the plus ‘+’ button to add more offers
				</p>
				<div className="relative w-full max-w-xs">
					<input
						type="search"
						placeholder="Search Offers"
						className="w-full p-2 pl-10 rounded-lg border-2 border-gray-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-600 outline-none text-black"
					/>
					<FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
				</div>
			</div>

			{/* Right Section (Rocket Image) */}
			<div className="mt-8 md:mt-0 flex justify-center">
				<img src={Rocket} alt="rocket" className="w-20 md:w-28" />
			</div>
		</div>
	);
}
