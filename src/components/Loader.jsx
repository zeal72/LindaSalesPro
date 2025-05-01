// components/Loader.js
export default function Loader() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 w-[100vw] h-[100vh] overflow-hidden">
			<div className="relative w-20 h-20">
				{/* Outer orange ring with spin animation */}
				<div className="absolute w-full h-full border-4 border-[#FF9900]/20 rounded-full"></div>
				<div className="absolute w-full h-full border-4 border-transparent border-t-[#FF9900] rounded-full animate-spin"></div>

				{/* Inner bouncing dots */}
				<div className="absolute inset-0 flex justify-center items-center space-x-1">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="w-2 h-2 bg-[#FF9900] rounded-full animate-bounce"
							style={{ animationDelay: `${i * 0.1}s` }}
						></div>
					))}
				</div>
			</div>
		</div>
	);
}