/* eslint-disable no-unreachable */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';
// import uw from '../../resources/img/UW.png';
// import xMen from '../../resources/img/x-men.png';

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

const ComicsList = (props) => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(310);
    const [comicsEnded, setComicsEnded] = useState(false);
        // loading, error,
    const {getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if(newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    function renderComics(arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
        
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    // const items = renderComics(comicsList);

    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {/* {errorMessage}
            {spinner}
            {items} */}
            {setContent(process, () => renderComics(comicsList), newItemLoading)}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


    // return (
    //     <div className="comics__list">
    //         <ul className="comics__grid">
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={uw} alt="ultimate war" className="comics__item-img"/>
    //                     <div className="comics__item-name">ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB</div>
    //                     <div className="comics__item-price">9.99$</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={xMen} alt="x-men" className="comics__item-img"/>
    //                     <div className="comics__item-name">X-Men: Days of Future Past</div>
    //                     <div className="comics__item-price">NOT AVAILABLE</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={uw} alt="ultimate war" className="comics__item-img"/>
    //                     <div className="comics__item-name">ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB</div>
    //                     <div className="comics__item-price">9.99$</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={xMen} alt="x-men" className="comics__item-img"/>
    //                     <div className="comics__item-name">X-Men: Days of Future Past</div>
    //                     <div className="comics__item-price">NOT AVAILABLE</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={uw} alt="ultimate war" className="comics__item-img"/>
    //                     <div className="comics__item-name">ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB</div>
    //                     <div className="comics__item-price">9.99$</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={xMen} alt="x-men" className="comics__item-img"/>
    //                     <div className="comics__item-name">X-Men: Days of Future Past</div>
    //                     <div className="comics__item-price">NOT AVAILABLE</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={uw} alt="ultimate war" className="comics__item-img"/>
    //                     <div className="comics__item-name">ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB</div>
    //                     <div className="comics__item-price">9.99$</div>
    //                 </a>
    //             </li>
    //             <li className="comics__item">
    //                 <a href="/#">
    //                     <img src={xMen} alt="x-men" className="comics__item-img"/>
    //                     <div className="comics__item-name">X-Men: Days of Future Past</div>
    //                     <div className="comics__item-price">NOT AVAILABLE</div>
    //                 </a>
    //             </li>
    //         </ul>
    //         <button 
    //             className="button button__main button__long">

    //             <div className="inner">load more</div>
    //         </button>
    //     </div>
    // )
// }

export default ComicsList;