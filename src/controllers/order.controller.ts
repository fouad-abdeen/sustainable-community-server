import {
  Authorized,
  Body,
  Delete,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
} from "routing-controllers";
import { Service } from "typedi";
import { BaseService, Context, throwError } from "../core";
import { OrderResponse } from "./response";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { OrderRepository } from "../repositories";
import { UserRole } from "../models";
import { isMongoId } from "class-validator";
import { OrderService } from "../services";
import { OrderQuery, OrderUpdateRequest } from "./request";

@JsonController("/orders")
@Service()
export class OrderController extends BaseService {
  constructor(
    private _orderRepository: OrderRepository,
    private _orderService: OrderService
  ) {
    super(__filename);
  }

  // #region Get List of Orders
  @Authorized({
    roles: [UserRole.CUSTOMER, UserRole.SELLER],
    disclaimer: "Only customers and sellers can get a list of orders",
  })
  @HeaderParam("auth", { required: true })
  @Get("/")
  @OpenAPI({
    summary: "Get list of orders",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(OrderResponse, { isArray: true })
  async getListOfOrders(
    @QueryParams() queryParams: OrderQuery
  ): Promise<OrderResponse[]> {
    const user = Context.getUser();
    const isCustomer = user.role === UserRole.CUSTOMER;

    this._logger.info(
      `Received a request to get list of orders for the ${
        isCustomer ? "customer" : "seller"
      } with id: ${user._id}`
    );

    if (isCustomer) queryParams.customerId = user._id;
    else queryParams.sellerId = user._id;

    return OrderResponse.getListOfOrdersResponse(
      await this._orderRepository.getOrders(queryParams, isCustomer)
    );
  }
  // #endregion

  // #region Get Order
  @Authorized({
    roles: [UserRole.CUSTOMER, UserRole.SELLER],
    disclaimer: "Only customers and sellers can get an order",
  })
  @HeaderParam("auth", { required: true })
  @Get("/:id")
  @OpenAPI({
    summary: "Get order by id",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(OrderResponse)
  async getOrder(@Param("id") id: string): Promise<OrderResponse> {
    const user = Context.getUser();
    const isCustomer = user.role === UserRole.CUSTOMER;

    if (!isMongoId(id)) throwError("Invalid or missing order's id", 400);

    this._logger.info(
      `Received a request to get order with id: ${id} for ${
        isCustomer ? "customer" : "seller"
      } with id: ${user._id}`
    );

    const order = await this._orderRepository.getOrderById(id, {
      customerId: isCustomer ? user._id : undefined,
      sellerId: !isCustomer ? user._id : undefined,
    });

    return OrderResponse.getOrderResponse(order);
  }
  // #endregion

  // #region Place Order
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "Only customers can place an order",
  })
  @HeaderParam("auth", { required: true })
  @Post("/")
  @OpenAPI({
    summary: "Place an order",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(OrderResponse)
  async placeOrder(): Promise<OrderResponse> {
    const user = Context.getUser();

    this._logger.info(
      `Received a request to place an order for the customer with id: ${user._id}`
    );

    const placedOrder = await this._orderService.placeOrder(user._id as string);

    return OrderResponse.getOrderResponse(placedOrder);
  }
  // #endregion

  // #region Update Order
  @Authorized({
    roles: [UserRole.SELLER],
    disclaimer: "Only sellers can update an order",
  })
  @HeaderParam("auth", { required: true })
  @Put("/")
  @OpenAPI({
    summary: "Update an order",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(OrderResponse)
  async updateOrder(
    @Body() request: OrderUpdateRequest
  ): Promise<OrderResponse> {
    const user = Context.getUser();
    const { id, status } = request;

    this._logger.info(
      `Received a request to update order with id: ${id} for the seller with id: ${user._id}`
    );

    const updatedOrder = await this._orderService.updateOrder(id, status);

    return OrderResponse.getOrderResponse(updatedOrder);
  }

  // #endregion

  // #region Cancel Order
  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "Only customers can directly cancel an order",
  })
  @HeaderParam("auth", { required: true })
  @Delete("/:id")
  @OpenAPI({
    summary: "Cancel an order",
    security: [{ bearerAuth: [] }],
  })
  @ResponseSchema(OrderResponse)
  async cancelOrder(@Param("id") id: string): Promise<OrderResponse> {
    const user = Context.getUser();

    if (!isMongoId(id)) throwError("Invalid or missing order's id", 400);

    this._logger.info(
      `Received a request to cancel order with id: ${id} for the customer with id: ${user._id}`
    );

    const cancelledOrder = await this._orderService.cancelOrder(id);

    return OrderResponse.getOrderResponse(cancelledOrder);
  }
  // #endregion
}
