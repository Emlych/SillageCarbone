import SearchHero from "../containers/SearchProduct/SearchHero.container";
import CarouselHome from "../containers/Home/Caroussel.container";
import "../styling/home.css";

const Home = () => {
	const articles = [
		{
			title: "Secteur du transport",
			text: "Le projet Sillage Carbone s'intègre dans le contexte du transport maritime et son impact sur l'environnement. En 2020, le transport maritime représente près de 100000 navires transportant 10 milliards de tonnes de marchandises pour un marché total de 2000 milliards d'euros. Ainsi, le transport maritime assure 90% des volumes transportés du commerce mondial, ce qui peut se traduire par 9 biens de consommation sur 10 qui passent à un moment sur l'eau avant d'arriver à son lieu d'achat. ",
		},
		{
			title: "Notre démarche",
			text: "Aujourd'hui, il n'existe aucun moyen de calculer l'empreinte carbone d'un produit en fonction du type de transport maritime qu'il aura utilisé (propulsion vélique ou thermique, tonneaux maximum par bateau, attente au mouillage...). Proposer un outil de modélisation et de diffusion de cette information semble donc présenter un enjeu environnemental et sociétal important",
		},
		{
			title: "Méthodologie",
			text: "L’objectif du projet est dual. Dans un premier temps, pouvoir fournir un outil pour promouvoir la responsabilité sociétale des entreprises (RSE) dont une partie de l'activité repose sur le transport maritime de bien ou de personnes. L'objectif est alors de calculer l'empreinte carbone marine associée dans une partie backend afin de fournir un outil de modélisation pertinent se basant sur la route prise par les navires (trace AIS - Automatic Identification System). Dans un second temps, pouvoir fournir une interface web dans le but de rendre accessible au grand public ces informations d'empreinte carbone marine pour chaque bien de consommations. L'interface web permettra de fédérer une communauté autour de ces questions tout en éduquant également les utilisateurs sur le transport maritime et les enjeux environnementaux associés. Ce projet s'inscrit donc dans une démarche écoresponsable. Comme le label Green Marine Europe (mettre le lien du label) dont l'objectif est de mesurer des indicateurs de performance (dont les émissions de gaz à effet de serre) mais qui repose principalement sur le bon vouloir des transporteurs.",
		},
	];

	return (
		<div className="home">
			{/* Search bar */}
			<SearchHero />

			{/* Presentation */}
			<CarouselHome articles={articles} />
		</div>
	);
};

export default Home;
