import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const include = {
  material: true,
  category: true,
  sales_person: {
    select: {
      createdAt: true,
      displayName: true,
      email: true,
      id: true,
      photo: true,
    }
  },
  reviews: true
};

const _fetchProducts = async ({ search, o, p, facets, limit }: any) => {
  const data = await db.$transaction([
    db.product.findMany({
      where: {
        category_id: { in: facets?.category },
        material_id: { in: facets?.material },
        rating: { gte: facets?.rating && facets?.rating[0] },
        price: {
          gte: facets?.price_range && facets?.price_range[0].min,
          lte: facets?.price_range && facets?.price_range[0].max,
        },
        sales_person_id: facets?.seller_id,
        ...search,
      },
      include,
      skip: (p - 1) * limit,
      take: limit,
      orderBy: { [o?.item || 'createdAt']: o?.value || 'desc' },
    }),
    db.product.count({
      select: { id: true },
      where: {
        // ...facets,
        // ...search,
      },
    }),
    db.category.findMany(),
    db.material.findMany(),
    db.product.aggregate({
      _min: { price: true },
      _max: { price: true }
    })
  ]);

  return data
}

const _fetchAdminProducts = async (
  userId: string,
  search: any,
  page: number,
  limit: number
) => {
  const data: object = await db.$transaction([
    db.product.findMany({
      where: {
        sales_person_id: userId,
        ...search,

      },
      include,
      skip: (page - 1) * limit,
      take: limit
    }),
    db.product.count({
      select: { id: true },
      where: {
        sales_person_id: userId, ...search
      },
    }),
    db.category.findMany(),
    db.material.findMany()
  ]);

  return data;
};

const _fetchProductById = async (id: string) => {
  const res = await db.product.findUnique({
    where: { id },
    include
  });

  return res;
};

const _addProduct = async (product: any) => {
  const res = await db.product.create({
    data: product,
    include
  });

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
};
