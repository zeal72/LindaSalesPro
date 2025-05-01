import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../../Firebase.config";
import {
	signInWithPopup,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider
} from "firebase/auth";
import { ref, set } from "firebase/database";
import axios from 'axios';
import Loader from './loader';
import { toast } from 'react-toastify';

export default function AuthPage({ onLogin }) {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Toast configuration
	const toastConfig = {
		// position: toast.POSITION.TOP_RIGHT,
		autoClose: 5000, // 5 seconds
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true
	};

	// Enhanced error logging function
	const logError = (action, error) => {
		const errorInfo = {
			action,
			message: error.message,
			code: error.code,
			timestamp: new Date().toISOString(),
			userEmail: email || 'not provided'
		};

		console.error('Authentication Error:', errorInfo);
		return errorInfo;
	};

	const toggleAuthMode = () => {
		setIsLogin(!isLogin);
		// Reset form fields when toggling
		setEmail("");
		setPassword("");
		setFullName("");
		setSelectedImage(null);
		setPreviewUrl("");
	};

	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const provider = new GoogleAuthProvider();

	const handleGoogleLogin = async () => {
		try {
			setIsLoading(true);

			// Sign in with Google
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Store user info in Firebase Realtime Database
			await set(ref(db, 'users/' + user.uid), {
				username: user.displayName,
				photoURL: user.photoURL,
				email: user.email,
				lastLogin: new Date().toISOString()
			});

			// Success toast with timeout
			setTimeout(() => {
				toast.success('Login successful!', toastConfig);
			}, 300);

			// Execute the callback function on successful login
			onLogin(user);

		} catch (error) {
			const errorInfo = logError('Google Login', error);

			setTimeout(() => {
				if (error.code === 'auth/popup-closed-by-user') {
					toast.info('Login cancelled', toastConfig);
				} else if (error.code === 'auth/popup-blocked') {
					toast.error('Popup was blocked. Please allow popups for this site.', toastConfig);
				} else if (error.code === 'PERMISSION_DENIED') {
					toast.error('Permission denied. Please check your account permissions.', toastConfig);
				} else {
					toast.error(`Login failed: ${error.message}`, toastConfig);
				}
			}, 300);

		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Show loader
			setIsLoading(true);

			if (isLogin) {
				// Login with email/password
				await signInWithEmailAndPassword(auth, email, password);

				setTimeout(() => {
					toast.success('Login successful!', toastConfig);
				}, 300);

				onLogin();

			} else {
				// Create new account with email/password
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;

				let photoURL = '';

				if (selectedImage) {
					try {
						// Upload image to Cloudinary
						const formData = new FormData();
						formData.append('file', selectedImage);
						formData.append('upload_preset', 'Lindasalespro');
						formData.append('cloud_name', 'dx1vcdlqs');

						// Upload the image to Cloudinary
						const cloudinaryResponse = await axios.post(
							'https://api.cloudinary.com/v1_1/dx1vcdlqs/image/upload',
							formData
						);

						// Get the Cloudinary image URL
						photoURL = cloudinaryResponse.data.secure_url;
					} catch (uploadError) {
						logError('Image Upload', uploadError);
						setTimeout(() => {
							toast.warning('Account created but profile image upload failed', toastConfig);
						}, 300);
					}
				}

				// Save user data to Realtime Database
				await set(ref(db, 'users/' + user.uid), {
					username: fullName,
					email: email,
					photoURL: photoURL || '',
					createdAt: new Date().toISOString(),
					lastLogin: new Date().toISOString()
				});

				// 🔥 Update Firebase Auth profile too
				await updateProfile(user, {
					displayName: fullName,
					photoURL: photoURL || ''
				});

				setTimeout(() => {
					toast.success('Account created successfully!', toastConfig);
				}, 300);

				onLogin(user); // user now has displayName and photoURL
			}
		} catch (error) {
			const errorInfo = logError(isLogin ? 'Email Login' : 'Email Signup', error);

			setTimeout(() => {
				if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
					toast.error('Invalid email or password', toastConfig);
				} else if (error.code === 'auth/email-already-in-use') {
					toast.error('This email is already registered. Try logging in instead.', toastConfig);
				} else if (error.code === 'auth/weak-password') {
					toast.error('Password should be at least 6 characters', toastConfig);
				} else if (error.code === 'auth/network-request-failed') {
					toast.error('Network error. Please check your internet connection.', toastConfig);
				} else if (error.code === 'PERMISSION_DENIED') {
					toast.error('Database permission denied. Please contact support.', toastConfig);
				} else {
					toast.error(`Authentication error: ${error.message}`, toastConfig);
				}
			}, 300);

		} finally {
			// Hide loader
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
				<h1 className="text-2xl font-bold text-[#FF9900] text-center mb-8">
					LindasalesPro
				</h1>

				<h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
					{isLogin ? "Login to your account" : "Create a new account"}
				</h2>

				{/* Google login */}
				<button
					type="button"
					onClick={handleGoogleLogin}
					disabled={isLoading}
					className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition mb-6 disabled:opacity-70"
				>
					<FcGoogle size={22} />
					<span className="text-gray-700 font-semibold">
						{isLogin ? "Login with Google" : "Sign up with Google"}
					</span>
				</button>

				<div className="relative mb-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-white px-3 text-gray-500">or</span>
					</div>
				</div>

				{/* Form */}
				<form className="space-y-6" onSubmit={handleSubmit}>
					{!isLogin && (
						<div>
							<label className="block text-gray-600 mb-2" htmlFor="fullName">
								Full Name
							</label>
							<input
								id="fullName"
								type="text"
								placeholder="Enter your full name"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
								required
							/>
						</div>
					)}

					{!isLogin && (
						<div>
							<label className="block text-gray-600 mb-2" htmlFor="photo">
								Profile Photo
							</label>
							<input
								id="photo"
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
							/>
							{previewUrl && (
								<img
									src={previewUrl}
									alt="Preview"
									className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-[#FF9900]"
								/>
							)}
						</div>
					)}

					<div>
						<label className="block text-gray-600 mb-2" htmlFor="email">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
							required
						/>
					</div>

					<div className="relative">
						<label className="block text-gray-600 mb-2" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
							required
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="absolute right-3 top-[52%] transform -translate-y-1/2 text-sm text-[#FF9900] font-semibold hover:underline"
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-[#FF9900] text-white font-semibold py-3 rounded-lg hover:bg-orange-500 transition transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-[#FF9900]"
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<Loader />
								<span className="ml-2">{isLogin ? "Logging in..." : "Signing up..."}</span>
							</div>
						) : (
							isLogin ? "Login" : "Sign Up"
						)}
					</button>
				</form>

				<p className="text-center text-gray-600 text-sm mt-6">
					{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
					<button
						type="button"
						onClick={toggleAuthMode}
						className="text-[#FF9900] hover:underline font-semibold"
					>
						{isLogin ? "Sign up" : "Login"}
					</button>
				</p>
			</div>
		</div>
	);
}