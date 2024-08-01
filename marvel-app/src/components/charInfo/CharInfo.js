/* eslint-disable no-unreachable */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

// import Spinner from '../spinner/Spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
// import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';
// import thor from '../../resources/img/thor.jpeg';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(false);
        // loading, error,
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
        // setLoading(false);
    }

    // const onCharLoading = () => {
    //     setLoading(true);
    // }

    // const onError = () => {
    //     setLoading(false);
    //     setError(true);
    // }

    // const setContent = (process, char) => {
    //     switch (process) {
    //         case 'waiting':
    //             return <Skeleton/>;
    //             break;
    //         case 'loading':
    //             return <Spinner/>;
    //             break;
    //         case 'confirmed':
    //             return <View char={char}/>;
    //             break;
    //         case 'error':
    //             return <ErrorMessage/>;
    //             break;
    //         default:
    //             throw new Error('Unexpected process state');
    //     }
    // }

    // const skeleton = char || loading || error ? null : <Skeleton/>;
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {/* {skeleton}
            {errorMessage}
            {spinner}
            {content} */}
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    // console.log(comics[1].resourceURI)

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
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
                    // eslint-disable-next-line
                    // comics.map((item, i) => {
                    comics.slice(0, 10).map((item, i) => {
                        // if (i > 9) return;
                        return (
                            <Link to={`/comics/${item.resourceURI.substring(43)}`} key={i} className="char__comics-item">
                                {item.name}
                            </Link>
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