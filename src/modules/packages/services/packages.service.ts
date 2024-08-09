import { camelCase } from "lodash";
import { Not } from "typeorm";
import { PackagePublic } from "../../../database/entities/PackagePublic";
import { ENTITY_DELETED } from "../../../shared/constant/entity-state.constant";
import { Paginated } from "../../../shared/types/Paginated";
import { PackageWithNbCard } from "../dto/PackageWithNbCard";

// export const getPackagesOf = (idUser: string, idLangage) => {

// }

export const getPublicPackages = async (
  idLangage: string,
  idTheme: string,
  page: { numero: number; size: number }
) => {
  const rawData = await PackagePublic.createQueryBuilder("p")
    .leftJoin("mv_nb_card_package", "n", "p.id=n.id_package")
    .where(
      "p.id_theme=:idTheme and p.id_langage=:idLangage and p.state!=:state",
      {
        idTheme,
        idLangage,
        state: ENTITY_DELETED,
      }
    )
    .offset((page.numero - 1) * page.size)
    .limit(page.size)
    .addSelect(["nb"])
    .getRawMany();

  const totalCount = (
    await PackagePublic.find({
      where: { idTheme, idLangage, state: Not(ENTITY_DELETED) },
    })
  ).length;

  const mappedData = rawData.map((data) => {
    let p = new PackageWithNbCard();
    Object.keys(data).forEach((k) => {
      if (k.includes("_")) {
        p[camelCase(k.slice(2, k.length))] = data[k];
      } else {
        p[k] = data[k];
      }
    });
    return p;
  });

  let paginatedPackages = new Paginated<PackageWithNbCard>(
    mappedData,
    totalCount,
    page.numero,
    page.size
  );

  return paginatedPackages;
};
