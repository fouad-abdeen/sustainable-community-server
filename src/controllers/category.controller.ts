import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
} from "routing-controllers";
import { BaseService } from "../core";
import { CategoryRepository } from "../repositories";
import { Service } from "typedi";
import { CategoryResponse } from "./response/category.response";
import { OpenAPI } from "routing-controllers-openapi";
import {
  CategoryCreationRequest,
  CategoryQuery,
  CategoryUpdateRequest,
} from "./request/category.request";
import { Category } from "../models";
import { CategoryService } from "../services";

@JsonController()
@Service()
export class CategoryController extends BaseService {
  constructor(
    private _categoryService: CategoryService,
    private _categoryRepository: CategoryRepository
  ) {
    super(__filename);
  }

  // #region Get Category
  @Get("/categories/:id")
  @OpenAPI({
    summary: "Get category by id",
    responses: {
      "404": {
        description: "Category not found",
      },
    },
  })
  async getOneCategory(@Param("id") id: string): Promise<CategoryResponse> {
    this._logger.info(`Received a request to get category with id: ${id}`);
    const category = await this._categoryRepository.getOneCategory(id);
    return CategoryResponse.getCategoryResponse(category);
  }
  // #endregion

  // #region Get List of Categories
  @Get("/categories")
  @OpenAPI({
    summary: "Get list of categories",
    responses: {
      "404": {
        description: "Categories not found",
      },
    },
  })
  async getListOfCategories(
    @QueryParams() { type }: CategoryQuery
  ): Promise<CategoryResponse[]> {
    this._logger.info(
      `Received a request to get list of categories with type: ${type}`
    );
    const categories = await this._categoryRepository.getListOfCategories(type);
    return CategoryResponse.getListOfCategoriesResponse(categories);
  }
  // #endregion

  // #region Create Category
  @Authorized()
  @Post("/categories")
  @OpenAPI({
    summary: "Create a category",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
  async createCategory(
    @Body() category: CategoryCreationRequest
  ): Promise<CategoryResponse> {
    this._logger.info(
      `Received a request to create category with name: ${category.name}`
    );
    const newCategory = await this._categoryService.createCategory(category);
    return CategoryResponse.getCategoryResponse(newCategory);
  }
  // #endregion

  // #region Update Category
  @Authorized()
  @Put("/categories/:id")
  @OpenAPI({
    summary: "Update a category",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
  async updateCategory(
    @Param("id") id: string,
    @Body() category: CategoryUpdateRequest
  ): Promise<CategoryResponse> {
    this._logger.info(`Received a request to update category with id: ${id}`);
    const updatedCategory = await this._categoryService.updateCategory({
      _id: id,
      ...category,
    } as Category);
    return CategoryResponse.getCategoryResponse(updatedCategory);
  }
  // #endregion

  // #region Delete Category
  @Authorized()
  @Delete("/categories/:id")
  @OpenAPI({
    summary: "Delete a category",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
  async deleteCategory(@Param("id") id: string): Promise<void> {
    this._logger.info(`Received a request to delete category with id: ${id}`);
    await this._categoryService.deleteCategory(id);
  }
  // #endregion
}
