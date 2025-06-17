export const SERVER_URL = 'http://localhost:8080'

export const PATH_URL = {
   CHAT_PAGE: '/',
   AUTH_PAGE: '/auth',
   LOGIN: '/auth/login',
   REGISTER: '/auth/register'
}

export const REACTIONS = [
   { emoji: '👍', type: 'LIKE' },
   { emoji: '❤️', type: 'LOVE' },
   { emoji: '😂', type: 'LAUGH' },
   { emoji: '😢', type: 'SAD' },
   { emoji: '😡', type: 'ANGRY' },
   { emoji: '😮', type: 'WOW' }
] as const

export const REVERSE_REACTIONS = [
   { emoji: 'LIKE', value: '👍' },
   { emoji: 'LOVE', value: '❤️' },
   { emoji: 'LAUGH', value: '😂' },
   { emoji: 'SAD', value: '😢' },
   { emoji: 'ANGRY', value: '😡' },
   { emoji: 'WOW', value: '😮' }
]

export const REVERSE_REACTIONS_MAP = {
    'LIKE': '👍',
    'LOVE': '❤️',
    'LAUGH': '😄',
    'SAD': '😢',
    'ANGRY': '😠',
    'WOW': '😮'
} as const;

