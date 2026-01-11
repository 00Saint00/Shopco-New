import { account, tables, ID, config } from "../lib/appwrite";
import { Query } from "appwrite";

export const createOrder = async ({ items, total, shippingAddress }) => {
  try {
    const user = await account.get();
    const userId = user.$id;

    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const itemsString = JSON.stringify(items);
    const shippingAddressString = JSON.stringify(shippingAddress);

    //Create order in Appwrite
    const orderResult = await tables.createRow({
      databaseId: config.databaseId,
      tableId: config.ordersTableId,
      rowId: ID.unique(),
      data: {
        userId: userId,
        orderNumber: orderNumber,
        items: itemsString,
        shippingAddress: shippingAddressString,
        total: total,
        status: "pending",
      },
    });

    return {
      success: true,
      message: "Order created successfully",
      order: orderResult,
      orderNumber: orderNumber,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getOrders = async () => {
  try {
    const user = await account.get();
    const userId = user.$id;

    const ordersResult = await tables.listRows({
      databaseId: config.databaseId,
      tableId: config.ordersTableId,
      queries: [Query.equal("userId", userId)],
    });
    return {
      success: true,
      orders: ordersResult.rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
