import amqp from "amqplib";

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    const routingKeyForSubsUser = "send_mail_to_subscribed_users";
    const routingKeyForNormalUser = "send_mail_to_users";

    const message = {
      to: "vipul123@gmail.com",
      from: "normalUser@gmail.com",
      subject: "Internship",
      body: "thank you lag gayiii!!",
    };

    // exchange - "direct"
    await channel.assertExchange(exchange, "direct", { durable: false });

    await channel.assertQueue("suscribed_users_mail_queue", { durable: false });
    await channel.assertQueue("users_mail_queue", { durable: false });

    await channel.bindQueue(
      "suscribed_users_mail_queue",
      exchange,
      routingKeyForSubsUser,
    );

    await channel.bindQueue(
      "users_mail_queue",
      exchange,
      routingKeyForNormalUser,
    );

    channel.publish(
      exchange,
      routingKeyForNormalUser,
      Buffer.from(JSON.stringify(message)),
    );
    console.log("Mail data was sent", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendMail();
