import mongoose from "mongoose"

type role = "root" | "admin" | "manager" | "worker"

interface IUser {
	username: string
	password: string
	avatar?: string
	uuid?: number
	role?: role
	accessToken: string
}

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: false,
	},
	uuid: {
		type: Number,
		required: true,
		unique: true,
	},
	role: {
		type: String,
		required: true,
		default: "worker",
		enum: ["root", "admin", "manager", "worker"],
	},
	accessToken: {
		type: String,
		required: true,
		unique: true,
	},
})

const User = mongoose.model<IUser>("User", userSchema)

export { User }
