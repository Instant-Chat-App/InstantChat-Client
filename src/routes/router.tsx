import LoginForm from '@/features/auth/components/LoginForm'
import RegisterForm from '@/features/auth/components/RegisterForm'
import AuthPage from '@/layouts/AuthLayout'
import ChatPage from '@/pages/ChatPage'
import { PATH_URL } from '@/utils/Constant'
import { createBrowserRouter } from 'react-router-dom'

export const routes = createBrowserRouter([
   { path: PATH_URL.CHAT_PAGE, element: <ChatPage /> },
   {
      path: PATH_URL.AUTH_PAGE,
      element: <AuthPage />,
      children: [
         {
            path: PATH_URL.LOGIN,
            element: <LoginForm />
         },
         {
            path: PATH_URL.REGISTER,
            element: <RegisterForm />
         }
      ]
   }
])
