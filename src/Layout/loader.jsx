import React from 'react';

const Loader = ({ size = 'medium' }) => {
	// Size variations (in pixels)
	const sizes = {
		small: 16,
		medium: 24,
		large: 32
	};

	// Get actual size value
	const pixelSize = sizes[size] || sizes.medium;

	return (
		<div className="inline-block relative ">
			{/* Main spinner */}
			<div
				style={{
					width: `${pixelSize}px`,
					height: `${pixelSize}px`,
					borderWidth: `${Math.max(2, pixelSize / 8)}px`
				}}
				className="animate-spin rounded-full border-solid border-[#FF9900] border-t-transparent"
			></div>

			{/* Pulsing inner circle */}
			<div
				style={{
					width: `${pixelSize * 0.6}px`,
					height: `${pixelSize * 0.6}px`,
					top: `${pixelSize * 0.2}px`,
					left: `${pixelSize * 0.2}px`,
				}}
				className="absolute rounded-full bg-orange-200 animate-ping opacity-75"
			></div>

			{/* Static inner circle */}
			<div
				style={{
					width: `${pixelSize * 0.4}px`,
					height: `${pixelSize * 0.4}px`,
					top: `${pixelSize * 0.3}px`,
					left: `${pixelSize * 0.3}px`,
				}}
				className="absolute rounded-full bg-[#FF9900]"
			></div>
		</div>
	);
};

export default Loader;