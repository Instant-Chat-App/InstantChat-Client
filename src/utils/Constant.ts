export const SERVER_URL = 'http://localhost:8080'  

export const PATH_URL = {
   CHAT_PAGE : '/',
   AUTH_PAGE : '/auth',
   LOGIN: '/auth/login',
   REGISTER: '/auth/register',
}

export const REACTIONS = [
   { emoji: '👍', value: 'LIKE' },
   { emoji: '❤️', value: 'LOVE' },
   { emoji: '😂', value: 'LAUGH' },
   { emoji: '😢', value: 'SAD' },
   { emoji: '😡', value: 'ANGRY' }
]

export const REVERSE_REACTIONS = [
   { emoji: 'LIKE', value: '👍' },
   { emoji: 'LOVE', value: '❤️' },
   { emoji: 'LAUGH', value: '😂' },
   { emoji: 'SAD', value: '😢' },
   { emoji: 'ANGRY', value: '😡' }
];

export const REVERSE_REACTIONS_MAP = new Map(
  REVERSE_REACTIONS.map(item => [item.emoji, item.value])
);
