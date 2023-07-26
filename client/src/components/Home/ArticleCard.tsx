// Component displayed on home page : one title + explanations inside an insert
import "./articlecard.css";

type HomeCardProps = {
	title: string;
	text: string;
};

const ArticleCard = ({ title, text }: HomeCardProps) => {
	return (
		<article className="homecard">
			<h3 className="homecard-title">{title}</h3>
			<div className="homecard-container">
				<div className="homecard-text">{text}</div>
			</div>
		</article>
	);
};

export default ArticleCard;
