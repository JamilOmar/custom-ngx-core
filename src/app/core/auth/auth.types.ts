// Auth config type
export interface AuthConfig {
    // auth server url
    url: string;
    // client Id
    clientId?: string;
    // client Secret
    clientSecret?: string;
    // Organization or Tenant
    organization?: string;
    tenant?: string;
    // scope values
    scope?: string;
    // redirect Url - default: based on strategy URL or State
    redirectUrl?:string;
    // forbidden Url - default: based on strategy URL or State
    forbiddentUrl?:string;
    // unauthorized Url - default: based on strategy URL or State
    unauthorizedUrl?:string;
    // Flow type 'implicit' | 'auth'
    authFlowType? : AuthFlowType;
}

// Auth flow Type
export enum AuthFlowType
{
    implicit ='implicit',
    code= 'code'
}
// TODO: Add WsFed Interface and implementation
export interface Wsfed{
    access_token: string;
}
// Profile Type
export interface Profile {
    email: string;
    name: string;
    role: string;
    roles:string[];
    sub: string;
    username: string;
}
// Method for overload requests for authentication
export type urlHandler = (url:string)=> any;
