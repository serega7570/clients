export type Client = {
    id: string;
    fio: string;
    address: string;
    email: string;
    company: Company;
};

export type Company = {
    id: string;
    name: string;
};

export type Address = {
    address: string;
};
