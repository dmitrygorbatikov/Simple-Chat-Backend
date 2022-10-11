export interface IRoom {
    name: string
    messages: IMessage[]
    users: IUser[]
}

export interface IUser {
    id: string
    name: string
}

export interface IMessage {
    type: string
    name: string
    value: string
    date: Date
}