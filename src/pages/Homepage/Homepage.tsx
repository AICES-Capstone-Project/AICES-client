import Banner from "../Homepage/partials/Banner";
const sectionVariants = {
	hidden: { opacity: 0, y: 40 },
	show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};


export default function Homepage() {
	return (
		<>
			<Banner />
		</>
	);
}
