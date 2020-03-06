export interface Data { cities: City[] }

export interface City {
    name: string
    trivia?: CityTrivia
}

export interface CityTrivia {
    population: number
    factoid: StringFactoid | HomeOfFactoid
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

export const data: Data = {
    cities: [
        {
            name: "Atlanta"
        },
        {
            name: "Dallas",
            trivia: {
                population: 1341000,
                factoid: {
                    type: "string",
                    fact: "Site of JFK assassination"
                }
            }
        }
    ]
}
