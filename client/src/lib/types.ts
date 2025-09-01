export type Subsidiary = {
    id: string
    name: string
    address: string
    yards: Yard[]
    tags: Apriltag[]
}

export type Yard = {
    id: number
    name: string
    subsidiary: string
    areas: Area[]
    boundary: Point[]
}

export type YardTag = {
    yard: Yard
    tags: TagPosition[]
}

export type Area = {
    id: number
    status: string
    yard: string
    boundary: Point[]
}

export type TagPosition = {
    tag: Apriltag
    bike: Bike
    position: Point
    areaStatus: string | null
    inRightArea: boolean
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

export type Apriltag = {
    id: number
    code: string
    subsidiary: string
    bike: string
}

export type Point = {
    x: number
    y: number
}
