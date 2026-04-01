import amqp from "amqplib";

async function sendToDelayedQueue(batchId, orders, delay) {
  const connection = await amqp.connect("amqp://localhost:5673");
  const channel = await connection.createChannel();

  const exchange = "delayed_exchange";
  await channel.assertExchange(exchange, "x-delayed-message", {
    arguments: { "x-delayed-type": "direct" },
  });

  const queue = "delayed_order_updates_queue";
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, "");

  const message = JSON.stringify({ batchId, orders });
  channel.publish(exchange, "", Buffer.from(message), {
    headers: { "x-delay": delay },
  });

  console.log("---------------------------------\n");
  console.log(
    `Sent batch ${batchId} update task to delayed queue with ${delay} ms delay`,
  );
  console.log("---------------------------------\n");

  await channel.close();
  await connection.close();
}

async function processBatchOrders() {
  // batch processing
  const batchId = generateBatchId();
  const orders = collectOrdersForBatch();

  console.log("---------------------------------\n");
  console.log(
    `Processing batch:${batchId} with orders: ${JSON.stringify(orders)}`,
  );

  console.log("---------------------------------\n");

  // Update inventory, generate shipping labels etc.
  await processOrders(orders);

  // Send delayed message to update order status
  const delay = 10000; // 10 sec
  sendToDelayedQueue(batchId, orders, delay);
}

function generateBatchId() {
  return "batch-" + Date.now();
}

function collectOrdersForBatch() {
  // Collect orders for the current batch
  return [
    { orderId: 1, item: "Laptop", quantity: 1 },
    { orderId: 2, item: "Phone", quantity: 2 },
  ];
}

async function processOrders(orders) {}

processBatchOrders();
