import { HttpException, ErrorCode } from "./root";

export class UnprocessableEntity extends HttpException {
  constructor(message: string = "Validation failed", errors?: any) {
    super(message, ErrorCode.Unprocessable_Entity, 422, errors);
  }
}
