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
import { CategoryResponse } from "./response";
import {
  CategoryCreationRequest,
  CategoryQuery,
  CategoryUpdateRequest,
} from "./request";
import { Category, UserRole } from "../models";
import { CategoryService } from "../services";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";

@JsonController("/categories")
@Service()
export class CategoryController extends BaseService {
  constructor(
    private _categoryRepository: CategoryRepository,
    private _categoryService: CategoryService
  ) {
    super(__filename);
  }

  @Get("/:id")
  @OpenAPI({
    summary: "Get category by id",
  })
  @ResponseSchema(CategoryResponse)
  async getOneCategory(@Param("id") id: string): Promise<CategoryResponse> {
    this._logger.info(`Received a request to get category with id: ${id}`);

    const category = await this._categoryRepository.getOneCategory<Category>(
      id
    );

    return CategoryResponse.getCategoryResponse(category);
  }

  @Get("/item-category/default")
  @OpenAPI({
    summary: "Get default item category",
  })
  @ResponseSchema(CategoryResponse)
  async getDefaultItemCategory(): Promise<CategoryResponse> {
    this._logger.info(`Received a request to get default item category`);

    const category = await this._categoryRepository.getDefaultItemCategory();

    return CategoryResponse.getCategoryResponse(category);
  }

  @Get("/")
  @OpenAPI({
    summary: "Get list of categories",
  })
  @ResponseSchema(CategoryResponse, { isArray: true })
  async getListOfCategories(
    @QueryParams() { type }: CategoryQuery
  ): Promise<CategoryResponse[]> {
    this._logger.info(
      `Received a request to get list of categories with type: ${type}`
    );

    const categories = await this._categoryRepository.getListOfCategories(type);

    return CategoryResponse.getListOfCategoriesResponse(categories);
  }

  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can create a category",
  })
  @Post("/")
  @OpenAPI({
    summary: "Create a new category",
  })
  @ResponseSchema(CategoryResponse)
  async createCategory(
    @Body() category: CategoryCreationRequest
  ): Promise<CategoryResponse> {
    this._logger.info(
      `Received a request to create category with name: ${category.name}`
    );

    const newCategory = await this._categoryRepository.createCategory(category);

    return CategoryResponse.getCategoryResponse(newCategory);
  }

  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can update a category",
  })
  @Put("/:id")
  @OpenAPI({
    summary: "Update a category",
  })
  @ResponseSchema(CategoryResponse)
  async updateCategory(
    @Param("id") id: string,
    @Body() category: CategoryUpdateRequest
  ): Promise<CategoryResponse> {
    this._logger.info(`Received a request to update category with id: ${id}`);

    const updatedCategory = await this._categoryService.updateCategory(
      id,
      category
    );

    return CategoryResponse.getCategoryResponse(updatedCategory);
  }

  @Authorized({
    roles: [UserRole.ADMIN],
    disclaimer: "Only admins can delete a category",
  })
  @Delete("/:id")
  @OpenAPI({
    summary: "Delete a category",
  })
  async deleteCategory(@Param("id") id: string): Promise<void> {
    this._logger.info(`Received a request to delete category with id: ${id}`);

    await this._categoryService.deleteCategory(id);
  }
}
