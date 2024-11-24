export const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  };
  
  export const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };