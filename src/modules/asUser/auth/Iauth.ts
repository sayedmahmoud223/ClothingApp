export interface ISignup {
    userName: string,
    email: string,
    age: number,
    password: string,
}


export interface ILogin {
    email: string,
    password: string,
}

export interface IConfirmEmail {
    vCode?: string
}

