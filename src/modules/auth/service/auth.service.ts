import * as jwt from "jsonwebtoken";
import { EntityNotFoundError } from "typeorm";
import { User } from "../../../database/entities/User";
import { AuthCredentials } from "../types/auth.type";

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
