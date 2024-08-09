import { Entity } from "typeorm";
import { Package } from "./Package";

@Entity("v_packages_exist")
export class PackageExist extends Package {}
