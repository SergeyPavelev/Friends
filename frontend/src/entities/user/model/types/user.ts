export interface User {
    username: string;
    email: string;
}

export interface UserSchema {
    authData?: User;
}