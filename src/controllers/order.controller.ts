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
import { Service } from "typedi";
import { BaseService, Context, throwError } from "../core";
import { OrderResponse } from "./response";
import { OrderRepository } from "../repositories";
import { UserRole } from "../models";
import { isMongoId } from "class-validator";
import { OrderService } from "../services";
import {
  OrderPlacementRequest,
  OrderQuery,
  OrderUpdateRequest,
} from "./request";

@JsonController("/orders")
@Service()
export class OrderController extends BaseService {
  constructor(
    private _orderRepository: OrderRepository,
    private _orderService: OrderService
  ) {
    super(__filename);
  }

  @Authorized({
    roles: [UserRole.CUSTOMER, UserRole.SELLER],
    disclaimer: "Only customers and sellers can get a list of orders",
  })
  @Get("/")
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

  @Authorized({
    roles: [UserRole.CUSTOMER, UserRole.SELLER],
    disclaimer: "Only customers and sellers can get an order",
  })
  @Get("/:id")
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

  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "Only customers can place an order",
  })
  @Post("/")
  async placeOrder(
    @Body() checkoutInformation: OrderPlacementRequest
  ): Promise<OrderResponse> {
    const user = Context.getUser();

    this._logger.info(
      `Received a request to place an order for the customer with id: ${user._id}`
    );

    const placedOrder = await this._orderService.placeOrder(
      user._id as string,
      checkoutInformation
    );

    return OrderResponse.getOrderResponse(placedOrder);
  }

  @Authorized({
    roles: [UserRole.SELLER],
    disclaimer: "Only sellers can update an order",
  })
  @Put("/")
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

  @Authorized({
    roles: [UserRole.CUSTOMER],
    disclaimer: "Only customers can directly cancel an order",
  })
  @Delete("/:id")
  async cancelOrder(@Param("id") id: string): Promise<OrderResponse> {
    const user = Context.getUser();

    if (!isMongoId(id)) throwError("Invalid or missing order's id", 400);

    this._logger.info(
      `Received a request to cancel order with id: ${id} for the customer with id: ${user._id}`
    );

    const cancelledOrder = await this._orderService.cancelOrder(id);

    return OrderResponse.getOrderResponse(cancelledOrder);
  }
}
