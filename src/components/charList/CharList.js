import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const {loading, error, getAllCharacters} = useMarvelService();
    
    useEffect(() => {
        onRequest(offset, true);
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }   

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }


    const myRef = useRef([]);

    const onFocusItem = (id) => {
        myRef.current.forEach(item => item.classList.remove('char__item_selected'));
        myRef.current[id].classList.add('char__item_selected');
        myRef.current[id].focus();
    }   

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
      const cards = arr.map((item, i) => {
            let imgClass = item.thumbnail.includes('image_not_available') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};
        
            return (
                <li 
                    className="char__item"
                    ref={el => myRef.current[i] = el}   //в массиве myRef - список ссылок на DOM-элементы <li> 
                    tabIndex={0}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        onFocusItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            onFocusItem(i);
                        }
                    }}    
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgClass}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });  
    
    
        
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid"> 
                {cards}
            </ul>
        )
    }

    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() =>onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;