import { heroes } from '../data/heroes';

export const getHeroesByPublisher = ( publisher ) => {

    const validPublishers = ['Hamburguesa', 'Extras'];

    if ( !validPublishers.includes( publisher ) ) {
        throw new Error(`Publisher "${ publisher }" no es correcto`);
    }

    return heroes.filter( hero => hero.publisher === publisher );

}
