import fs from "fs/promises"
import { Context } from "hono"
import path from "path"
import { User } from "../../models/user"

const isValidImageType = (mimeType: string) => ["image/jpeg", "image/png", "image/webp"].includes(mimeType)

const refresh = async (c: Context) => {
	try {
		const authHeader = c.req.header("Authorization")
		if (!authHeader) return c.json({ error: "No token provided" }, 401)

		const token = authHeader.split(" ")[1]
		if (!token) return c.json({ error: "Invalid token" }, 401)

		const userToken = await User.findOne({ accessToken: token })
		if (!userToken || userToken.accessToken !== token) {
			return c.json({ error: "Invalid token or permission denied" }, 401)
		}

		const contentType = c.req.header("Content-Type")
		if (!contentType?.startsWith("multipart/form-data")) {
			return c.json({ error: "Invalid content type" }, 400)
		}

		const body = await c.req.parseBody()
		const image = body.avatar as File
		const userId = userToken.uuid

		if (!image || !isValidImageType(image.type)) {
			return c.json({ error: "Invalid image format. Supported formats: JPEG, PNG, WebP" }, 400)
		}

		const user = await User.findOne({ accessToken: token })
		if (!user) {
			return c.json({ error: "User not found" }, 404)
		}

		const avatarsDir = path.join(process.cwd(), "static", "avatars")
		await fs.mkdir(avatarsDir, { recursive: true })

		const fileExtension = image.type.split("/")[1]
		const fileName = `${userId}.${fileExtension}`
		const filePath = path.join(avatarsDir, fileName)

		try {
			const oldAvatarPath = await fs.readdir(avatarsDir)
			const oldAvatar = oldAvatarPath.find((file) => file.startsWith(userId.toString()))
			if (oldAvatar) {
				await fs.unlink(path.join(avatarsDir, oldAvatar))
			}
		} catch (error) {
			console.error("Error while checking/removing old avatar:", error)
		}

		const imageBuffer = Buffer.from(await image.arrayBuffer())
		await fs.writeFile(filePath, imageBuffer)

		const avatarUrl = `/avatars/${fileName}`
		const fullAvatarUrl = `http://${process.env.SERVER__HOST}:${process.env.SERVER__PORT}${avatarUrl}`

		user.avatar = fullAvatarUrl
		await user.save()

		return c.json({
			success: true,
			avatarUrl: fullAvatarUrl,
		})
	} catch (error) {
		console.error("Error details:", error)
		return c.json(
			{
				error: "Ошибка обновления",
				details: error.message,
			},
			500
		)
	}
}

export default refresh
