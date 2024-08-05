import * as jwt from "jsonwebtoken";
import { EntityNotFoundError, QueryRunner } from "typeorm";
import { RestoreToken } from "../../../database/entities/RestoreToken";
import { User } from "../../../database/entities/User";
import { verifyToken } from "../../../shared/services/jwt.helper";
import { RESTORE_TOKEN_DURATION } from "../constant/auth.constant";
import crypto = require("crypto");
import fs = require("fs");
import Handlebars = require("handlebars");
import nodemailer = require("nodemailer");

export const restorePwd = async (
  token: string,
  password: string,
  queryRunner: QueryRunner
) => {
  const userToken = await queryRunner.query(
    "select * from restore_token where token = $1 order by expiration_date desc limit 1",
    [token]
  );

  console.log(userToken);

  if (userToken.length == 0) {
    throw new EntityNotFoundError(RestoreToken, "Token");
  }

  await verifyToken(token, process.env.RESTORE_TOKEN_SECRET).catch(
    async (err) => {
      if (userToken.length != 0) {
        await queryRunner.query("delete from restore_token where token = $1", [
          token,
        ]);
      }
      throw new jwt.JsonWebTokenError(err);
    }
  );

  // UPDATE PWD
  await queryRunner.query(
    "update user_profiles set pwd = crypt($1, gen_salt('bf')) where id = $2",
    [password, userToken[0].id_user]
  );
  await queryRunner.query("delete from restore_token where token = $1", [
    token,
  ]);
};

// mailing
export const configureEmailOptions = (
  email: string,
  url: string,
  expirationDate: string
) => {
  const emailTemplate = fs.readFileSync(
    "./src/template/email.template.html",
    "utf-8"
  );
  const compiledTemplate = Handlebars.compile(emailTemplate);
  const html = compiledTemplate({ url, expirationDate });

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.MAIL_ADRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Mémolingua <mialisoamurielle@outlook.com>",
    to: email,
    subject: "Mot de passe oublié",
    html,
    attachments: [
      {
        filename: "logo-memolingua.png",
        path: "./public/img/logo-memolingua.png",
        contentType: "image/png",
        cid: "logo",
      },
    ],
  };

  return { transporter, mailOptions };
};

export const generateAndSaveRestorePwdToken = async (
  email: string,
  queryRunner: QueryRunner
) => {
  try {
    const user = await User.findOneByOrFail({ email });
    const now = new Date();
    now.setTime(now.getTime() + RESTORE_TOKEN_DURATION * 60 * 1000);

    const token = jwt.sign({}, process.env.RESTORE_TOKEN_SECRET, {
      expiresIn: `${RESTORE_TOKEN_DURATION}m`,
    });

    const restoreToken = new RestoreToken();
    restoreToken.token = token;
    restoreToken.idUser = user.id;
    restoreToken.expirationDate = now;

    // save
    return await queryRunner.manager.save(restoreToken);
  } catch (error) {
    throw new EntityNotFoundError(User, "email");
  }
};
