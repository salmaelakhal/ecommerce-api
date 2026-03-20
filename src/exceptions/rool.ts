// message, status code, error codes, error
export class HttpException extends Error {

    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, errors?: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD  = 1003,

    INVALID_TOKEN = 1004,
    UNAUTHORIZED = 1005,
    FORBIDDEN = 1006,
    VALIDATION_ERROR = 1007,
    INTERNAL_SERVER_ERROR = 1008
}