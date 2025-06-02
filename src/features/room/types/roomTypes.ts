export interface Tenant {
  name: string;
  phone: string;
  aadhar: string;
  deposit: string;
  noticePeriodInMonths: string;
  rentPaid: string;
  rentPaidMethod: string;
}

export interface Bed {
  status: "vacant" | "occupied";
  tenant: Tenant | undefined;
  bedId?: string;
}

export interface Room {
  roomNumber: string;
  type: string;
  rentPerBed: string;
  beds: Bed[];
}

export interface Floor {
  floorNumber: string;
  rooms: Room[];
}

export type ValidationErrorKey =
  | `${number}-${number}-roomNumber`
  | `${number}-${number}-rentPerBed`
  | `${number}-${number}-duplicate`
  | `${number}-${number}-existing`
  | `${number}-${number}-${number}-name`
  | `${number}-${number}-${number}-phone`
  | `${number}-${number}-${number}-aadhar`
  | `${number}-${number}-${number}-deposit`
  | `${number}-${number}-${number}-notice`
  | `${number}-${number}-${number}-rentMethod`;

export interface ValidationErrors {
  [key: string]: string | null;
}

export interface QuickSetup {
  startRoom: string;
  endRoom: string;
  floorNumber: string;
  type: string;
  rentPerBed: string;
  defaultStatus: "vacant" | "occupied";
  defaultTenantTemplate: Tenant;
}

export const defaultTenant: Tenant = {
  name: "",
  phone: "",
  aadhar: "",
  deposit: "",
  noticePeriodInMonths: "1",
  rentPaid: "0",
  rentPaidMethod: "cash",
};

export const defaultBed: Bed = { status: "vacant", tenant: undefined };

export const typeOptions = [
  { value: "single", label: "Single (1 bed)", beds: 1 },
  { value: "double", label: "Double (2 beds)", beds: 2 },
  { value: "triple", label: "Triple (3 beds)", beds: 3 },
  { value: "four", label: "Four (4 beds)", beds: 4 },
  { value: "five", label: "Five (5 beds)", beds: 5 },
  { value: "six", label: "Six (6 beds)", beds: 6 },
];
