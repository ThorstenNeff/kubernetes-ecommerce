export abstract class CustomError extends Error {
    constructor(message: string) {
        super(); 
    }

    abstract statusCode: number; 

    abstract serializeErrors(): {
        message: string, 
        field?: string
    }[];
}