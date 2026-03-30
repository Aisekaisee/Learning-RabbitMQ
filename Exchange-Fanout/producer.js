import amqp from "amqplib";

const announceNewProduct = async (product) => {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();
    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const message = JSON.stringify(product);

    // ignore the routing key
    channel.publish(exchange, "", Buffer.from(message), { persistent: true });
    console.log("Sent =>", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

announceNewProduct({ id: 123, name: "iPhone 19 Pro Max", price: 200000 });
