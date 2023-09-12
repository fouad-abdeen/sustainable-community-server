import {
  Get,
  JsonController,
  Param,
  QueryParam,
  QueryParams,
} from "routing-controllers";
import { BaseService } from "../core";
import { CategoryRepository } from "../repositories";
import { Service } from "typedi";
import { CategoryResponse } from "./response/category.response";
import { OpenAPI } from "routing-controllers-openapi";
import { CategoryType } from "../models";
import { CategoryRequest } from "./request/category.request";

@JsonController()
@Service()
export class CategoryController extends BaseService {
  constructor(private _categoryRepository: CategoryRepository) {
    super(__filename);
  }

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
    @QueryParams() { type }: CategoryRequest
  ): Promise<CategoryResponse[]> {
    this._logger.info(
      `Received a request to get list of categories with type: ${type}`
    );
    const categories = await this._categoryRepository.getListOfCategories(type);
    return CategoryResponse.getListOfCategoriesResponse(categories);
  }
}
