import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { EntityNotFoundError } from "typeorm";
import { User } from "../../../database/entities/User";
import { AuthController } from "../controllers/auth.controller";
import { AuthCredentials } from "../types/auth.type";

configDotenv();

export const refreshTokens: Record<string, any> = {};

export const generateJWT = (user: User, role: string) => {
  return jwt.sign(
    {
      user: user.id,
      name: `${user.lastname ?? ""} ${user.firstname ?? ""}`,
      role: role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
    // { expiresIn: "5s" }
  );
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: "2d",
    subject: user.id,
  });
};

export const logIn = async (credentials: AuthCredentials, role: string) => {
  const user = await User.query(
    "select id, lastname, firstname from v_user_lib where email=$1 and pwd=crypt($2, pwd) and role_code = $3 limit 1",
    [credentials.email, credentials.pwd, role]
  );
  if (user.length == 0) {
    throw new EntityNotFoundError(User, "");
  }

  const refreshToken = generateRefreshToken(user[0]);
  !refreshTokens[user[0].id] && (refreshTokens[user[0].id] = new Set());
  refreshTokens[user[0].id].add(refreshToken);

  return [generateJWT(user[0], role), refreshToken];
};

export const signup = async (user: User) => {
  try {
    const newUser = await User.query(
      "insert into user_profiles (lastname, email, pwd, id_role) values ($1,$2,crypt($3, gen_salt('bf')), 'ROLE02')",
      [user.lastname, user.email, user.pwd]
    );

    return newUser;
  } catch (error) {
    throw error;
  }
};

export const getMe = async (id: string) => {
  try {
    const user = await User.findOne({
      where: { id },
      select: [
        "id",
        "lastname",
        "firstname",
        "email",
        "birthday",
        "gender",
        "avatarPath",
      ],
      relations: ["role"],
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (user: User, id: string) => {
  try {
    let current = await User.findOne({ where: { id } });
    if (current) {
      current.lastname = user.lastname;
      current.firstname = user.firstname;
      current.birthday = user.birthday;
      current.email = user.email;
      current.gender = user.gender;
    }
    const res = await current.save();
    return res;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const updatePassword = async (
  data: Record<string, string>,
  id: string
) => {
  console.log(data);
  let current = await User.getRepository()
    .createQueryBuilder()
    .where("id= :id and pwd = crypt(:pwd ,pwd)", { id, pwd: data.oldPwd })
    .getOne();

  if (current) {
    console.log(data.newPwd);

    await User.getRepository().query(
      "update user_profiles set pwd=crypt($1, gen_salt('bf')) where id=$2",
      [data.newPwd, id]
    );
  } else {
    throw new EntityNotFoundError(User, "");
  }
};

export const validateRefreshToken = async (
  req: Request,
  res: Response,
  token: string
) => {
  try {
    // if (!token) {
    //   res
    //     .json({ ok: false, error: "Invalid token" })
    //     .status(StatusCodes.BAD_REQUEST);
    //   return;
    // }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      console.log(refreshTokens);

      if (err) {
        res
          .json({ ok: false, error: "Invalid token" })
          .status(StatusCodes.BAD_REQUEST);
        return;
      }
      if (
        !refreshTokens[decoded.sub as string] ||
        !refreshTokens[decoded.sub as string].has(token)
      ) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ ok: false, error: "Invalid refresh token" });
        return;
      }

      refreshTokens[decoded.sub as string].delete(token);

      const user = await User.findOne({
        where: { id: decoded.sub as string },
        relations: { role: true },
      });
      if (!user) {
        throw new EntityNotFoundError(User, "");
      }

      AuthController.generateAccessToken(req, res, user);
      return;
    });
  } catch (error) {
    // throw error;
    console.log(error);
  }
};
