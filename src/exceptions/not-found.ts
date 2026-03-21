import { HttpException } from "./root";     
import type { ErrorCode } from "./root";    


export class NotfoundException extends HttpException  {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 404, null);
    }
} 