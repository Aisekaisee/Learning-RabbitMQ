import amqp from "amqplib";

const smsNotification = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const queue = await channel.assertQueue("", { exclusive: true });
    console.log("Waiting for queues => ",queue);

    await channel.bindQueue(queue.queue,exchange,"");

    channel.consume(queue.queue, (msg) => {
      if (msg != null) {
        const product = JSON.parse(msg.content.toString());
        console.log("Sending SMS notification for product => ", product.name);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

smsNotification();
