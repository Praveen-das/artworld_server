import { Prisma, PrismaClient } from "@prisma/client";
import { QueryValidator } from "../controller/Utils/QueryValidator";
const db = new PrismaClient();

const include = {
  category: true,
  material: true,
  style: true,
  subject: true,
  inventory: true,
  sales_person: {
    select: {
      createdAt: true,
      displayName: true,
      email: true,
      id: true,
      photo: true,
    },
  },
  reviews: true,
};

function getWhereParams(query: any) {
  let { q, category, sellingOption, collection, subject, style, material, rating, discount, price_range }: any = query;

  let minRating = rating && Math.min(...rating);
  let minDiscount = discount && Math.min(...discount);

  const whereParams = {
    category: { id: category },
    collections: { id: collection },
    subject: { name: { in: subject } },
    style: { name: { in: style } },
    material: { name: { in: material } },
    rating: { gte: minRating },
    discount: { gte: minDiscount },
    price: {
      gte: price_range?.min || undefined,
      lte: price_range?.max || undefined,
    },
    sellingOption,
    name: { search: q },
    id: { search: q },
  };

  return whereParams as Partial<typeof whereParams>;
}

const _fetchProducts = async ({ p, limit, order: orderBy, ...query }: any) => {
  let where = getWhereParams(query);

  const data = await db.product.findMany({
    where,
    include,
    skip: (p - 1) * limit,
    take: limit,
    orderBy,
  });

  return data;
};

const _fetchTopSellingProducts = async ({ p, limit, orderBy, ...query }: any) => {
  let where = getWhereParams(query);

  const data = await db.product.findMany({
    where,
    include,
    skip: (p - 1) * limit,
    take: limit,
    orderBy,
  });

  return data;
};

const _fetchFilterParams = async (query: any) => {
  let where = getWhereParams(query);

  const [
    { id: total },
    {
      _min: { price: min },
      _max: { price: max },
    },
    categories,
    subjects,
    styles,
    materials,
    ratings,

    allCategories,
    allSubjects,
    allStyles,
    allMaterials,
    collections,
    discounts,
  ] = await db.$transaction<any>([
    //total items
    db.product.count({
      select: { id: true },
      where,
    }),
    //min and max price
    db.product.aggregate({
      _min: { price: true },
      _max: { price: true },
      where: undefined,
    }),
    //available categories
    db.product.findMany({
      distinct: ["category_id"],
      select: { category: true },
      orderBy: { category: { name: "desc" } },
    }),
    //available subject
    db.product.findMany({
      distinct: ["subject_id"],
      where: { ...where, subject: undefined },
      select: { subject: true },
      orderBy: { subject: { name: "asc" } },
    }),
    //available style
    db.product.findMany({
      distinct: ["style_id"],
      where: { ...where, style: undefined },
      select: { style: true },
      orderBy: { style: { name: "asc" } },
    }),
    //available materials
    db.product.findMany({
      distinct: ["material_id"],
      where: { ...where, material: undefined },
      select: { material: true },
      orderBy: { material: { name: "asc" } },
    }),
    //available ratings
    db.product.findMany({
      distinct: ["rating"],
      where: { ...where, rating: undefined },
      select: { rating: true },
      orderBy: { rating: "asc" },
    }),

    db.category.findMany({ orderBy: { name: "desc" } }),
    db.subject.findMany({ orderBy: { name: "asc" } }),
    db.style.findMany({ orderBy: { name: "asc" } }),
    db.material.findMany({ orderBy: { name: "asc" } }),
    db.collections.findMany({
      include: { _count: { select: { product: true } } },
      orderBy: { name: "asc" },
    }),
    //available discount
    db.product.findMany({
      distinct: ["discount"],
      where: { ...where, discount: undefined },
      select: { discount: true },
      orderBy: { discount: "asc" },
    }),
  ]);

  return {
    total,
    priceRange: {
      min,
      max,
    },
    categories,
    subjects,
    styles,
    materials,
    ratings,
    allCategories,
    allSubjects,
    allStyles,
    allMaterials,
    collections,
    discounts,
  };
};
// const _fetchCategories = async (query: any) => {
//   let {
//     q,
//     material,
//     category,
//     rating,
//     price_range,
//   }: any = query

//   let minRating = rating && Math.min(...rating)

//   let where = {
//     category: { name: category },
//     price: {
//       gte: price_range?.min || undefined,
//       lte: price_range?.max || undefined,
//     },
//     // sales_person_id: facets?.seller_id,
//     name: { search: q },
//     id: { search: q },
//   }

//   let wedgetItems = {
//     material: { name: { in: material } },
//     rating: { gte: minRating },
//   }

//   const data = await db.$transaction<any>([
//     db.product.findMany({
//       distinct: ['category_id'],
//       select: { category: { select: { name: true } } },
//       orderBy: { category: { name: 'asc' } }
//     }),
//     db.category.findMany({ orderBy: { name: 'asc' } }),
//   ]);

//   let formatedData = {
//     categories: data[0].map(({ category }: any) => category.name),
//     allCategories: data[1],
//   }

//   return formatedData
// }

const _fetchAdminProducts = async (userId: string, query: ReturnType<typeof QueryValidator>) => {
  let { q, p, limit } = query;

  const page = Math.max(1, p);

  const where = {
    sales_person_id: userId,
    name: { search: q },
    id: { search: q },
  };

  const pagination = {
    skip: (page - 1) * limit,
    take: limit,
  };

  const data = await db.$transaction([
    db.product.findMany({
      where,
      include,
      ...pagination,
    }),
    db.product.aggregate({
      _count: { _all: true },
      where,
    }),
  ]);

  return {
    products: data[0],
    total: data[1]._count._all,
  };
};

const _fetchProductById = async (id: string) => {
  const res = await db.product.findUnique({
    where: { id },
    include,
  });

  return res;
};

const _addProduct = async (data: Prisma.ProductCreateInput) => {
  const res = await db.product.create({ data });
  return res;
};

const _removeProduct = async (id: string) => {
  const res = await db.product.delete({ where: { id } });
  return res;
};

const _updateProduct = async (id: string, updates: any) => {
  const res = await db.product.update({
    where: { id },
    data: updates,
    // include
  });
  return res;
};

const _searchProduct = async (query: any) => {
  const data = await db.product.findMany({
    orderBy: query.sort.item === "price" ? { price: "asc" } : { price: "desc" },
    where: {
      name: query.name,
    },
    include,
    take: 20,
  });
  return data;
};

export {
  _fetchProducts,
  _fetchAdminProducts,
  _fetchProductById,
  _addProduct,
  _removeProduct,
  _updateProduct,
  _searchProduct,
  _fetchFilterParams,
  // _fetchCategories,
  _fetchTopSellingProducts,
};
