import { axiosInstance } from '@/lib/Axios'
import { SERVER_URL } from '@/utils/Constant'

export const createCommunity = async (type: 'GROUP' | 'CHANNEL', data: FormData) => {
   const url = `${SERVER_URL}/api/chats/create?type=${type}`

   try {
      // Convert FormData to JSON object
      const membersData = data.get('members') as string
      let membersArray: number[] = []

      try {
         if (membersData) {
            const parsed = JSON.parse(membersData)
            // Đảm bảo parsed là array
            if (Array.isArray(parsed)) {
               membersArray = parsed
            } else {
               console.error('Parsed members is not an array:', parsed)
               membersArray = []
            }
         }
      } catch (error) {
         console.error('Error parsing members JSON:', error)
         console.error('Raw members data:', membersData)
         membersArray = []
      }

      // Final validation
      if (!Array.isArray(membersArray)) {
         console.error('membersArray is not an array, converting to empty array')
         membersArray = []
      }

      const jsonData = {
         name: data.get('chatName'),
         coverImage: data.get('coverImage'),
         description: data.get('description'),
         members: membersArray
      }

      console.log('Sending request to:', url)
      console.log('Request type:', type)
      console.log('Raw members data:', membersData)
      console.log('Parsed members array:', membersArray)
      console.log('Is membersArray an array?', Array.isArray(membersArray))
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
