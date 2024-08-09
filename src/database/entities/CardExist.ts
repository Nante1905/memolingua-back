import { Entity } from "typeorm";
import { Card } from "./Card";

@Entity("v_Card_exist")
export class CardExist extends Card {}
