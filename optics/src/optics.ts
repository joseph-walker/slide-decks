import { Lens, Prism, Optional, fromTraversable } from 'monocle-ts';
import { array } from 'fp-ts/lib/Array'

import {
    data,
    Data,
    City,
    CityTrivia,
    StringFactoid,
    HomeOfFactoid
} from './data';

const citiesLens = Lens.fromProp<Data>()('cities');
const citiesTraversal = fromTraversable(array)<City>();
const cityTriviaOption = Optional.fromNullableProp<City>()('trivia');

const cityTriviaFactoidLens = Lens.fromProp<CityTrivia>()('factoid');

const stringFactoidPrism = Prism.fromPredicate<StringFactoid | HomeOfFactoid, StringFactoid>((a): a is StringFactoid => a.type === "string");
const stringFactoidFactLens = Lens.fromProp<StringFactoid>()('fact');

console.log(
    JSON.stringify(
        citiesLens
            .composeTraversal(citiesTraversal)
                .filter(c => c.name === "Dallas")
            .composeOptional(cityTriviaOption)
            .composeLens(cityTriviaFactoidLens)
            .composePrism(stringFactoidPrism)
            .composeLens(stringFactoidFactLens)
            .set("Frozen margarita machine invented here")(data),
        null,
        4
    )
);
