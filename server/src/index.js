import { connectToDb } from './config/mongoDb.js';
import app from './app.js';
import env from './utils/validateEnv.js'

const port = env.PORT || 6000;

if (!port || !env.MONGODB_URI) {
  throw new Error(
    'Please make sure the env file is in place and populated with a port number'
  );
}

connectToDb()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server is connected to port:${port}`);
      });
    } catch (error) {
      console, log('Cannot connect to server');
    }
  })
  .catch(() => {
    console.log('Invalid database connection');
  });
