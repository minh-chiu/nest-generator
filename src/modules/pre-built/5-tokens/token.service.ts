import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EnvStatic } from "src/configurations/static.env";
import { BaseService } from "~base-inherit/base.service";
import { DocumentType } from "~types/document.type";
import { RegisterDto } from "../1-auth/dto/register.dto";
import { User } from "../1-users/schemas/user.schema";
import { getTokenPayloadFromUser } from "../1-users/select/auth.select";
import { DecodedToken, TokenPayload } from "./interface";
import { Token, TokenDocument } from "./schemas/token.schema";

@Injectable()
export class TokenService extends BaseService<TokenDocument> {
	private tokenService: TokenService;

	constructor(
		private readonly jwtService: JwtService,
		@InjectModel(Token.name) model: Model<TokenDocument>,
	) {
		super(model);

		this.tokenService = this;
	}

	async generateUserToken(payload: RegisterDto) {
		const { registerToken } = EnvStatic.getJWTConfig();

		return this._generateToken(
			payload,
			registerToken.secretKey,
			registerToken.expiresIn,
		);
	}

	async generateForgotPasswordToken(user: User & { _id: Types.ObjectId }) {
		const payload: TokenPayload = {
			_id: user._id,
			roles: user.roles,
			userGroupIds: user.userGroupIds,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			phone: user.phone,
			socialID: user.socialID,
			accountType: user.accountType,
		};

		const { forgotPasswordToken } = EnvStatic.getJWTConfig();

		return this._generateToken(
			payload,
			forgotPasswordToken.secretKey,
			forgotPasswordToken.expiresIn,
		);
	}

	async generateAuthTokens(payload: TokenPayload) {
		const [accessToken, refreshToken] = await Promise.all([
			this._generateAccessToken(payload),
			this._generateRefreshToken(payload),
		]);

		return { accessToken, refreshToken };
	}

	async verifyAccessToken(token: string): Promise<DecodedToken> {
		const { accessToken } = EnvStatic.getJWTConfig();

		return this._verifyToken(token, accessToken.secretKey);
	}

	async verifyRefreshToken(token: string): Promise<DecodedToken> {
		const { refreshToken } = EnvStatic.getJWTConfig();

		return this._verifyToken(token, refreshToken.secretKey);
	}

	async verifyUserToken(token: string) {
		const { registerToken } = EnvStatic.getJWTConfig();

		return this._verifyToken(token, registerToken.secretKey);
	}

	async verifyForgotPasswordToken(token: string): Promise<DecodedToken> {
		const { forgotPasswordToken } = EnvStatic.getJWTConfig();

		return this._verifyToken(token, forgotPasswordToken.secretKey);
	}

	async generateUserAuth(user: DocumentType<User>) {
		const payload = getTokenPayloadFromUser(user);

		const { accessToken, refreshToken } =
			await this.generateAuthTokens(payload);

		await this.tokenService.updateOne(
			{ userId: user._id },
			{ userId: user._id, ...refreshToken },
			{ upsert: true },
		);

		return { accessToken, refreshToken, user: getTokenPayloadFromUser(user) };
	}

	async _generateToken(
		payload: Record<string, any>,
		secret: string,
		expiresIn: number,
	) {
		const token = await this.jwtService.signAsync(
			{ ...payload },
			{
				secret,
				expiresIn: `${expiresIn}m`,
			},
		);

		const expiresAt = new Date().getTime() + expiresIn * 60 * 1000;

		return { token, expiresAt };
	}

	async _generateAccessToken(payload: TokenPayload) {
		const { accessToken } = EnvStatic.getJWTConfig();

		return this._generateToken(
			payload,
			accessToken.secretKey,
			accessToken.expiresIn,
		);
	}

	async _generateRefreshToken(payload: TokenPayload) {
		const { refreshToken } = EnvStatic.getJWTConfig();

		return this._generateToken(
			payload,
			refreshToken.secretKey,
			refreshToken.expiresIn,
		);
	}

	async _verifyToken(token: string, secretKey?: string) {
		const config = EnvStatic.getJWTConfig();

		return this.jwtService.verifyAsync(token, {
			secret: secretKey || config.secretKey,
		});
	}
}
