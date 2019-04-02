export interface Storage{
    getItem(key:string):Promise<string> | string;
    setItem(key:string, value: string);
    removeItem(key:string);
    clear();
}