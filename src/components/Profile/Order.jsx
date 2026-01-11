import React from "react";
import { getOrders } from "../../services/orderService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../UI/spinner.jsx";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setloading(true);

      try {
        const result = await getOrders();

        if (result.success) {
          setOrders(
            result.orders.map((order) => ({
              ...order,
              items: JSON.parse(order.items),
              shippingAddress: JSON.parse(order.shippingAddress),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setloading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <div>No Orders Yet</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            return (
              <div
                key={order.$id}
                className="border border-black border-opacity-10 rounded-[20px] p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-black border-opacity-10">
                  <div>
                    <h3 className="text-lg font-bold">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      Status: {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      Total: ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={item._id + item.size || index}
                      className="flex items-center gap-4 border border-black border-opacity-10 rounded p-4"
                    >
                      <div>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-bold text-base">{item.title}</h2>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} • Quantity: {item.quantity}
                        </p>
                        <p className="font-bold mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Order;
