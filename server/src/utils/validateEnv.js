import { cleanEnv} from 'envalid'
import { str, port} from 'envalid/dist/validators.js'

export default cleanEnv(process.env, {
    MONGODB_URI: str(),
    PORT : port(),
    JWT_ACCESS_TOKEN:str(),
    BREVO_MAIL_KEY : str(),
    HOST : str(),
    USER_MAIL_LOGIN : str(),
    BREVO_PORT : port(),
    BASE_URL : str()
})