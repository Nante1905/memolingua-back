import { Entity } from "typeorm";
import { Package } from "./Package";

@Entity("v_package_public")
export class PackagePublic extends Package {}
