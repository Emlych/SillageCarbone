/** Footer with page index and buttons to switch to previous or next page */
import "./pagefooter.css";

type PageFooterProps = {
	page: number;
	maxNumberOfPages: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
};

const PageFooter = ({ page, maxNumberOfPages, setPage }: PageFooterProps) => {
	/**
	 * Change to previous or next page
	 * @param direction
	 */
	const changePage = (direction: "left" | "right") => {
		if (direction === "left" && page !== 1) {
			setPage(page - 1);
		} else if (direction === "right" && page !== maxNumberOfPages) {
			setPage(page + 1);
		}
	};

	return (
		<footer>
			<button
				onClick={() => changePage("left")}
				className={page === 1 ? "empty" : "direction-button"}
			>
				←
			</button>
			<div>
				Page {page} / {maxNumberOfPages}
			</div>
			<button
				onClick={() => changePage("right")}
				className={page === maxNumberOfPages ? "empty" : "direction-button"}
				data-testid="next-button"
			>
				→
			</button>
		</footer>
	);
};
export default PageFooter;
