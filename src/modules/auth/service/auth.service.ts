import { configDotenv } from "dotenv";
import * as jwt from "jsonwebtoken";
import { EntityNotFoundError } from "typeorm";
import { User } from "../../../database/entities/User";
import { AuthCredentials } from "../types/auth.type";

configDotenv();

const generateJWT = (user: User, role: string) => {
  return jwt.sign(
    {
      user: user.id,
      name: `${user.lastname ?? ""} ${user.firstname ?? ""}`,
      role: role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const logIn = async (credentials: AuthCredentials, role: string) => {
  const user = await User.query(
    "select id, lastname, firstname from v_user_lib where email=$1 and pwd=crypt($2, pwd) and role_code = $3 limit 1",
    [credentials.email, credentials.pwd, role]
  );
  if (user.length == 0) {
    throw new EntityNotFoundError(User, "");
  }
  return generateJWT(user[0], role);
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
