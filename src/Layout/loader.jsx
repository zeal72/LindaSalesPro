import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Loader = ({
	size = 'medium',
	color = '#FF9900',
	secondaryColor = '#FFF0DB',
	speed = 'normal',
	type = 'spinner',
	label = '',
	showLabel = false,
	className = '',
	fullScreen = false,
	withShadow = false,
	ariaLabel = 'Loading content'
}) => {
	// Size variations (in pixels)
	const sizes = {
		xs: 12,
		small: 16,
		medium: 24,
		large: 32,
		xl: 48
	};

	// Animation speed variations
	const speeds = {
		slow: '1.5s',
		normal: '0.8s',
		fast: '0.5s'
	};

	// Get actual values with fallbacks
	const pixelSize = sizes[size] || sizes.medium;
	const animationDuration = speeds[speed] || speeds.normal;

	// Border width proportional to size but with minimum value
	const borderWidth = Math.max(2, pixelSize / 8);

	// Opacity values for the pulsing effect
	const pulseOpacity = type === 'pulse' ? '1' : '0.75';
	const pulseScale = type === 'pulse' ? '1.5' : '1';

	// Container classes
	const containerClasses = `inline-flex items-center justify-center ${fullScreen ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80' : ''
		} ${className}`;

	// Shadow class for the loader
	const shadowClass = withShadow ? 'shadow-lg' : '';

	// Base styles for the spinner
	const baseSpinnerStyle = {
		width: `${pixelSize}px`,
		height: `${pixelSize}px`,
		borderWidth: `${borderWidth}px`,
		animationDuration
	};

	// Inner elements positioning 
	const getInnerElementStyle = (scaleFactor) => ({
		width: `${pixelSize * scaleFactor}px`,
		height: `${pixelSize * scaleFactor}px`,
		top: `${pixelSize * ((1 - scaleFactor) / 2)}px`,
		left: `${pixelSize * ((1 - scaleFactor) / 2)}px`,
	});

	// Helper function to render specific loader types
	const renderLoader = () => {
		switch (type) {
			case 'dots':
				return (
					<div className="flex space-x-1">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								style={{
									width: `${pixelSize / 3}px`,
									height: `${pixelSize / 3}px`,
									animationDelay: `${i * 0.15}s`,
									animationDuration
								}}
								className={`rounded-full bg-[${color}] animate-bounce ${shadowClass}`}
							/>
						))}
					</div>
				);

			case 'pulse':
				return (
					<div className="relative">
						<div
							style={{
								...baseSpinnerStyle,
								borderColor: 'transparent',
								backgroundColor: color,
								animationDuration
							}}
							className={`rounded-full animate-pulse ${shadowClass}`}
						/>
					</div>
				);

			case 'spinner': // default
			default:
				return (
					<div className="relative">
						{/* Main spinner */}
						<div
							style={{
								...baseSpinnerStyle,
								borderColor: secondaryColor,
								borderTopColor: 'transparent',
								borderLeftColor: color,
								borderRightColor: color,
								borderBottomColor: color
							}}
							className={`animate-spin rounded-full border-solid ${shadowClass}`}
							role="status"
						/>

						{/* Pulsing inner circle */}
						<div
							style={{
								...getInnerElementStyle(0.6),
								animationDuration,
								opacity: pulseOpacity,
								backgroundColor: secondaryColor,
								transform: `scale(${pulseScale})`
							}}
							className="absolute rounded-full animate-ping"
						/>

						{/* Static inner circle */}
						<div
							style={{
								...getInnerElementStyle(0.4),
								backgroundColor: color
							}}
							className="absolute rounded-full"
						/>
					</div>
				);
		}
	};

	return (
		<div className={containerClasses} aria-busy="true" role="status" aria-label={ariaLabel}>
			{renderLoader()}

			{(showLabel && label) && (
				<span
					className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					style={{ fontSize: `${Math.max(10, pixelSize * 0.6)}px` }}
				>
					{label}
				</span>
			)}

			{/* Screen reader only text if no visible label */}
			{(!showLabel || !label) && (
				<span className="sr-only">{ariaLabel}</span>
			)}
		</div>
	);
};

Loader.propTypes = {
	size: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
	color: PropTypes.string,
	secondaryColor: PropTypes.string,
	speed: PropTypes.oneOf(['slow', 'normal', 'fast']),
	type: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
	label: PropTypes.string,
	showLabel: PropTypes.bool,
	className: PropTypes.string,
	fullScreen: PropTypes.bool,
	withShadow: PropTypes.bool,
	ariaLabel: PropTypes.string
};
export default memo(Loader);