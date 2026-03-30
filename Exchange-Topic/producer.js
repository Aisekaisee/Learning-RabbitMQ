import amqp from 'amqplib';

const sendMessage = async (routingKey,message) => {
    try {
        const connection = await amqp.connect("amqp://localhost:5673");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const exchangeType = "topic";

        await channel.assertExchange(exchange,exchangeType,{durable: true});

        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)));
        console.log("[x] Sent '%s':'%s'",routingKey,JSON.stringify(message));
        console.log(`Message was send! with routing key as ${routingKey} and content as ${message}`);

        setTimeout(() => {
          connection.close();
        }, 500);

    } catch (error) {
        console.log(error);
    }
}

sendMessage("order.placed",{orderId: 12345, status:"placed"});
sendMessage("payment.processed",{orderId: 67890, status:"processed"});