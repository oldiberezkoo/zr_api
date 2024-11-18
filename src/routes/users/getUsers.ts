import type { Context } from "hono"
import { User } from "../../models/user"
import { log } from "../../utils/log"

const getAllUsers = async (c: Context) => {
	try {
		log("DEBUG", "Получены пользователи")
		const users = await User.find()
		if (!users || users.length === 0) {
			return c.json({ success: false, message: "No users found" })
		}
		const data = users.map((user) => {
			return {
				id: user.uuid,
				username: user.username,
				role: user.role,
				avatar: user.avatar || "https://example.com/default-avatar.jpg"
			}
		})
		return c.json({ success: true, data })
	} catch (error) {
		log("ERROR", "Error fetching users", error)
		return c.json({ success: false, message: "Error retrieving users" })
	}
}

export default getAllUsers
