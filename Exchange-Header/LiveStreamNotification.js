import amqp from "amqplib";

const consumeLiveStreamNotifications = async () => {
  try {
    const connection = amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";
    const exchangeType = "headers";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const queue = await channel.assertQueue("", { exclusive: true });
    console.log("Waiting for live stream notification");

    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "all",
      "notification-type": "live_stream",
      "content-type": "gaming",
    });

    channel.consume(queue.queue, (msg) => {
      if (msg != null) {
        const message = msg.content.toString();
        console.log("Received live stream notification", message);
        // Process the notification
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

consumeLiveStreamNotifications();