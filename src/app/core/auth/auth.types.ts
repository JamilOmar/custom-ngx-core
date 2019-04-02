export interface AuthConfig {
    url: string;
    clientId?: string;
    organization?: string;
    scope?: string;
    redirectUri;
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