import { axiosInstance } from '@/lib/Axios'
import { DataResponse } from '@/types/DataResponse'

export const http = {
   get: async <T>(url: string): Promise<T> => {
      const res = await axiosInstance.get<DataResponse<T>>(url)
      return res.data as T
   },

   post: async <T, D = unknown>(url: string, data: D): Promise<T> => {
      const res = await axiosInstance.post<DataResponse<T>>(url, data)
      return res.data as T
   },

   put: async <T, D = unknown>(url: string, data: D): Promise<T> => {
      const res = await axiosInstance.put<DataResponse<T>>(url, data)
      return res.data as T
   },

   delete: async <T>(url: string): Promise<T> => {
      const res = await axiosInstance.delete<DataResponse<T>>(url)
      return res.data as T
   }
}
