import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(false);

    const {loading, error, clearError, getCharacter} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }
    


    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;


    return (
        <div className="char__info">
            {errorMessage}
            {spinner}
            {skeleton}
            {content}
        </div>
    )
    
}

const View = ({char}) => {
    const {name, description, thumbnail, wiki, homepage, comics} = char;
    let imgClass = thumbnail.includes('image_not_available') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};

    return (
        <>
        <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgClass}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
            {comics.length > 0 ? null : 'There is no comics with this character'}
            {
                comics.map((comics, i) => {
    // eslint-disable-next-line
                    if (i >= 10) return;
                    return (
                        <li key={i} className="char__comics-item">
                            {comics.name}
                        </li>
                    )
                })
            }
        </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;