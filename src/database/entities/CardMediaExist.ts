import { Entity } from "typeorm";
import { CardMedia } from "./CardMedia";

@Entity("v_CardMedias_exist")
export class CardMediaExist extends CardMedia {}
