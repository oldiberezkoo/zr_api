import mongoose from "mongoose"
import { log } from "../utils/log"

const connect = () => {
	try {
		mongoose.connect(process.env.MONGODB_URI! as string, {
			minPoolSize: Number(process.env.MONGODB_minPoolSize!),
			maxPoolSize: Number(process.env.MONGODB_maxPoolSize!),
		})
		log("INFO", "Соединение с базой данных установлено")
		log("DEBUG", `Минимальный количество подключений: ${process.env.MONGODB_minPoolSize}`)
		log("DEBUG", `Максимальный количество подключений: ${process.env.MONGODB_maxPoolSize}`)
	} catch (error) {
		log("ERROR", "Ошибка при подключении к базе данных")
	}
}

export default connect
