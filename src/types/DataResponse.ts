import { HttpStatusCode } from "axios"

export interface DataResponse<T> {
   success: boolean
   code: HttpStatusCode
   message: string
   data?: T
   errors: string
}
