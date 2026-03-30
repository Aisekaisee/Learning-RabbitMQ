import amqp from "amqplib";

const receiveMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const queue = "payment_queue";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, "payment.*");

    console.log("Waiting for message");
    channel.consume(
      queue,
      (msg) => {
        if (msg != null) {
          console.log(
            `[Payment notification] Msg was consumed with routing key ${msg.fields.routingKey} and content as ${msg.content.toString()}`,
          );
          channel.ack(msg);
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.log(error);
  }
};

receiveMessage();
