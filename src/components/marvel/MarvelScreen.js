import React from 'react'
import { HeroList } from '../heroes/HeroList'

export const MarvelScreen = () => {
    return (
        <div className="bg-dark">
            <h1 className='text-warning'>Hamburguesas</h1>
            <hr />
            <HeroList publisher="Hamburguesa" />
        </div>
    )
}
