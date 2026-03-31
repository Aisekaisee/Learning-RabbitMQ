import amqp from "amqplib";

const consumeNewNotifications = async () => {
  try {
    const connection = amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";
    const exchangeType = "headers";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const queue = await channel.assertQueue("", { exclusive: true });
    console.log("Waiting for new video notification");

    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "all",
      "notification-type": "new_video",
      "content-type": "video",
    });

    channel.consume(queue.queue, (msg) => {
      if (msg != null) {
        const message = msg.content.toString();
        console.log("Received new video notification", message);
        // Notification code yahan aayega
        channel.ack(msg);
      }
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error", error);
  }
};


consumeNewNotifications();
