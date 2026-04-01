import amqp from "amqplib";

const sendMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const exchange = "priority_exchange";
    const queue = "priority_queue";
    const routingKey = "priority_key";

    await channel.assertExchange(exchange,"direct", { durable: true });

    await channel.assertQueue(queue, { 
        durable: true,
        arguments: {"x-max-priority" :10}
    });

    await channel.bindQueue(queue,exchange,routingKey);

    const data = [
      {
        msg: "Hello low: 1",
        priority: 1,
      },
      {
        msg: "Hello high: 8",
        priority: 8,
      },
      {
        msg: "Hello mid: 2",
        priority: 2,
      },
    ];

    // Send messages with different priorities
    data.map((msg) => {
        channel.publish(exchange,routingKey,Buffer.from(msg.msg),{priority: msg.priority});
    });
    console.log(`All Sent Message`);
 
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error", error);
  }
};

sendMessage();
