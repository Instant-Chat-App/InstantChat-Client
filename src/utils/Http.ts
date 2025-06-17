import { axiosInstance } from '@/lib/Axios'
import { DataResponse } from '@/types/DataResponse'

export const http = {
   get: async <T>(url: string): Promise<DataResponse<T>> => {
      const res = await axiosInstance.get<DataResponse<T>>(url)
      return res.data
   },

   post: async <T, D = unknown>(url: string, data: D): Promise<DataResponse<T>> => {
      const res = await axiosInstance.post<DataResponse<T>>(url, data)
      return res.data
   },

   put: async <T, D = unknown>(url: string, data: D): Promise<DataResponse<T>> => {
      const res = await axiosInstance.put<DataResponse<T>>(url, data)
      return res.data
   },

   delete: async <T>(url: string): Promise<DataResponse<T>> => {
      const res = await axiosInstance.delete<DataResponse<T>>(url)
      return res.data
   }
}
