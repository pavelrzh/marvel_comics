import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }
    
    marvelService = new MarvelService();
    
    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
         
    }

    onRequest = (offset) => {
        this.onNewCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }   

    onNewCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({                  // колбек ф-я для отслеживания предыдущего состояния
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    myRef = [];

    setRef = (ref) => {
        this.myRef.push(ref);
    } 

    onFocusItem = (id) => {
        this.myRef.forEach(item => item.classList.remove('char__item_selected'));
        this.myRef[id].classList.add('char__item_selected');
        this.myRef[id].focus();

    }   

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
      const cards = arr.map((item, i) => {
            let imgClass = item.thumbnail.includes('image_not_available') ? {'objectFit' : 'unset'} : {'objectFit' : 'cover'};
        
            return (
                <li 
                    className="char__item"
                    ref={this.setRef}
                    tabIndex={0}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.onFocusItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.onFocusItem(i);
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

    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{display: charEnded ? 'none' : 'block'}}
                    onClick={() =>this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;