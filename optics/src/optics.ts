import { Lens, Iso, Prism, Optional, fromTraversable } from 'monocle-ts';
import { array } from 'fp-ts/lib/Array'

import {
    data,
    DataSet,
    City,
    CityTrivia,
    Factoid,
    StringFactoid,
    TemperatureReading
} from './data';

const cityTemperatureLens = Lens.fromProp<City>()('temperatures');

const temperatureTraversal = fromTraversable(array)<TemperatureReading>();
const temperatureLens = Lens.fromProp<TemperatureReading>()('degreesK');

const tempKToC = new Iso<number, number>(k => k - 273.15, c => c + 273.15);
const tempCToF = new Iso<number, number>(c => c * (9 / 5) + 32, f => f / (9 / 5) - 32);

const citiesLens = Lens.fromProp<DataSet>()('cities');
const citiesTraversable = fromTraversable(array)<City>();
const cityTriviaOption = Optional.fromNullableProp<City>()('trivia');

const cityTriviaFactoidLens = Lens.fromProp<CityTrivia>()('factoid');

const stringFactoidPrism = Prism.fromPredicate<Factoid, StringFactoid>((a): a is StringFactoid => a.type === "string");
const stringFactoidFactLens = Lens.fromProp<StringFactoid>()('fact');

const degreesCTraversal = citiesLens
    .composeTraversal(citiesTraversable)
    .composeLens(cityTemperatureLens)
    .composeTraversal(temperatureTraversal)
    .composeLens(temperatureLens)
    .composeIso(tempKToC);

const degreesFTraversal = degreesCTraversal
    .composeIso(tempCToF);

console.log(
    JSON.stringify(
        citiesLens
            .composeTraversal(citiesTraversable)
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
