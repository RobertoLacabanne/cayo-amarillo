import React, { useMemo } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { getHeroById } from '../../selectors/getHeroById';
import { useContext } from 'react';

export const HeroScreen = ({ history }) => {

    const { heroeId } = useParams();

    const hero = useMemo(() => getHeroById( heroeId ), [ heroeId ]);

    if ( !hero ) {
        return <Redirect to="/" />;
    }

    const handleReturn = () => {

        if( history.length <=2 ) {
            history.push('/');
        } else {
            history.goBack();
        }

    }

    const {
        superhero,
        publisher,
        first_appearance,
    } = hero;
    
    return (
        <div className="row mt-5">
            <div className="col-4">
                <img 
                    src={ `../assets/heroes/${ heroeId }.jpg` }
                    alt={ superhero }
                    className="img-thumbnail animate__animated animate__fadeInLeft"
                />
            </div>

            <div className="col-8 animate__animated animate__fadeIn">
                <h3> { superhero } </h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">  <b>{ publisher }</b>  </li>
                    <li className="list-group-item"> <b>Ingredientes: </b> { first_appearance } </li>
                </ul>
                


                <button 
                    className="btn btn-outline-info text-warning"
                    onClick={ handleReturn }
                >
                    Volver
                </button>

            </div>

        </div>
    )
}
