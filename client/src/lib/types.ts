export type Yard = {
    id: number
    name: string
    subsidiary: string
    areas: Area[]
}

export type Area = {
    id: number
    status: string
    yard: string
    delimiter: Delimiter
}

export type Delimiter = {
    upLeft: Point
    upRight: Point
    downRight: Point
    downLeft: Point
}

export type Point = {
    x: number
    y: number
}

export type Bike = {
    id: number
    plate: string
    chassis: string
    model: string
    status: string
    tagCode: string | null
    yard: Yard | null
}