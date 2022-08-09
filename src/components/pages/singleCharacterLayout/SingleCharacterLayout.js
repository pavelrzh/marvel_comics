import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import './singleCharacterLayout.scss';

const SingleCharacterLayout = ({data}) => {

    const {name, description, thumbnail} = data;

    return (
        <div className="single-page__box">
            <Helmet>
                <meta
                    name="description"
                    content={`${name} page`}
                />
                <title>{name}</title>
            </Helmet>
            <div className="single-comic">
                <img src={thumbnail} alt={name} className="single-comic__char-img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{name}</h2>
                    <p className="single-comic__descr">{description}</p>
                </div>
                <Link to='/' className="single-comic__back">Back to all Characters</Link>
            </div>
        </div>
    )
}

export default SingleCharacterLayout;