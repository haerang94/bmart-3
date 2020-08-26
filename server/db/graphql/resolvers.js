import { getUsers } from '../user';
import {
  getProducts,
  getProductById,
  getProductsByCategoryId,
  getPagedProductsByChildCategoryId,
  getPagedProductsByParentCategoryId,
  getNewRelease,
  getPopularItems,
  getRandItems,
  getTimeSaleItems,
} from '../product';

import { getCategoriesParent, getCategoriesChild } from '../category';
export default async function () {
  return {
    Query: {
      Users: async () => await getUsers(),
      Products: async () => await getProducts(),
      Product: async (_, { id }) => await getProductById(id),
      ProductsByCategoryId: async (_, { categoryId, limit }) => await getProductsByCategoryId(categoryId, limit),
      PagedProductsByChildCategoryId: async (_, { categoryId, id, cursor, ordertype, limit, direction }) =>
        await getPagedProductsByChildCategoryId(categoryId, id, cursor, ordertype, limit, direction),
      PagedProductsByParentCategoryId: async (_, { categoryId, id, cursor, ordertype, limit, direction }) =>
        await getPagedProductsByParentCategoryId(categoryId, id, cursor, ordertype, limit, direction),
      CategoriesParent: async () => await getCategoriesParent(),
      CategoriesChild: async (_, { parentId }) => await getCategoriesChild(parentId),
      GetNewRelease: async (_, { limit }) => await getNewRelease(limit),
      GetPopularItems: async (_, { limit }) => await getPopularItems(limit),
      GetRandItems: async (_, { limit }) => await getRandItems(limit),
      GetTimeSaleItems: async (_, { limit }) => await getTimeSaleItems(limit),
    },
  };
}
