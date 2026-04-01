import amqp from "amqplib";

const consumeMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const queue = "priority_queue";

    await channel.assertQueue(queue, {
      durable: true,
      arguments: { "x-max-priority": 10 },
    });

    console.log(`Waiting for message is ${queue}.To exit press CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg != null) {
        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming messages", error);
  }
};

consumeMessage();
