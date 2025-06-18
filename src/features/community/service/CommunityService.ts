import { axiosInstance } from '@/lib/Axios'
import { SERVER_URL } from '@/utils/Constant'

export const createCommunity = async (
   type: 'GROUP' | 'CHANNEL',
   data: { name: string; coverImage: string; description: string; members: number[] }
) => {
   const url = `${SERVER_URL}/api/chats/create?type=${type}`

   try {
      // Sử dụng data là object thường
      const jsonData = {
         name: data.name,
         coverImage: data.coverImage,
         description: data.description,
         members: Array.isArray(data.members) ? data.members : []
      }

      console.log('Sending request to:', url)
      console.log('Request type:', type)
      console.log('Request data:', {
         ...jsonData,
         coverImage: jsonData.coverImage ? 'base64_image_data' : 'empty'
      })

      const response = await axiosInstance.post(url, jsonData, {
         headers: {
            'Content-Type': 'application/json'
         }
      })

      console.log('Community created successfully:', response.data)
      return response.data
   } catch (error: any) {
      console.error('Error creating community:', error)

      // Log detailed error information
      if (error.response) {
         console.error('Response data:', error.response.data)
         console.error('Response status:', error.response.status)
         console.error('Response headers:', error.response.headers)
      } else if (error.request) {
         console.error('Request error:', error.request)
      } else {
         console.error('Error message:', error.message)
      }

      throw error
   }
}
