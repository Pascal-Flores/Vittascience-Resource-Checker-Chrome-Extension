export type Resource = {
    id              : number,
    user            : User,
    title           : string,
    description     : string,
    duration        : number,
    views           : number,
    difficulty      : number,
    lang            : string,
    support         : number,
    img             : string,
    link            : string,
    createdAt       : Timestamp,
    updatedAt       : Timestamp,
    rights          : number,
    fork            : Resource  | null,
    folder          : any       | null,
    format          : boolean   | null,
    optionalData    : any       | null,
    forksCount      : number

}

export type Fork = {
    id : number,
    user : User,

}
export type Timestamp = {
    date : string
    timezone_type : number,
    timezone : string
}

export type User = {
    id : number,
    firstname : string,
    surname : string,
    picture : string,
    pseudo : string

}