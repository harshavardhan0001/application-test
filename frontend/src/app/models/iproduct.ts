export interface Iproduct {
    id?:number,
    name: string,
    state: string,
    zip: string,
    amount: number,
    quantity: number,
    item: string
}

export interface Inotify {
    success: boolean,
    msg:string
}