/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose'
import { env } from '../../config/env.config'
import jwt from 'jsonwebtoken'
import { TokensRepository } from './tokens.repository'
import { TokenContext, Token } from './tokens.interface'

class TokensService {
  private generateToken(user_id: string, expiresIn: string, otherParams?: object) {
    const key = env.JWT_SECRET
    const payload = {
      user_id,
      ...(otherParams ? { ...otherParams } : {}),
    }
    const token = jwt.sign(payload, key, { expiresIn })
    return token
  }

  public async findAndVerifyToken<T = any>(token: string, context: TokenContext) {
    const findToken = await TokensRepository.findOne({ value: token, context })

    if (!findToken) {
      return null
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as T

    if (!decoded) {
      return null
    }

    return decoded
  }

  public async createToken(payload: Omit<Token, 'token'>, otherParams?: object) {
    const token = this.generateToken(payload.user_id.toString(), '24h', otherParams)
    await this.deleteTokens(payload.context, undefined, payload.user_id)

    const createdToken = await TokensRepository.create({
      ...payload,
      token,
    })

    return createdToken ? token : null
  }

  public async createAccessRefreshTokens(payload: Pick<Token, 'user_id'>) {
    const accessToken = this.generateToken(payload.user_id.toString(), '15m')
    const refreshToken = this.generateToken(payload.user_id.toString(), '1h', {
      ...payload,
      context: 'refreshToken',
      bucket: 'user',
    })

    await this.deleteTokens('refreshToken', undefined, payload.user_id)

    await TokensRepository.create({
      ...payload,
      token: refreshToken,
      context: 'refreshToken',
      bucket: 'user',
    })

    return { accessToken, refreshToken }
  }

  public async deleteTokens(context: TokenContext, code?: string, userId?: Types.ObjectId) {
    const filter = {
      context,
      ...(code ? { value: code } : {}),
      ...(userId ? { user_id: userId } : {}),
    }
    return TokensRepository.deleteMany(filter)
  }
}

export default new TokensService()
