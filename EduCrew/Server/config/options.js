export const corsOptions = {
    origin: process.env.CLIENT_URL || 'https://edu-crew.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  };
  
  export const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };