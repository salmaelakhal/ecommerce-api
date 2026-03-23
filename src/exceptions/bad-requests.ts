import { HttpException } from "./root";     
import type { ErrorCode } from "./root";    


export class BadRequestsException extends HttpException  {
    constructor(message: string, errorCode: ErrorCode, errors?: any[]) {
        super(message, errorCode, 400, errors?? null);
    }
} 