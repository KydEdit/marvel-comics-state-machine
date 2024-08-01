/* eslint-disable no-unreachable */
import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
// import setContent from '../../utils/setContent';

import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(410);
    const [charEnded, setCharEnded] = useState(false);
        // loading, error,
    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        // onCharListLoaded();
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));
    }

    // const onCharListLoading = () => {
    //     setNewItemLoading(true);
    // }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        // setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    // const onError = () => {
    //     setError(true);
    //     setLoading(loading => false);
    // }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <CSSTransition 
                    key={item.id}
                    timeout={500}
                    classNames="char__item">
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    // const items = renderItems(charList);

    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading && !newItemLoading ? <Spinner/> : null;
    // const content = !(loading || error) ? items : null;

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
    // eslint-disable-next-line
    }, [process]);

    return (
        <div className="char__list">
            {/* {errorMessage}
            {spinner} */}
            {/* {content} */}
            {/* {items} */}
            {elements}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;