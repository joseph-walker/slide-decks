export interface TemperatureReading {
    timestamp: Date
    degreesK: number
}

export interface StringFactoid {
    type: "string",
    fact: string
}

export interface HomeOfFactoid {
    type: "homeof",
    firstName: string,
    lastName: string
}

export type Factoid = StringFactoid | HomeOfFactoid

export interface CityTrivia {
    population: number
    factoid: Factoid
}

export interface City {
    name: string
    trivia?: CityTrivia
    temperatures: TemperatureReading[]
}

export interface DataSet {
    cities: City[]
}

export const data: DataSet = {
    cities: [
        {
            name: "Atlanta",
            temperatures: [
                {
                    timestamp: new Date(),
                    degreesK: 278.15
                },
                {
                    timestamp: new Date(),
                    degreesK: 279.65
                }
            ]
        },
        {
            name: "Dallas",
            trivia: {
                population: 1341000,
                factoid: {
                    type: "string",
                    fact: "Site of JFK assassination"
                }
            },
            temperatures: [
                {
                    timestamp: new Date(),
                    degreesK: 282.15
                }
            ]
        }
    ]
}