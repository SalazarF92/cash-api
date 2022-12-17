import { DataSource, Repository } from "typeorm";
import { compareSync, hashSync } from "bcryptjs";
import { HttpError } from "../../../error/http";
import * as jose from "jose";
import { JWT_SECRET } from "../../../settings";
import { User } from "../entities/user.entity";
import AccountService from "./account";
import { validate } from "class-validator";
import { createSecretKey } from "crypto";
import { UserProps } from "@/application/types/interfaces";
import { UserService } from "@/application/repositories/user-repository";
import { Replace } from "@/helpers/Replace";

export default class UserServiceDB implements UserService {
  private userRepository: Repository<User>;
  private accountService: AccountService;
  constructor(source: DataSource) {
    this.userRepository = source.getRepository(User);
    this.accountService = new AccountService(source);
  }

  public async login({ username, password }: Replace<UserProps, { id?: string }>) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect(["user.password"])
      .where("user.username = :username", { username })
      .getOne();
    // const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user) throw new HttpError(404, "User not found");

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) throw new HttpError(400, "Invalid password");

    const sessionToken = this.generateSessionToken({ id: user.id });

    return sessionToken;
  }

  async create({ username, password }: Replace<UserProps, { id?: string }>): Promise<User | null>{
    const usernameAlreadExists = await this.userRepository.findOne({
      where: { username: username },
    });

    if (usernameAlreadExists)
      throw new HttpError(400, "Username já cadastrado");

    const validation = this.userRepository.create({ username, password });

    const errors = await validate(validation);

    if (errors.length > 0) {
      throw new HttpError(400, errors[0].constraints);
    }
    const hashedPassword = hashSync(password, 12 + 1);
    validation.password = hashedPassword;

    const user = await this.userRepository.save(validation);

    const accountId = await this.accountService.create();

    await this.userRepository.update(user.id, {
      accountId,
    });

    const userWithAccount = await this.userRepository.findOne({
      where: { id: user.id },
    });

    return userWithAccount;
  }

  public async findOneById(id : string, withPasword = false) {
    const user = this.userRepository
      .createQueryBuilder("user")
      .addSelect(withPasword ? ["user.password"] : [])
      .leftJoinAndSelect("user.account", "account")
      .where("user.id = :id", { id })
      .getOne();

    if (!user) throw new HttpError(404, "User not found");

    return user;
  }

  public async generateSessionToken(payload: any) {
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(createSecretKey(JWT_SECRET, "utf-8"));

    return token;
  }
}
