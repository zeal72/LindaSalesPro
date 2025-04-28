import React from 'react'
import RocketCard from "../components/ProductCard";
import OffersGrid from "../components/OffersGrid";
import AddOfferButton from "../components/AddOfferButton";
const OffersPage = () => {
	return (
		<div>
			<RocketCard />
			<AddOfferButton />
			<OffersGrid />
		</div>
	)
}

export default OffersPage