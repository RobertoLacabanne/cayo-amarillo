import React from 'react'
import { HeroList } from '../heroes/HeroList'

export const DcScreen = () => {
    return (
        <div>
            <h1 className='text-warning'>Extras</h1>
            <hr />

            <HeroList publisher="Extras" />

        </div>
    )
}
