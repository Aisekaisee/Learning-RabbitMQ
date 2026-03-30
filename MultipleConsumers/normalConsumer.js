import amqp from "amqplib";

async function recieveMail() {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    await channel.assertQueue("users_mail_queue", { durable: false });

    channel.consume("users_mail_queue", (message) => {
      if (message != null) {
        console.log(
          "Recv Message for Normal User",
          JSON.parse(message.content),
        );
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

recieveMail();
