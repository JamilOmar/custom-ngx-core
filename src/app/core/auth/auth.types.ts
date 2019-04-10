export interface AuthConfig {
    url: string;
    clientId?: string;
    clientSecret?: string;
    organization?: string;
    scope?: string;
    redirectUrl:string;
    authFlowType? : AuthFlowType;
}

export enum AuthFlowType
{
    implicit ='implicit',
    auth= 'auth'
}

export interface Wsfed{
    access_token: string;
}

export interface Profile {
    email: string;
    name: string;
    role: string;
    roles:string[];
    sub: string;
    username: string;
}

export interface Auth{

isAuthenticated(): boolean;

login():void;

refreshToken(refreshToken:string):void;

logout(): void;

getAccessToken():string;

getProfile();

configure(config:AuthConfig): void;

onAuthCallback():void;

}

export type urlHandler = (url:string)=> any;
