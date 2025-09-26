export type Subsidiary = {
  id: number;
  name: string;
  address: string;
  yards: Yard[];
  tags: Apriltag[];
};

export type SubsidiarySummary = {
  id: number;
  name: string;
  address: string;
};

export type SubsidiaryTags = {
  subsidiary: SubsidiarySummary;
  yards: YardMongo[];
};

export type Yard = {
  id: number;
  name: string;
  subsidiary: string;
  areas: Area[];
  boundary: Point[];
};

export type YardMongo = {
  yard: Yard;
  tags: TagPosition[];
};

export type Area = {
  id: number;
  status: string;
  yard: string;
  boundary: Point[];
};

export type TagPosition = {
  tag: Apriltag;
  bike: BikeSummary | null;
  position: Point;
  areaStatus: string | null;
  inRightArea: boolean;
};

export type Bike = {
  id: number;
  plate: string;
  chassis: string;
  model: string;
  status: string;
  tagCode: string | null;
  yard: Yard | null;
  subsidiary: SubsidiarySummary | null;
};

export type BikeSummary = {
  id: number;
  plate: string;
  chassis: string;
  model: string;
  status: string;
};

export type Apriltag = {
  id: number;
  code: string;
  subsidiary: string;
  bike: string;
};

export type Point = {
  x: number;
  y: number;
};

export type Camera = {
  uriAccess: string;
  transformPoints: Point[];
  yardPoints: Point[];
};

export type SubsidiaryRequest = {
  name: string;
  address: Address;
};

export type Address = {
  street: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
};
